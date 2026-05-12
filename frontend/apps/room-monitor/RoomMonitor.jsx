import { useState, useEffect, useCallback, useRef } from 'react'

const SENSOR_API = '/api/sensors'

const FALLBACK = [
  { temperature: 42, humidity: 99.9, status: 'success', unit: 'celsius', msg: 'Does anyone have a towel?' },
  { temperature: 666, humidity: 0, status: 'success', unit: 'celsius', msg: 'The sensor has ascended to hell' },
  { temperature: -17, humidity: 100, status: 'success', unit: 'celsius', msg: 'Welcome to the Arctic, enjoy the ice' },
  { temperature: 100, humidity: 0, status: 'success', unit: 'celsius', msg: 'Perfect weather for boiling pasta' },
  { temperature: 30, humidity: 110, status: 'success', unit: 'celsius', msg: 'It rained. Indoors. Somehow.' },
  { temperature: 500, humidity: 1, status: 'success', unit: 'fahrenheit', msg: 'Sensor is now a toaster' },
]

function randomFallback() {
  return FALLBACK[Math.floor(Math.random() * FALLBACK.length)]
}

export default function RoomMonitor() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showingFallback, setShowingFallback] = useState(false)
  const gotRealData = useRef(false)

  const getSensorData = useCallback(async (isRetry) => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)
    try {
      if (isRetry) setLoading(true)
      const response = await fetch(SENSOR_API, { signal: controller.signal })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const result = await response.json()
      gotRealData.current = true
      setData(result)
      setShowingFallback(false)
    } catch (err) {
      console.error('Sensor fetch failed:', err)
      if (!gotRealData.current) {
        const fb = randomFallback()
        setData(fb)
        setShowingFallback(true)
      }
    } finally {
      clearTimeout(timeout)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    getSensorData(false)
    const interval = setInterval(() => getSensorData(false), 60000)
    return () => clearInterval(interval)
  }, [getSensorData])

  return (
    <div className="rm-container">
      <div className="rm-header">
        <a href="/" className="rm-home">← Home</a>
        <h1>Room Monitor</h1>
      </div>

      {loading && !data && (
        <div className="rm-loading">
          <div className="rm-spinner" />
          <p>Connecting to sensor...</p>
        </div>
      )}

      {data && (
        <>
          <div className="rm-cards">
            <div className="rm-card rm-card-temp">
              <div className="rm-card-label">Temperature</div>
              <div className="rm-card-value">
                {Number(data.temperature).toFixed(1)}<span className="rm-card-unit">°{data.unit === 'celsius' ? 'C' : 'F'}</span>
              </div>
            </div>
            <div className="rm-card rm-card-humidity">
              <div className="rm-card-label">Humidity</div>
              <div className="rm-card-value">
                {Number(data.humidity).toFixed(1)}<span className="rm-card-unit">%</span>
              </div>
            </div>
          </div>

          {showingFallback && (
            <div className="rm-fallback-banner">
              ⚠ Offline — showing fake readings
            </div>
          )}

          {showingFallback && (
            <div className="rm-fallback">
              <p>{data.msg}</p>
              <button className="rm-retry" onClick={() => getSensorData(true)}>Try again</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
