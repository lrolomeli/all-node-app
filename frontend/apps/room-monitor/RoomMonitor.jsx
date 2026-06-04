import { useState, useEffect, useCallback } from 'react';
import LiveGauge from './components/LiveGauge';
import LineChart24h from './components/LineChart24h';
import DailyStats from './components/DailyStats';
import MonthHeatmap from './components/MonthHeatmap';
import TrendAnalysis from './components/TrendAnalysis';

const TABS = [
  { id: 'live', label: 'Live' },
  { id: '24h', label: '24h' },
  { id: 'stats', label: 'Stats' },
  { id: 'month', label: 'Month' },
  { id: 'trends', label: 'Trends' },
];

export default function RoomMonitor() {
  const [tab, setTab] = useState('live');
  const [liveData, setLiveData] = useState(null);
  const [liveLoading, setLiveLoading] = useState(true);
  const [history24h, setHistory24h] = useState(null);
  const [dailyStats, setDailyStats] = useState(null);
  const [heatmapData, setHeatmapData] = useState(null);
  const [trendData, setTrendData] = useState(null);

  const fetchLive = useCallback(async () => {
    try {
      const res = await fetch('/api/sensors/current');
      if (res.ok) setLiveData(await res.json());
    } catch (err) {
      console.error('Live fetch failed:', err);
    } finally {
      setLiveLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLive();
    const interval = setInterval(fetchLive, 60000);
    return () => clearInterval(interval);
  }, [fetchLive]);

  useEffect(() => {
    if (tab === '24h') {
      fetch('/api/sensors/history?range=24h')
        .then(r => r.ok ? r.json() : [])
        .then(setHistory24h);
    }
  }, [tab]);

  useEffect(() => {
    if (tab === 'stats') {
      const today = new Date().toISOString().slice(0, 10);
      fetch(`/api/sensors/stats?date=${today}`)
        .then(r => r.json())
        .then(setDailyStats);
    }
  }, [tab]);

  useEffect(() => {
    if (tab === 'month') {
      const month = new Date().toISOString().slice(0, 7);
      fetch(`/api/sensors/heatmap?month=${month}`)
        .then(r => r.json())
        .then(setHeatmapData);
    }
  }, [tab]);

  useEffect(() => {
    if (tab === 'trends') {
      fetch('/api/sensors/trends?days=30')
        .then(r => r.json())
        .then(setTrendData);
    }
  }, [tab]);

  return (
    <div className="rm-container">
      <div className="rm-header">
        <a href="/" className="rm-home">← Home</a>
        <h1>Room Monitor</h1>
      </div>

      <div className="rm-tabs">
        {TABS.map(t => (
          <button key={t.id} className={`rm-tab ${tab === t.id ? 'rm-tab-active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="rm-content">
        {tab === 'live' && <LiveGauge data={liveData} loading={liveLoading} />}
        {tab === '24h' && <LineChart24h data={history24h} />}
        {tab === 'stats' && <DailyStats stats={dailyStats} />}
        {tab === 'month' && <MonthHeatmap data={heatmapData} />}
        {tab === 'trends' && <TrendAnalysis data={trendData} />}
      </div>
    </div>
  );
}
