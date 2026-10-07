const persistence = require('../data/persistence');
const sensors = require('../db/sensors');
const acState = require('../data/ac-state');
const { applyAcState } = require('../services/ac');

const MODES = ['auto', 'cool', 'dry', 'heat', 'fan'];
const FANS = ['auto', 'low', 'med', 'high'];
const HUMIDITY_ACTIONS = ['dry', 'cool'];
const LOG_LIMIT = 50;
const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

/*
 * Las automatizaciones viven en el codigo (no en la UI). El usuario solo
 * decide si el motor esta encendido o apagado; el resto lo editamos aqui.
 */
const PRESET_ROUTINES = [
  {
    id: 'sleep-prep',
    name: 'Preparar sueño',
    kind: 'at',
    enabled: true,
    days: ALL_DAYS,
    time: '22:30',
    action: 'on',
    state: { mode: 'cool', temp: 22, fan: 'med' },
  },
  {
    id: 'dawn-ramp',
    name: 'Amanecer gradual',
    kind: 'ramp',
    enabled: true,
    days: ALL_DAYS,
    start: '05:30',
    end: '07:00',
    fromTemp: 22,
    toTemp: 25,
    stepMinutes: 20,
    endAction: 'off',
    state: { mode: 'cool', fan: 'med' },
  },
];

const DEFAULTS = {
  enabled: true,
  minCycleMinutes: 4,
  resyncMinutes: 10,
  respectManualOverrideMin: 30,
  humidity: {
    enabled: true,
    thresholdPct: 65,
    hysteresisPct: 5,
    action: 'dry',
    targetTemp: 24,
  },
  routines: PRESET_ROUTINES,
};

let config = {
  ...DEFAULTS,
  humidity: { ...DEFAULTS.humidity },
  routines: PRESET_ROUTINES,
};
let log = [];

/* Runtime (no persistido) */
let humidityActive = false;
let lastPowerChangeAt = 0;
let lastApplyAt = 0;
let lastManualOverrideAt = 0;
let lastDesiredKey = '';

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
  return { h, m: min, label: `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`, minutes: h * 60 + min };
}

function sanitizeDays(value) {
  if (!Array.isArray(value)) return [...ALL_DAYS];
  const days = [...new Set(value.map((d) => Number(d)).filter((d) => Number.isInteger(d) && d >= 0 && d <= 6))].sort();
  return days.length ? days : [...ALL_DAYS];
}

function sanitizeRoutine(input, index) {
  const state = input && input.state && typeof input.state === 'object' ? input.state : {};
  const kind = input && input.kind === 'ramp' ? 'ramp' : 'at';
  const base = {
    id: input && input.id ? String(input.id) : `r${Date.now()}${index}`,
    name: input && input.name ? String(input.name).slice(0, 40) : `Rutina ${index + 1}`,
    kind,
    enabled: input && input.enabled !== undefined ? bool(input.enabled, true) : true,
    days: sanitizeDays(input && input.days),
    state: {
      mode: MODES.includes(state.mode) ? state.mode : 'cool',
      temp: clamp(state.temp, 16, 30, 24),
      fan: FANS.includes(state.fan) ? state.fan : 'med',
    },
  };

  if (kind === 'ramp') {
    const start = parseTime(input && input.start) || parseTime('05:30');
    const end = parseTime(input && input.end) || parseTime('07:00');
    return {
      ...base,
      start: start.label,
      end: end.label,
      fromTemp: clamp(input && input.fromTemp, 16, 30, 22),
      toTemp: clamp(input && input.toTemp, 16, 30, 25),
      stepMinutes: clamp(input && input.stepMinutes, 1, 120, 20),
      endAction: input && input.endAction === 'hold' ? 'hold' : 'off',
    };
  }

  const time = parseTime(input && input.time) || parseTime('08:00');
  return {
    ...base,
    time: time.label,
    action: input && input.action === 'off' ? 'off' : 'on',
  };
}

function buildConfig() {
  return {
    enabled: DEFAULTS.enabled,
    minCycleMinutes: DEFAULTS.minCycleMinutes,
    resyncMinutes: DEFAULTS.resyncMinutes,
    respectManualOverrideMin: DEFAULTS.respectManualOverrideMin,
    humidity: { ...DEFAULTS.humidity },
    routines: PRESET_ROUTINES.map(sanitizeRoutine),
  };
}

