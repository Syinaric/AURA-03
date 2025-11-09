import React from 'react'
import './Card.css'

const PlantCard = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <div className="card plant-card">
        <h2>🌿 Plant Health Status</h2>
        <div className="loading">Loading plant data...</div>
      </div>
    )
  }

  const getHealthClass = (status) => {
    switch (status) {
      case 'good': return 'health-good'
      case 'fair': return 'health-fair'
      case 'poor': return 'health-poor'
      default: return 'health-good'
    }
  }

  return (
    <div className="card plant-card">
      <h2>🌿 Plant Health Status</h2>
      <div className="plant-data">
        <div className="plant-item">
          <h3>NDVI (Vegetation Index)</h3>
          <div className="value">
            <span className={`health-indicator ${getHealthClass(data.ndvi?.status)}`}></span>
            {data.ndvi?.value} ({data.ndvi?.status})
          </div>
        </div>
        <div className="plant-item">
          <h3>Overall Health</h3>
          <div className="value">
            <span className={`health-indicator ${getHealthClass(data.health?.status)}`}></span>
            {data.health?.value}{data.health?.unit}
          </div>
        </div>
        <div className="plant-item">
          <h3>Growth Stage</h3>
          <div className="value">{data.growthStage}</div>
        </div>
        <div className="plant-item">
          <h3>Water Stress</h3>
          <div className="value">
            {(data.waterStress?.value * 100).toFixed(1)}% ({data.waterStress?.status})
          </div>
        </div>
        <div className="plant-item">
          <h3>Disease Risk</h3>
          <div className="value">
            {(data.diseaseRisk?.value * 100).toFixed(1)}% ({data.diseaseRisk?.status})
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlantCard

