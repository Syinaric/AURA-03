import React, { useState } from 'react'
import './Card.css'

const TaskListCard = ({ tasks, data }) => {
  const [autoRun, setAutoRun] = useState(false)

  // Generate task list with reasons from API data
  const generateTaskList = () => {
    const taskList = []

    // Always show harvesting as the first task
    taskList.push({
      title: 'Harvesting Plants',
      reason: 'Scheduled harvesting cycle for optimal yield',
      priority: 'high'
    })

    // Add tasks based on API data
    if (data && data.soil) {
      if (data.soil.moisture?.value < 30) {
        taskList.push({
          title: 'Irrigate Field',
          reason: `Soil moisture is low (${data.soil.moisture.value}%). Plants need immediate watering.`,
          priority: 'high'
        })
      }

      if (data.soil.nitrogen?.value < 20) {
        taskList.push({
          title: 'Apply Nitrogen Fertilizer',
          reason: `Nitrogen levels are below optimal (${data.soil.nitrogen.value}ppm). Apply fertilizer to promote growth.`,
          priority: 'high'
        })
      }
    }

    if (data && data.weather) {
      if (data.weather.temp?.value > 30) {
        taskList.push({
          title: 'Increase Irrigation',
          reason: `High temperature detected (${data.weather.temp.value}°C). Increase watering frequency to prevent stress.`,
          priority: 'high'
        })
      }
    }

    if (data && data.plants) {
      if (data.plants.ndvi?.value < 0.5) {
        taskList.push({
          title: 'Investigate Low Vegetation',
          reason: `NDVI indicates poor plant health (${data.plants.ndvi.value}). Inspect affected areas.`,
          priority: 'high'
        })
      }

      if (data.plants.diseaseRisk?.value > 0.3) {
        taskList.push({
          title: 'Apply Pesticide',
          reason: `High disease risk detected (${(data.plants.diseaseRisk.value * 100).toFixed(0)}%). Apply preventive treatment.`,
          priority: 'high'
        })
      }
    }

    // Advanced future tasks
    taskList.push({
      title: 'Precision Weeding',
      reason: 'AI vision detected 12 weeds in sector 3. Using precision targeting to remove without affecting crops.',
      priority: 'medium'
    })

    taskList.push({
      title: 'Soil Aeration',
      reason: 'Soil compaction detected in rows 5-8. Deploying aeration tools to improve root growth.',
      priority: 'low'
    })

    taskList.push({
      title: 'Seed Planting',
      reason: 'Optimal planting window detected. Preparing to plant 200 seeds in pre-mapped locations.',
      priority: 'medium'
    })

    taskList.push({
      title: 'Crop Monitoring Scan',
      reason: 'Scheduled full-field scan using multispectral imaging to detect early stress indicators.',
      priority: 'low'
    })

    taskList.push({
      title: 'Pruning Operations',
      reason: 'Growth analysis indicates 8 plants require selective pruning for optimal yield.',
      priority: 'medium'
    })

    taskList.push({
      title: 'Pest Detection & Removal',
      reason: 'Computer vision identified 3 pest clusters. Deploying targeted intervention.',
      priority: 'high'
    })

    taskList.push({
      title: 'Nutrient Injection',
      reason: 'Micro-dosing system ready. Applying targeted nutrients to 15 underperforming plants.',
      priority: 'medium'
    })

    return taskList
  }

  const taskList = generateTaskList()

  return (
    <div className="card task-list-card">
      <h2>Current List of Tasks</h2>
      
      {/* Auto Run Switch */}
      <div className="auto-run-switch">
        <label className="switch-label">
          <span>Auto run tasks</span>
          <div className="switch-container">
            <input
              type="checkbox"
              checked={autoRun}
              onChange={(e) => setAutoRun(e.target.checked)}
              className="switch-input"
            />
            <span className={`switch-slider ${autoRun ? 'active' : ''}`}></span>
          </div>
        </label>
      </div>

      {/* Task List */}
      <div className="task-list">
        {taskList.length === 0 ? (
          <div className="no-tasks">No tasks required. All systems optimal.</div>
        ) : (
          taskList.map((task, index) => (
            <div key={index} className={`task-list-item priority-${task.priority} ${index === 0 ? 'active-task' : ''}`}>
              <div className="task-list-number">{index + 1}</div>
              <div className="task-list-content">
                <div className="task-list-header">
                  <div className="task-list-title">{task.title}</div>
                  {index === 0 && (
                    <div className="active-status">
                      <span className="active-indicator"></span>
                      <span className="active-text">ACTIVE</span>
                    </div>
                  )}
                </div>
                <div className="task-list-reason">{task.reason}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TaskListCard

