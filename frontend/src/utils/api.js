// API utilities for AgroMonitoring
const API_KEY = 'cec1a47088dfc73f60889c29598e6e5e'
const API_BASE = 'https://api.agromonitoring.com/agro/1.0'

// Load dashboard data
export async function loadDashboardData() {
  try {
    // Note: AgroMonitoring API requires polygon ID
    // For now, using simulated data that matches API structure
    // In production, you would need to:
    // 1. Create a polygon for your farm field
    // 2. Get polygon ID
    // 3. Use that ID to fetch weather, soil, and satellite data
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Return simulated data (matches API structure)
    return {
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
  } catch (error) {
    console.error('Error loading dashboard data:', error)
    throw error
  }
}

// Generate tasks based on data
export function generateTasks(data) {
  const tasks = []
  
  if (!data) return tasks
  
  // Analyze soil conditions
  if (data.soil) {
    if (data.soil.moisture.value < 30) {
      tasks.push({
        title: 'Irrigate Field',
        description: 'Soil moisture is low. Robot should water the crops.',
        priority: 'high',
        action: 'irrigate',
        estimatedTime: '2 hours'
      })
    }
    
    if (data.soil.nitrogen.value < 20) {
      tasks.push({
        title: 'Apply Nitrogen Fertilizer',
        description: 'Nitrogen levels are below optimal. Apply fertilizer.',
        priority: 'high',
        action: 'fertilize',
        estimatedTime: '1.5 hours'
      })
    }
    
    if (data.soil.ph.value < 6.0 || data.soil.ph.value > 7.5) {
      tasks.push({
        title: 'Adjust Soil pH',
        description: 'Soil pH is outside optimal range. Apply pH correction.',
        priority: 'medium',
        action: 'ph_adjust',
        estimatedTime: '1 hour'
      })
    }
  }
  
  // Analyze weather conditions
  if (data.weather) {
    if (data.weather.precipitation.value > 5) {
      tasks.push({
        title: 'Monitor Drainage',
        description: 'Heavy rainfall detected. Check field drainage systems.',
        priority: 'medium',
        action: 'monitor',
        estimatedTime: '30 minutes'
      })
    }
    
    if (data.weather.temp.value > 30) {
      tasks.push({
        title: 'Increase Irrigation',
        description: 'High temperature detected. Increase watering frequency.',
        priority: 'high',
        action: 'irrigate',
        estimatedTime: '2 hours'
      })
    }
    
    if (data.weather.windSpeed.value > 20) {
      tasks.push({
        title: 'Check Plant Stability',
        description: 'High winds detected. Inspect plants for damage.',
        priority: 'medium',
        action: 'inspect',
        estimatedTime: '1 hour'
      })
    }
  }
  
  // Analyze plant health
  if (data.plants) {
    if (data.plants.ndvi.value < 0.5) {
      tasks.push({
        title: 'Investigate Low Vegetation',
        description: 'NDVI indicates poor plant health. Inspect affected areas.',
        priority: 'high',
        action: 'inspect',
        estimatedTime: '1.5 hours'
      })
    }
    
    if (data.plants.diseaseRisk.value > 0.3) {
      tasks.push({
        title: 'Apply Pesticide',
        description: 'High disease risk detected. Apply preventive treatment.',
        priority: 'high',
        action: 'spray',
        estimatedTime: '2 hours'
      })
    }
    
    if (data.plants.waterStress.value > 0.3) {
      tasks.push({
        title: 'Urgent Irrigation Needed',
        description: 'Plants showing water stress. Immediate watering required.',
        priority: 'high',
        action: 'irrigate',
        estimatedTime: '2.5 hours'
      })
    }
    
    // Regular maintenance tasks
    tasks.push({
      title: 'Routine Field Inspection',
      description: 'Perform regular visual inspection of crops.',
      priority: 'low',
      action: 'inspect',
      estimatedTime: '1 hour'
    })
  }
  
  // Sort tasks by priority
  const priorityOrder = { high: 3, medium: 2, low: 1 }
  tasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
  
  return tasks
}

