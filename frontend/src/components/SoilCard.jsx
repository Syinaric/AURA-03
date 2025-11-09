import React from 'react'
import './Card.css'

const SoilCard = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <div className="card soil-card">
        <h2>🌍 Soil Analysis</h2>
        <div className="loading">Loading soil data...</div>
      </div>
    )
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'optimal': return 'status-optimal'
      case 'warning': return 'status-warning'
      case 'critical': return 'status-critical'
      default: return ''
    }
  }

  const formatKey = (key) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
  }

  return (
    <div className="card soil-card">
      <h2>🌍 Soil Analysis</h2>
      <div className="soil-data">
        {Object.entries(data).map(([key, item]) => (
          <div key={key} className="soil-item">
            <h3>{formatKey(key)}</h3>
            <div className="value">{item.value} {item.unit || ''}</div>
            <span className={`status ${getStatusClass(item.status)}`}>
              {item.status?.toUpperCase() || ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SoilCard

