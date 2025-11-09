import React, { useState, useEffect } from 'react'
import Dither from './components/Dither'
import TaskListCard from './components/TaskListCard'
import WeatherCard from './components/WeatherCard'
import SoilCard from './components/SoilCard'
import PlantCard from './components/PlantCard'
import TasksCard from './components/TasksCard'
import DecisionCard from './components/DecisionCard'
import ApiStatusCard from './components/ApiStatusCard'
import { loadDashboardData, generateTasks } from './utils/api'
import './styles/App.css'

function App() {
  const [data, setData] = useState({
    weather: null,
    soil: null,
    plants: null,
    tasks: []
  })
  const [status, setStatus] = useState({ connected: false, message: 'Connecting...' })
  const [lastUpdate, setLastUpdate] = useState(null)
  const [loading, setLoading] = useState(true)
  
  console.log('App rendering, loading:', loading, 'data:', data)

  useEffect(() => {
    // Load simulated data immediately so app shows content
    loadSimulatedData()
    // Then try to load real data
    loadData()
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadData, 300000)
    return () => clearInterval(interval)
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const dashboardData = await loadDashboardData()
      const tasks = generateTasks(dashboardData)
      setData({ ...dashboardData, tasks })
      setStatus({ connected: true, message: 'Connected' })
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Error loading data:', error)
      setStatus({ connected: false, message: 'Connection Error' })
      // Load simulated data as fallback
      loadSimulatedData()
    } finally {
      setLoading(false)
    }
  }

  const loadSimulatedData = () => {
    const simulatedData = {
      weather: {
        temp: { value: 22.5, unit: '°C' },
        humidity: { value: 65, unit: '%' },
        pressure: { value: 1013.25, unit: 'hPa' },
        windSpeed: { value: 12.3, unit: 'km/h' },
        windDirection: { value: 180, unit: '°' },
        precipitation: { value: 0, unit: 'mm' },
        uvIndex: { value: 6, unit: '' },
        visibility: { value: 10, unit: 'km' }
      },
      soil: {
        temperature: { value: 18.5, unit: '°C', status: 'optimal' },
        moisture: { value: 45, unit: '%', status: 'optimal' },
        ph: { value: 6.8, unit: '', status: 'optimal' },
        nitrogen: { value: 25, unit: 'ppm', status: 'warning' },
        phosphorus: { value: 15, unit: 'ppm', status: 'optimal' },
        potassium: { value: 180, unit: 'ppm', status: 'optimal' },
        organicMatter: { value: 3.2, unit: '%', status: 'optimal' }
      },
      plants: {
        ndvi: { value: 0.72, status: 'good' },
        evi: { value: 0.45, status: 'good' },
        health: { value: 85, unit: '%', status: 'good' },
        growthStage: 'Vegetative',
        waterStress: { value: 0.15, status: 'low' },
        diseaseRisk: { value: 0.12, status: 'low' }
      }
    }
    const tasks = generateTasks(simulatedData)
    setData({ ...simulatedData, tasks })
    setStatus({ connected: true, message: 'Using Simulated Data' })
    setLastUpdate(new Date())
  }

  return (
    <div className="app">
      {/* Dither Background */}
      <div className="dither-background" style={{ background: '#000000' }}>
        <Dither
          waveColor={[0, 0.3, 0.5]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.3}
          colorNum={4}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.05}
        />
      </div>

      {/* Content */}
      <div className="app-content">
        {/* Current Task Tab */}
        <div className="current-task-tab">
          <div className="task-label">Current Task:</div>
          <div className="task-name">Harvesting Crops</div>
        </div>

        <header className="app-header">
          <h1>A.U.R.A. FARM</h1>
          <div className="status-indicator">
            <span className={`status-dot ${status.connected ? 'connected' : ''}`}></span>
            <span className="status-text">{status.message}</span>
          </div>
        </header>

        <div className="dashboard-layout">
          <div className="dashboard-left">
            <TaskListCard tasks={data.tasks} data={data} />
          </div>
          <div className="dashboard-right">
            <div className="dashboard-grid">
              <WeatherCard data={data.weather} loading={loading} />
              <SoilCard data={data.soil} loading={loading} />
              <PlantCard data={data.plants} loading={loading} />
              <TasksCard tasks={data.tasks} loading={loading} />
              <DecisionCard data={data} />
              <ApiStatusCard status={status} lastUpdate={lastUpdate} />
            </div>
          </div>
        </div>

        <footer className="app-footer">
          <button className="refresh-btn" onClick={loadData} disabled={loading}>
            {loading ? '⏳ Loading...' : '🔄 Refresh Data'}
          </button>
          <p className="last-update">
            Last updated: {lastUpdate ? lastUpdate.toLocaleString() : 'Never'}
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App

