import React from 'react'
import './Card.css'

const TasksCard = ({ tasks, loading }) => {
  if (loading) {
    return (
      <div className="card tasks-card">
        <h2>🤖 Recommended Robot Tasks</h2>
        <div className="loading">Analyzing conditions...</div>
      </div>
    )
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="card tasks-card">
        <h2>🤖 Recommended Robot Tasks</h2>
        <div className="loading">No tasks required. All systems optimal.</div>
      </div>
    )
  }

  return (
    <div className="card tasks-card">
      <h2>🤖 Recommended Robot Tasks</h2>
      <div className="tasks-list">
        {tasks.map((task, index) => (
          <div key={index} className={`task-item priority-${task.priority}`}>
            <div className="task-info">
              <div className="task-title">{task.title}</div>
              <div className="task-description">{task.description}</div>
              <div className="task-description" style={{ marginTop: '5px', fontSize: '0.85em', color: 'rgba(255, 255, 255, 0.6)' }}>
                Estimated time: {task.estimatedTime}
              </div>
            </div>
            <span className={`task-priority priority-${task.priority}`}>
              {task.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TasksCard

