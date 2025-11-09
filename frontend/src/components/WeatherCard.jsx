import React from 'react'
import './Card.css'

const WeatherCard = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <div className="card weather-card">
        <h2>🌤️ Weather Conditions</h2>
        <div className="loading">Loading weather data...</div>
      </div>
    )
  }

  return (
    <div className="card weather-card">
      <h2>🌤️ Weather Conditions</h2>
      <div className="weather-grid">
        <div className="weather-item">
          <h3>Temperature</h3>
          <div className="value">{data.temp.value}{data.temp.unit}</div>
        </div>
        <div className="weather-item">
          <h3>Humidity</h3>
          <div className="value">{data.humidity.value}{data.humidity.unit}</div>
        </div>
        <div className="weather-item">
          <h3>Wind Speed</h3>
          <div className="value">{data.windSpeed.value} {data.windSpeed.unit}</div>
        </div>
        <div className="weather-item">
          <h3>Precipitation</h3>
          <div className="value">{data.precipitation.value}{data.precipitation.unit}</div>
        </div>
        <div className="weather-item">
          <h3>UV Index</h3>
          <div className="value">{data.uvIndex.value}</div>
        </div>
        <div className="weather-item">
          <h3>Pressure</h3>
          <div className="value">{data.pressure.value} {data.pressure.unit}</div>
        </div>
      </div>
    </div>
  )
}

export default WeatherCard

