import { useState, useEffect, useCallback } from 'react';

const DAYS = [
  { v: 1, l: 'Lun' }, { v: 2, l: 'Mar' }, { v: 3, l: 'Mié' },
  { v: 4, l: 'Jue' }, { v: 5, l: 'Vie' }, { v: 6, l: 'Sáb' }, { v: 0, l: 'Dom' },
];
const MODES = [
  { v: 'auto', l: 'Auto' }, { v: 'cool', l: 'Cool' }, { v: 'dry', l: 'Dry' },
  { v: 'heat', l: 'Heat' }, { v: 'fan', l: 'Fan' },
];
const FANS = [
  { v: 'auto', l: 'Auto' }, { v: 'low', l: 'Low' },
  { v: 'med', l: 'Med' }, { v: 'high', l: 'High' },
];
const HUMIDITY_ACTIONS = [
  { v: 'dry', l: 'Dry' }, { v: 'cool', l: 'Cool' },
];

function emptyRoutine() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  return {
    id: `r${Date.now()}`,
    name: 'Nueva rutina',
    enabled: true,
    days: [1, 2, 3, 4, 5],
    time: `${h}:00`,
    action: 'on',
    state: { mode: 'cool', temp: 24, fan: 'med' },
  };
}

function clampTemp(n) {
  return Math.min(30, Math.max(16, n));
}

