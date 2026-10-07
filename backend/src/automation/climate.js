const persistence = require('../data/persistence');
const sensors = require('../db/sensors');
const acState = require('../data/ac-state');
const { applyAcState } = require('../services/ac');

const MODES = ['auto', 'cool', 'dry', 'heat', 'fan'];
const FANS = ['auto', 'low', 'med', 'high'];
const HUMIDITY_ACTIONS = ['dry', 'cool'];
const LOG_LIMIT = 50;
const CATCH_UP_MINUTES = 2;

const DEFAULTS = {
  enabled: false,
  minCycleMinutes: 4,
  resyncMinutes: 10,
  respectManualOverrideMin: 30,
  humidity: {
    enabled: false,
    thresholdPct: 65,
    hysteresisPct: 5,
    action: 'cool',
    targetTemp: 24,
  },
  routines: [],
};

let config = { ...DEFAULTS, humidity: { ...DEFAULTS.humidity }, routines: [] };
let log = [];

/* Runtime (no persistido) */
let lastFired = {};
let humidityActive = false;
let humiditySuspended = false;
let lastPowerChangeAt = 0;
let lastApplyAt = 0;
let lastManualOverrideAt = 0;

function clamp(n, min, max, fallback) {
  const v = Math.round(Number(n));
  if (Number.isNaN(v)) return fallback;
  return Math.min(max, Math.max(min, v));
}

function bool(value, fallback = false) {
  if (value === undefined || value === null) return fallback;
  return value === true || value === 1 || value === '1' ||
    value === 'on' || value === 'true' || value === 'yes';
}

function parseTime(value) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(value || '').trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return { h, m: min, label: `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}` };
}

function sanitizeDays(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((d) => Number(d)).filter((d) => Number.isInteger(d) && d >= 0 && d <= 6))].sort();
}

function sanitizeRoutine(input, index) {
  const baseState = { mode: 'cool', temp: 24, fan: 'med' };
  const state = input && input.state && typeof input.state === 'object' ? input.state : {};
  const time = parseTime(input && input.time);
  return {
    id: input && input.id ? String(input.id) : `r${Date.now()}${index}`,
    name: input && input.name ? String(input.name).slice(0, 40) : `Rutina ${index + 1}`,
    enabled: input && input.enabled !== undefined ? bool(input.enabled, true) : true,
    days: sanitizeDays(input && input.days),
    time: time ? time.label : '08:00',
    action: input && input.action === 'off' ? 'off' : 'on',
    state: {
      mode: MODES.includes(state.mode) ? state.mode : baseState.mode,
      temp: clamp(state.temp, 16, 30, baseState.temp),
      fan: FANS.includes(state.fan) ? state.fan : baseState.fan,
    },
  };
}

function sanitizeConfig(input = {}) {
  const humidity = input.humidity || {};
  return {
    enabled: bool(input.enabled, DEFAULTS.enabled),
    minCycleMinutes: clamp(input.minCycleMinutes, 1, 60, DEFAULTS.minCycleMinutes),
    resyncMinutes: clamp(input.resyncMinutes, 0, 120, DEFAULTS.resyncMinutes),
    respectManualOverrideMin: clamp(input.respectManualOverrideMin, 0, 240, DEFAULTS.respectManualOverrideMin),
    humidity: {
      enabled: bool(humidity.enabled, DEFAULTS.humidity.enabled),
      thresholdPct: clamp(humidity.thresholdPct, 20, 95, DEFAULTS.humidity.thresholdPct),
      hysteresisPct: clamp(humidity.hysteresisPct, 0, 20, DEFAULTS.humidity.hysteresisPct),
      action: HUMIDITY_ACTIONS.includes(humidity.action) ? humidity.action : DEFAULTS.humidity.action,
      targetTemp: clamp(humidity.targetTemp, 16, 30, DEFAULTS.humidity.targetTemp),
    },
    routines: Array.isArray(input.routines)
      ? input.routines.slice(0, 50).map(sanitizeRoutine)
      : [],
  };
}

function load() {
  const saved = persistence.loadClimateConfig();
  config = sanitizeConfig({ ...DEFAULTS, ...(saved || {}) });
  const savedLog = persistence.loadClimateLog();
  log = Array.isArray(savedLog) ? savedLog.slice(0, LOG_LIMIT) : [];
  return config;
}

function getConfig() {
  return config;
}

function getLog() {
  return log;
}

function saveConfig(input = {}) {
  const merged = {
    ...config,
    ...input,
    humidity: { ...config.humidity, ...(input.humidity || {}) },
  };
  config = sanitizeConfig(merged);
  persistence.saveClimateConfig(config);
  return config;
}

function addLog(entry) {
  log = [{ ts: new Date().toISOString(), ...entry }, ...log].slice(0, LOG_LIMIT);
  persistence.saveClimateLog(log);
}

function noteManualOverride() {
  lastManualOverrideAt = Date.now();
}

function minutesOfDay(date) {
  return date.getHours() * 60 + date.getMinutes();
}

function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

function dueRoutine(now) {
  const nowMin = minutesOfDay(now);
  const day = now.getDay();
  const today = dateKey(now);

  for (const routine of config.routines) {
    if (!routine.enabled) continue;
    if (!routine.days.includes(day)) continue;
    const parsed = parseTime(routine.time);
    if (!parsed) continue;
    const target = parsed.h * 60 + parsed.m;
    const diff = nowMin - target;
    if (diff < 0 || diff > CATCH_UP_MINUTES) continue;
    const key = `${today}:${routine.id}`;
    if (lastFired[key]) continue;
    return { routine, key };
  }
  return null;
}

