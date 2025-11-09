import React from 'react'
import './Card.css'

const ApiStatusCard = ({ status, lastUpdate }) => {
  return (
    <div className="card api-card">
      <h2>📡 API Status</h2>
      <div className="api-status">
        <div className="api-item">
          <span className="label">API Key:</span>
          <span className="value success">Active</span>
        </div>
        <div className="api-item">
          <span className="label">Connection:</span>
          <span className={`value ${status.connected ? 'success' : 'error'}`}>
            {status.connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <div className="api-item">
          <span className="label">Last Update:</span>
          <span className="value">
            {lastUpdate ? lastUpdate.toLocaleString() : 'Never'}
          </span>
        </div>
        <div className="api-item">
          <span className="label">Data Source:</span>
          <span className="value">AgroMonitoring API</span>
        </div>
      </div>
    </div>
  )
}

export default ApiStatusCard

