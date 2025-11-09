import React from 'react'
import './Card.css'

const DecisionCard = ({ data }) => {
  const decisionLogic = [
    {
      condition: 'Soil Moisture < 30%',
      action: 'Trigger irrigation system',
      reasoning: 'Low soil moisture indicates plants need water immediately'
    },
    {
      condition: 'Temperature > 30°C',
      action: 'Increase irrigation frequency',
      reasoning: 'High temperatures increase water evaporation and plant stress'
    },
    {
      condition: 'NDVI < 0.5',
      action: 'Investigate and apply treatment',
      reasoning: 'Low vegetation index indicates poor plant health or growth issues'
    },
    {
      condition: 'Disease Risk > 30%',
      action: 'Apply preventive pesticide',
      reasoning: 'High disease risk requires immediate preventive action'
    },
    {
      condition: 'Nitrogen < 20ppm',
      action: 'Apply nitrogen fertilizer',
      reasoning: 'Insufficient nitrogen limits plant growth and yield'
    }
  ]

  return (
    <div className="card decision-card">
      <h2>🧠 Decision Making Logic</h2>
      <div className="decision-logic">
        {decisionLogic.map((item, index) => (
          <div key={index} className="decision-item">
            <h3>IF: {item.condition}</h3>
            <div className="logic">
              <strong>THEN:</strong> {item.action}<br />
              <em>Reason:</em> {item.reasoning}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DecisionCard