function load() {
  config = buildConfig();
  const saved = persistence.loadClimateConfig();
  if (saved && typeof saved.enabled !== 'undefined') {
    config.enabled = bool(saved.enabled, DEFAULTS.enabled);
  }
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

function setEnabled(value) {
  config.enabled = bool(value, config.enabled);
  lastDesiredKey = '';
  persistence.saveClimateConfig({ enabled: config.enabled });
  return config.enabled;
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

function inCooldown(now) {
  return now.getTime() - lastPowerChangeAt < config.minCycleMinutes * 60000;
}

function dateOnly(now, offsetDays) {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() - offsetDays);
}

/*
 * Estado que el horario quiere en este momento. Se calcula de forma
 * determinista (sobrevive reinicios): mira si hay una rampa en curso y, si no,
 * toma el ultimo evento de horario de los ultimos 7 dias.
 */
function scheduleBase(now) {
  const nowMin = minutesOfDay(now);

  for (const routine of config.routines) {
    if (!routine.enabled || routine.kind !== 'ramp') continue;
    if (!routine.days.includes(now.getDay())) continue;
    const start = parseTime(routine.start);
    const end = parseTime(routine.end);
    if (!start || !end || end.minutes <= start.minutes) continue;
    if (nowMin < start.minutes || nowMin > end.minutes) continue;
    const steps = Math.floor((nowMin - start.minutes) / routine.stepMinutes);
    const temp = Math.min(routine.toTemp, routine.fromTemp + steps);
    return { power: true, mode: routine.state.mode, temp, fan: routine.state.fan, rule: routine.name };
  }

  let best = null;
  for (let offset = 0; offset < 7; offset += 1) {
    const day = dateOnly(now, offset);
    const dayIndex = day.getDay();
    for (const routine of config.routines) {
      if (!routine.enabled || !routine.days.includes(dayIndex)) continue;

      let eventMin;
      let state;
      if (routine.kind === 'ramp') {
        const end = parseTime(routine.end);
        if (!end) continue;
        eventMin = end.minutes;
        state = routine.endAction === 'off'
          ? { power: false, rule: routine.name }
          : { power: true, mode: routine.state.mode, temp: routine.toTemp, fan: routine.state.fan, rule: routine.name };
      } else {
        const time = parseTime(routine.time);
        if (!time) continue;
        eventMin = time.minutes;
        state = routine.action === 'off'
          ? { power: false, rule: routine.name }
          : { power: true, mode: routine.state.mode, temp: routine.state.temp, fan: routine.state.fan, rule: routine.name };
      }

      if (offset === 0 && eventMin > nowMin) continue;
      const eventDate = new Date(day);
      eventDate.setHours(0, eventMin, 0, 0);
      if (!best || eventDate > best.date) best = { date: eventDate, state };
    }
  }
  return best ? best.state : null;
}

function humidityDecision() {
  const rule = config.humidity;
  if (!rule.enabled) {
    humidityActive = false;
    return { active: false, humidity: null };
  }
  const latest = sensors.getLatest();
  if (!latest || latest.humidity == null) return { active: humidityActive, humidity: null };
  const humidity = Number(latest.humidity);
  const release = rule.thresholdPct - rule.hysteresisPct;

  if (!humidityActive && humidity >= rule.thresholdPct) humidityActive = true;
  else if (humidityActive && humidity <= release) humidityActive = false;

  return { active: humidityActive, humidity };
}

function computeTarget(now) {
  const base = scheduleBase(now);
  const humidity = humidityDecision();

  if (humidity.active) {
    const target = { power: true, mode: config.humidity.action, temp: config.humidity.targetTemp };
    if (base && base.power && base.fan) target.fan = base.fan;
    const pct = humidity.humidity == null ? '?' : humidity.humidity;
    return {
      target,
      rule: 'Higrostato',
      detail: `humedad ${pct}% -> ${config.humidity.action} ${config.humidity.targetTemp}C`,
    };
  }

  if (base) {
    if (!base.power) return { target: { power: false }, rule: base.rule, detail: 'apagar' };
    return {
      target: { power: true, mode: base.mode, temp: base.temp, fan: base.fan },
      rule: base.rule,
      detail: `${base.mode} ${base.temp}C`,
    };
  }

  return { target: { power: false }, rule: 'Automático', detail: 'sin regla activa' };
}

function signature(target) {
  return [target.power ? 'on' : 'off', target.mode || '', target.temp ?? '', target.fan || ''].join('|');
}

async function maybeResync(now) {
  if (config.resyncMinutes <= 0) return;
  if (now.getTime() - lastApplyAt < config.resyncMinutes * 60000) return;
  if (!acState.get().power) return;
  try {
    await applyAcState({});
    lastApplyAt = Date.now();
  } catch (err) {
    addLog({ rule: 'resync', detail: 'reenvio fallido', ok: false, error: err.message });
  }
}

async function tick(now = new Date(), { force = false } = {}) {
  if (!config.enabled && !force) return { ran: false, reason: 'disabled' };

  const { target, rule, detail } = computeTarget(now);
  const key = signature(target);

  if (key !== lastDesiredKey) {
    const manualPause = !force && config.respectManualOverrideMin > 0 &&
      now.getTime() - lastManualOverrideAt < config.respectManualOverrideMin * 60000;
    if (manualPause) return { ran: false, reason: 'manual-override' };

    const changesPower = target.power !== acState.get().power;
    if (changesPower && inCooldown(now) && !force) {
      addLog({ rule, detail: `${detail} (omitido por anti-ciclado)`, ok: false });
      return { ran: true, applied: false, reason: 'cooldown' };
    }

    try {
      await applyAcState(target);
      lastApplyAt = Date.now();
      if (changesPower) lastPowerChangeAt = Date.now();
      lastDesiredKey = key;
      addLog({ rule, detail, ok: true });
      return { ran: true, applied: true };
    } catch (err) {
      addLog({ rule, detail, ok: false, error: err.message });
      return { ran: true, applied: false, error: err.message };
    }
  }

  await maybeResync(now);
  return { ran: true, applied: false };
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
  for (let offset = 0; offset < 7; offset += 1) {
    const dayIndex = dateOnly(now, -offset).getDay();
    let best = null;
    for (const routine of config.routines) {
      if (!routine.enabled || !routine.days.includes(dayIndex)) continue;
      const parsed = routine.kind === 'ramp' ? parseTime(routine.start) : parseTime(routine.time);
      if (!parsed) continue;
      if (offset === 0 && parsed.minutes < nowMin) continue;
      const deltaMin = offset * 1440 + parsed.minutes - nowMin;
      if (!best || deltaMin < best.inMinutes) {
        best = {
          name: routine.name,
          time: parsed.label,
          action: routine.kind === 'ramp' ? 'ramp' : routine.action,
          inMinutes: deltaMin,
        };
      }
    }
    if (best) return best;
  }
  return null;
}

function describeSchedule() {
  return config.routines.map((routine) => (
    routine.kind === 'ramp'
      ? {
          id: routine.id,
          name: routine.name,
          kind: 'ramp',
          enabled: routine.enabled,
          days: routine.days,
          start: routine.start,
          end: routine.end,
          fromTemp: routine.fromTemp,
          toTemp: routine.toTemp,
          stepMinutes: routine.stepMinutes,
          mode: routine.state.mode,
          fan: routine.state.fan,
          endAction: routine.endAction,
        }
      : {
          id: routine.id,
          name: routine.name,
          kind: 'at',
          enabled: routine.enabled,
          days: routine.days,
          time: routine.time,
          action: routine.action,
          state: routine.state,
        }
  ));
}

function status() {
  return {
    enabled: config.enabled,
    humidityActive,
    manualOverrideActive:
      config.respectManualOverrideMin > 0 &&
      Date.now() - lastManualOverrideAt < config.respectManualOverrideMin * 60000,
    sensor: sensorSnapshot(),
    ac: acState.serialize(),
    nextRoutine: nextRoutine(),
    schedule: describeSchedule(),
    humidity: { ...config.humidity },
    log,
  };
}

load();

module.exports = {
  DEFAULTS,
  load,
  getConfig,
  getLog,
  setEnabled,
  noteManualOverride,
  tick,
  status,
};