function inCooldown(now) {
  return now.getTime() - lastPowerChangeAt < config.minCycleMinutes * 60000;
}

async function send(partial, { rule, detail, changesPower }) {
  try {
    await applyAcState(partial);
    lastApplyAt = Date.now();
    if (changesPower) lastPowerChangeAt = Date.now();
    addLog({ rule, detail, ok: true });
    return true;
  } catch (err) {
    addLog({ rule, detail, ok: false, error: err.message });
    return false;
  }
}

async function applySchedule(now) {
  const due = dueRoutine(now);
  if (!due) return false;

  const { routine, key } = due;
  lastFired[key] = true;

  if (routine.action === 'off') {
    humiditySuspended = true;
    humidityActive = false;
    if (inCooldown(now)) {
      addLog({ rule: routine.name, detail: 'off omitido por anti-ciclado', ok: false });
      return false;
    }
    await send({ power: false }, { rule: routine.name, detail: 'apagar', changesPower: true });
    return true;
  }

  humiditySuspended = false;
  humidityActive = false;
  const affectsPower = !acState.get().power;
  if (affectsPower && inCooldown(now)) {
    addLog({ rule: routine.name, detail: 'on omitido por anti-ciclado', ok: false });
    return false;
  }
  await send(
    { power: true, mode: routine.state.mode, temp: routine.state.temp, fan: routine.state.fan },
    { rule: routine.name, detail: `encender ${routine.state.mode} ${routine.state.temp}C`, changesPower: affectsPower }
  );
  return true;
}

async function applyHumidity(now) {
  const rule = config.humidity;
  if (!rule.enabled || humiditySuspended) return false;

  const latest = sensors.getLatest();
  if (!latest || latest.humidity == null) return false;

  const humidity = Number(latest.humidity);

  if (humidityActive && humidity <= rule.thresholdPct - rule.hysteresisPct) {
    humidityActive = false;
    if (inCooldown(now)) {
      addLog({ rule: 'higrostato', detail: 'fin humedad omitido por anti-ciclado', ok: false });
      return false;
    }
    const wasOn = acState.get().power;
    await send({ power: false }, { rule: 'higrostato', detail: `humedad ${humidity}% -> apagar`, changesPower: wasOn });
    return true;
  }

  if (!humidityActive && humidity >= rule.thresholdPct) {
    const wasOff = !acState.get().power;
    if (wasOff && inCooldown(now)) {
      addLog({ rule: 'higrostato', detail: 'encendido omitido por anti-ciclado', ok: false });
      return false;
    }
    const ok = await send(
      { power: true, mode: rule.action, temp: rule.targetTemp },
      { rule: 'higrostato', detail: `humedad ${humidity}% -> ${rule.action}`, changesPower: wasOff }
    );
    if (ok) humidityActive = true;
    return ok;
  }

  return false;
}

async function maybeResync(now) {
  if (config.resyncMinutes <= 0) return;
  if (now.getTime() - lastApplyAt < config.resyncMinutes * 60000) return;
  if (!acState.get().valid || !acState.get().power) return;
  await send({}, { rule: 'resync', detail: 'reenvio estado absoluto', changesPower: false });
}

async function tick(now = new Date(), { force = false } = {}) {
  if (!config.enabled && !force) return { ran: false };

  if (!force && config.respectManualOverrideMin > 0 &&
      now.getTime() - lastManualOverrideAt < config.respectManualOverrideMin * 60000) {
    return { ran: false, reason: 'manual-override' };
  }

  if (await applySchedule(now)) return { ran: true };
  if (await applyHumidity(now)) return { ran: true };
  await maybeResync(now);
  return { ran: true };
}

function sensorSnapshot() {
  const latest = sensors.getLatest();
  if (!latest) return null;
  return {
    temperature: latest.temperature,
    humidity: latest.humidity,
    unit: latest.unit || 'celsius',
    timestamp: latest.timestamp,
  };
}

function nextRoutine(now = new Date()) {
  const nowMin = minutesOfDay(now);
  let best = null;
  for (let offset = 0; offset < 7; offset++) {
    const day = (now.getDay() + offset) % 7;
    for (const routine of config.routines) {
      if (!routine.enabled || !routine.days.includes(day)) continue;
      const parsed = parseTime(routine.time);
      if (!parsed) continue;
      const target = parsed.h * 60 + parsed.m;
      if (offset === 0 && target < nowMin) continue;
      const deltaMin = offset * 1440 + target - nowMin;
      if (!best || deltaMin < best.deltaMin) {
        best = { name: routine.name, time: routine.time, action: routine.action, inMinutes: deltaMin };
      }
    }
    if (best) break;
  }
  return best;
}

function status() {
  return {
    enabled: config.enabled,
    humidityActive,
    humiditySuspended,
    manualOverrideActive:
      config.respectManualOverrideMin > 0 &&
      Date.now() - lastManualOverrideAt < config.respectManualOverrideMin * 60000,
    sensor: sensorSnapshot(),
    ac: acState.serialize(),
    nextRoutine: nextRoutine(),
    log,
  };
}

load();

module.exports = {
  DEFAULTS,
  load,
  getConfig,
  saveConfig,
  getLog,
  noteManualOverride,
  tick,
  status,
};