export default function ClimateApp() {
  const [config, setConfig] = useState(null);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const loadConfig = useCallback(async () => {
    const res = await fetch('/api/climate/config', { credentials: 'include' });
    if (res.ok) setConfig(await res.json());
  }, []);

  const loadStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/climate/status', { credentials: 'include' });
      if (res.ok) setStatus(await res.json());
    } catch (err) {
      /* status no es crítico */
    }
  }, []);

  useEffect(() => {
    loadConfig().catch(() => setError('No se pudo leer la configuración'));
    loadStatus();
    const interval = setInterval(loadStatus, 30000);
    return () => clearInterval(interval);
  }, [loadConfig, loadStatus]);

  const update = (partial) => {
    setConfig((c) => ({ ...c, ...partial }));
    setNotice('');
  };
  const updateHumidity = (partial) => {
    setConfig((c) => ({ ...c, humidity: { ...c.humidity, ...partial } }));
    setNotice('');
  };

  const save = async () => {
    if (!config) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const res = await fetch('/api/climate/config', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'error');
      setConfig(data.config);
      setNotice('Configuración guardada');
      loadStatus();
    } catch (err) {
      setError(`No se pudo guardar: ${err.message}`);
    } finally {
      setBusy(false);
    }
  };

  const runNow = async () => {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const res = await fetch('/api/climate/run-now', { method: 'POST', credentials: 'include' });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'error');
      setNotice('Evaluación ejecutada');
      loadStatus();
    } catch (err) {
      setError(`No se pudo ejecutar: ${err.message}`);
    } finally {
      setBusy(false);
    }
  };

  const addRoutine = () => update({ routines: [...config.routines, emptyRoutine()] });
  const removeRoutine = (id) => update({ routines: config.routines.filter((r) => r.id !== id) });
  const patchRoutine = (id, partial) =>
    update({ routines: config.routines.map((r) => (r.id === id ? { ...r, ...partial } : r)) });
  const patchRoutineState = (id, partial) =>
    update({
      routines: config.routines.map((r) =>
        r.id === id ? { ...r, state: { ...r.state, ...partial } } : r
      ),
    });
  const toggleDay = (routine, day) =>
    patchRoutine(routine.id, {
      days: routine.days.includes(day)
        ? routine.days.filter((d) => d !== day)
        : [...routine.days, day].sort(),
    });

  if (!config) {
    return (
      <div className="cl-container">
        <div className="cl-header"><h1>Climate</h1></div>
        {error ? <div className="cl-banner cl-banner-err">{error}</div> : <p className="cl-muted">Cargando…</p>}
      </div>
    );
  }

  const sensor = status?.sensor;

  return (
    <div className="cl-container">
      <div className="cl-header">
        <a href="/" className="cl-home">← Home</a>
        <h1>Climate</h1>
      </div>

      {error && <div className="cl-banner cl-banner-err">{error}</div>}
      {notice && !error && <div className="cl-banner cl-banner-ok">{notice}</div>}

      <div className="cl-card cl-master">
        <div className="cl-master-row">
          <div>
            <div className="cl-card-title">Automatización</div>
            <div className="cl-master-state">{config.enabled ? 'Activa' : 'Desactivada'}</div>
          </div>
          <button
            className={`cl-switch ${config.enabled ? 'cl-switch-on' : ''}`}
            onClick={() => update({ enabled: !config.enabled })}
            aria-pressed={config.enabled}
          >
            <span className="cl-switch-knob" />
          </button>
        </div>
        {status && (
          <div className="cl-status">
            <span>Temp: <b>{sensor?.temperature ?? '—'}°C</b></span>
            <span>Humedad: <b>{sensor?.humidity ?? '—'}%</b></span>
            {status.manualOverrideActive && <span className="cl-tag cl-tag-warn">Pausa manual</span>}
            {status.humidityActive && <span className="cl-tag cl-tag-on">Higrostato activo</span>}
            {status.humiditySuspended && <span className="cl-tag cl-tag-muted">Humedad suspendida</span>}
            {status.nextRoutine && (
              <span>
                Próxima: <b>{status.nextRoutine.name}</b> {status.nextRoutine.time}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="cl-card">
        <div className="cl-card-title">Higrostato</div>
        <div className="cl-toggle-row">
          <span>Activar control de humedad</span>
          <button
            className={`cl-switch cl-switch-sm ${config.humidity.enabled ? 'cl-switch-on' : ''}`}
            onClick={() => updateHumidity({ enabled: !config.humidity.enabled })}
          >
            <span className="cl-switch-knob" />
          </button>
        </div>
        <div className="cl-grid">
          <label className="cl-field">
            <span>Umbral (%)</span>
            <input
              type="number" min="20" max="95"
              value={config.humidity.thresholdPct}
              onChange={(e) => updateHumidity({ thresholdPct: Number(e.target.value) })}
            />
          </label>
          <label className="cl-field">
            <span>Histéresis (%)</span>
            <input
              type="number" min="0" max="20"
              value={config.humidity.hysteresisPct}
              onChange={(e) => updateHumidity({ hysteresisPct: Number(e.target.value) })}
            />
          </label>
          <label className="cl-field">
            <span>Temp. objetivo (°C)</span>
            <input
              type="number" min="16" max="30"
              value={config.humidity.targetTemp}
              onChange={(e) => updateHumidity({ targetTemp: clampTemp(Number(e.target.value)) })}
            />
          </label>
        </div>
        <div className="cl-card-title cl-mt">Acción al superar el umbral</div>
        <div className="cl-seg">
          {HUMIDITY_ACTIONS.map((a) => (
            <button
              key={a.v}
              className={`cl-seg-btn ${config.humidity.action === a.v ? 'cl-seg-active' : ''}`}
              onClick={() => updateHumidity({ action: a.v })}
            >
              {a.l}
            </button>
          ))}
        </div>
      </div>

      <div className="cl-card">
        <div className="cl-card-title">Rutinas de horario</div>
        <div className="cl-routines">
          {config.routines.length === 0 && <p className="cl-muted">Sin rutinas. Agrega una.</p>}
          {config.routines.map((r) => (
            <div key={r.id} className="cl-routine">
              <div className="cl-routine-head">
                <input
                  className="cl-routine-name"
                  value={r.name}
                  onChange={(e) => patchRoutine(r.id, { name: e.target.value })}
                />
                <button
                  className={`cl-switch cl-switch-sm ${r.enabled ? 'cl-switch-on' : ''}`}
                  onClick={() => patchRoutine(r.id, { enabled: !r.enabled })}
                >
                  <span className="cl-switch-knob" />
                </button>
                <button className="cl-del" onClick={() => removeRoutine(r.id)} title="Eliminar">✕</button>
              </div>

              <div className="cl-routine-row">
                <label className="cl-field cl-field-sm">
                  <span>Hora</span>
                  <input
                    type="time"
                    value={r.time}
                    onChange={(e) => patchRoutine(r.id, { time: e.target.value })}
                  />
                </label>
                <div className="cl-seg cl-seg-inline">
                  <button
                    className={`cl-seg-btn ${r.action === 'on' ? 'cl-seg-active' : ''}`}
                    onClick={() => patchRoutine(r.id, { action: 'on' })}
                  >Encender</button>
                  <button
                    className={`cl-seg-btn ${r.action === 'off' ? 'cl-seg-active' : ''}`}
                    onClick={() => patchRoutine(r.id, { action: 'off' })}
                  >Apagar</button>
                </div>
              </div>

              <div className="cl-days">
                {DAYS.map((d) => (
                  <button
                    key={d.v}
                    className={`cl-day ${r.days.includes(d.v) ? 'cl-day-on' : ''}`}
                    onClick={() => toggleDay(r, d.v)}
                  >{d.l}</button>
                ))}
              </div>

              {r.action === 'on' && (
                <div className="cl-routine-row">
                  <label className="cl-field cl-field-sm">
                    <span>Modo</span>
                    <select value={r.state.mode} onChange={(e) => patchRoutineState(r.id, { mode: e.target.value })}>
                      {MODES.map((m) => <option key={m.v} value={m.v}>{m.l}</option>)}
                    </select>
                  </label>
                  <label className="cl-field cl-field-sm">
                    <span>Temp</span>
                    <input
                      type="number" min="16" max="30"
                      value={r.state.temp}
                      onChange={(e) => patchRoutineState(r.id, { temp: clampTemp(Number(e.target.value)) })}
                    />
                  </label>
                  <label className="cl-field cl-field-sm">
                    <span>Fan</span>
                    <select value={r.state.fan} onChange={(e) => patchRoutineState(r.id, { fan: e.target.value })}>
                      {FANS.map((f) => <option key={f.v} value={f.v}>{f.l}</option>)}
                    </select>
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>
        <button className="cl-add" onClick={addRoutine}>+ Agregar rutina</button>
      </div>

      <div className="cl-card">
        <div className="cl-card-title">Ajustes avanzados</div>
        <div className="cl-grid">
          <label className="cl-field">
            <span>Anti-ciclado (min)</span>
            <input type="number" min="1" max="60" value={config.minCycleMinutes}
              onChange={(e) => update({ minCycleMinutes: Number(e.target.value) })} />
          </label>
          <label className="cl-field">
            <span>Resync (min, 0=off)</span>
            <input type="number" min="0" max="120" value={config.resyncMinutes}
              onChange={(e) => update({ resyncMinutes: Number(e.target.value) })} />
          </label>
          <label className="cl-field">
            <span>Pausa tras manual (min)</span>
            <input type="number" min="0" max="240" value={config.respectManualOverrideMin}
              onChange={(e) => update({ respectManualOverrideMin: Number(e.target.value) })} />
          </label>
        </div>
      </div>

      <div className="cl-actions">
        <button className="cl-save" onClick={save} disabled={busy}>
          {busy ? 'Guardando…' : 'Guardar configuración'}
        </button>
        <button className="cl-run" onClick={runNow} disabled={busy}>Evaluar ahora</button>
      </div>

      <div className="cl-card">
        <div className="cl-card-title">Actividad reciente</div>
        {(!status || status.log.length === 0) && <p className="cl-muted">Sin actividad.</p>}
        <ul className="cl-log">
          {status?.log.map((e, i) => (
            <li key={i} className={e.ok ? '' : 'cl-log-fail'}>
              <span className="cl-log-time">{new Date(e.ts).toLocaleString()}</span>
              <span className="cl-log-rule">{e.rule}</span>
              <span className="cl-log-detail">{e.detail}{e.error ? ` (${e.error})` : ''}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
