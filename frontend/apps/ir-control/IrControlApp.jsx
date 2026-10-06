import { useState, useEffect, useCallback, useRef } from 'react';

const DEFAULT_AC = {
  power: false, temp: 24, mode: 'cool', fan: 'med',
  swing_v: 'off', swing_h: 'middle',
  turbo: false, quiet: false, sleep: false, health: false,
};

const MODES = [
  { v: 'auto', l: 'Auto' }, { v: 'cool', l: 'Cool' }, { v: 'dry', l: 'Dry' },
  { v: 'heat', l: 'Heat' }, { v: 'fan', l: 'Fan' },
];
const FANS = [
  { v: 'auto', l: 'Auto' }, { v: 'low', l: 'Low' },
  { v: 'med', l: 'Med' }, { v: 'high', l: 'High' },
];
const SWINGS_V = [
  { v: 'off', l: 'Off' }, { v: 'top', l: 'Top' }, { v: 'middle', l: 'Mid' },
  { v: 'bottom', l: 'Bottom' }, { v: 'down', l: 'Down' }, { v: 'auto', l: 'Auto' },
];
const SWINGS_H = [
  { v: 'middle', l: 'Mid' }, { v: 'left', l: 'Left' }, { v: 'left_max', l: 'L-Max' },
  { v: 'right', l: 'Right' }, { v: 'right_max', l: 'R-Max' }, { v: 'auto', l: 'Auto' },
];
const TOGGLES = [
  { v: 'turbo', l: 'Turbo' }, { v: 'quiet', l: 'Quiet' },
  { v: 'sleep', l: 'Sleep' }, { v: 'health', l: 'Health' },
];

const MODE_RAW = { auto: 0, cool: 1, dry: 2, heat: 4, fan: 6 };
const FAN_RAW = { high: 1, med: 2, low: 3, auto: 5 };
const SWING_V_RAW = { off: 0, top: 1, middle: 2, bottom: 3, down: 10, auto: 12 };
const SWING_H_RAW = { middle: 0, left_max: 3, left: 4, right: 5, right_max: 6, auto: 7 };

function rawToLabel(map, raw) {
  const found = Object.entries(map).find(([, value]) => value === raw);
  return found ? found[0] : null;
}

function mapState(state) {
  if (!state || !state.valid) return null;
  return {
    power: !!state.power,
    temp: state.temp || 24,
    mode: rawToLabel(MODE_RAW, state.mode_raw) || 'cool',
    fan: rawToLabel(FAN_RAW, state.fan_raw) || 'med',
    swing_v: rawToLabel(SWING_V_RAW, state.swing_v_raw) || 'off',
    swing_h: rawToLabel(SWING_H_RAW, state.swing_h_raw) || 'middle',
    turbo: !!state.turbo,
    quiet: !!state.quiet,
    sleep: !!state.sleep,
    health: !!state.health,
  };
}

export default function IrControlApp() {
  const [ac, setAc] = useState(DEFAULT_AC);
  const [hasState, setHasState] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const acRef = useRef(ac);
  acRef.current = ac;

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/ir/status', { credentials: 'include' });
      const data = await res.json();
      const mapped = mapState(data);
      if (mapped) {
        setAc(mapped);
        setHasState(true);
      }
    } catch (err) {
      setError('No se pudo leer el estado del aire');
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 20000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const sendAc = async (partial) => {
    const next = { ...acRef.current, ...partial };
    setAc(next);
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/ir/ac/set', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partial),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'error');
      const mapped = mapState(data.state);
      if (mapped) setAc(mapped);
      setHasState(true);
    } catch (err) {
      setError('No se pudo enviar el comando al aire');
      fetchStatus();
    } finally {
      setSending(false);
    }
  };

  const adjustTemp = (delta) => {
    const temp = Math.min(30, Math.max(16, acRef.current.temp + delta));
    if (temp !== acRef.current.temp) sendAc({ temp });
  };

  return (
    <div className="ir-container">
      <div className="ir-header">
        <a href="/" className="ir-home">← Home</a>
        <h1>IR Control</h1>
      </div>

      {error && <div className="ir-banner ir-banner-err">{error}</div>}
      {!hasState && <div className="ir-banner ir-banner-warn">Sin estado previo del aire; se usarán valores por defecto.</div>}

      <div className="ir-ac">
        <div className="ir-power-row">
          <button
            className={`ir-power ${ac.power ? 'ir-power-on' : ''}`}
            onClick={() => sendAc({ power: !ac.power })}
            disabled={sending}
          >
            <span className="ir-power-icon">⏻</span>
            {ac.power ? 'Encendido' : 'Apagado'}
          </button>
        </div>

        <div className="ir-card">
          <div className="ir-card-title">Temperatura</div>
          <div className="ir-temp">
            <button className="ir-temp-btn" onClick={() => adjustTemp(-1)} disabled={sending || ac.temp <= 16}>−</button>
            <span className="ir-temp-value">{ac.temp}°C</span>
            <button className="ir-temp-btn" onClick={() => adjustTemp(1)} disabled={sending || ac.temp >= 30}>+</button>
          </div>
        </div>

        <div className="ir-card">
          <div className="ir-card-title">Modo</div>
          <div className="ir-seg">
            {MODES.map((m) => (
              <button
                key={m.v}
                className={`ir-seg-btn ${ac.mode === m.v ? 'ir-seg-active' : ''}`}
                onClick={() => sendAc({ mode: m.v })}
                disabled={sending}
              >
                {m.l}
              </button>
            ))}
          </div>
        </div>

        <div className="ir-card">
          <div className="ir-card-title">Ventilador</div>
          <div className="ir-seg">
            {FANS.map((f) => (
              <button
                key={f.v}
                className={`ir-seg-btn ${ac.fan === f.v ? 'ir-seg-active' : ''}`}
                onClick={() => sendAc({ fan: f.v })}
                disabled={sending}
              >
                {f.l}
              </button>
            ))}
          </div>
        </div>

        <div className="ir-card">
          <div className="ir-card-title">Swing vertical</div>
          <div className="ir-seg ir-seg-wrap">
            {SWINGS_V.map((s) => (
              <button
                key={s.v}
                className={`ir-seg-btn ${ac.swing_v === s.v ? 'ir-seg-active' : ''}`}
                onClick={() => sendAc({ swing_v: s.v })}
                disabled={sending}
              >
                {s.l}
              </button>
            ))}
          </div>
        </div>

        <div className="ir-card">
          <div className="ir-card-title">Swing horizontal</div>
          <div className="ir-seg ir-seg-wrap">
            {SWINGS_H.map((s) => (
              <button
                key={s.v}
                className={`ir-seg-btn ${ac.swing_h === s.v ? 'ir-seg-active' : ''}`}
                onClick={() => sendAc({ swing_h: s.v })}
                disabled={sending}
              >
                {s.l}
              </button>
            ))}
          </div>
        </div>

        <div className="ir-card">
          <div className="ir-card-title">Funciones</div>
          <div className="ir-seg ir-seg-wrap">
            {TOGGLES.map((t) => (
              <button
                key={t.v}
                className={`ir-seg-btn ${ac[t.v] ? 'ir-seg-active' : ''}`}
                onClick={() => sendAc({ [t.v]: !ac[t.v] })}
                disabled={sending}
              >
                {t.l}
              </button>
            ))}
          </div>
        </div>

        {sending && <div className="ir-sending">Enviando…</div>}
      </div>
    </div>
  );
}
