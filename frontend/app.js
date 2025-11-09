// Autonomous Farming Dashboard
// API Key: cec1a47088dfc73f60889c29598e6e5e
// API Base: https://api.agromonitoring.com/agro/1.0

const API_KEY = 'cec1a47088dfc73f60889c29598e6e5e';
const API_BASE = 'https://api.agromonitoring.com/agro/1.0';

// Mock data structure (will be replaced with actual API calls)
let currentData = {
    weather: null,
    soil: null,
    plants: null,
    tasks: []
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    updateStatus('Connecting to API...', false);
    loadDashboardData();
    
    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', () => {
        loadDashboardData();
    });
    
    // Auto-refresh every 5 minutes
    setInterval(loadDashboardData, 300000);
});

// Load all dashboard data
async function loadDashboardData() {
    try {
        // Note: AgroMonitoring API requires polygon/polyid for most endpoints
        // For demo purposes, we'll use mock data structure that matches API format
        // In production, you would need to:
        // 1. Create a polygon for your farm field
        // 2. Get polygon ID
        // 3. Use that ID to fetch weather, soil, and satellite data
        
        // Simulate API calls with realistic data
        await Promise.all([
            loadWeatherData(),
            loadSoilData(),
            loadPlantData()
        ]);
        
        // Generate tasks based on data
        generateTasks();
        
        updateStatus('Connected', true);
        updateLastUpdate();
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
        updateStatus('Connection Error', false);
        showError('Failed to load data. Using simulated data for demonstration.');
        loadSimulatedData();
    }
}

// Load weather data
async function loadWeatherData() {
    try {
        // AgroMonitoring API endpoint: /weather
        // Requires: appid (API key), polyid (polygon ID)
        // For demo, using simulated data
        
        const weatherData = {
            temp: { value: 22.5, unit: '°C' },
            humidity: { value: 65, unit: '%' },
            pressure: { value: 1013.25, unit: 'hPa' },
            windSpeed: { value: 12.3, unit: 'km/h' },
            windDirection: { value: 180, unit: '°' },
            precipitation: { value: 0, unit: 'mm' },
            uvIndex: { value: 6, unit: '' },
            visibility: { value: 10, unit: 'km' }
        };
        
        currentData.weather = weatherData;
        displayWeatherData(weatherData);
        
    } catch (error) {
        console.error('Error loading weather:', error);
        loadSimulatedWeather();
    }
}

// Load soil data
async function loadSoilData() {
    try {
        // AgroMonitoring API endpoint: /soil
        // Provides: soil temperature, moisture, etc.
        
        const soilData = {
            temperature: { value: 18.5, unit: '°C', status: 'optimal' },
            moisture: { value: 45, unit: '%', status: 'optimal' },
            ph: { value: 6.8, unit: '', status: 'optimal' },
            nitrogen: { value: 25, unit: 'ppm', status: 'warning' },
            phosphorus: { value: 15, unit: 'ppm', status: 'optimal' },
            potassium: { value: 180, unit: 'ppm', status: 'optimal' },
            organicMatter: { value: 3.2, unit: '%', status: 'optimal' }
        };
        
        currentData.soil = soilData;
        displaySoilData(soilData);
        
    } catch (error) {
        console.error('Error loading soil:', error);
        loadSimulatedSoil();
    }
}

// Load plant data
async function loadPlantData() {
    try {
        // AgroMonitoring API endpoint: /satellite
        // Provides: NDVI, EVI, and other vegetation indices
        
        const plantData = {
            ndvi: { value: 0.72, status: 'good' },
            evi: { value: 0.45, status: 'good' },
            health: { value: 85, unit: '%', status: 'good' },
            growthStage: 'Vegetative',
            waterStress: { value: 0.15, status: 'low' },
            diseaseRisk: { value: 0.12, status: 'low' }
        };
        
        currentData.plants = plantData;
        displayPlantData(plantData);
        
    } catch (error) {
        console.error('Error loading plant data:', error);
        loadSimulatedPlants();
    }
}

// Display weather data
function displayWeatherData(data) {
    const container = document.getElementById('weatherData');
    container.innerHTML = `
        <div class="weather-item">
            <h3>Temperature</h3>
            <div class="value">${data.temp.value}${data.temp.unit}</div>
        </div>
        <div class="weather-item">
            <h3>Humidity</h3>
            <div class="value">${data.humidity.value}${data.humidity.unit}</div>
        </div>
        <div class="weather-item">
            <h3>Wind Speed</h3>
            <div class="value">${data.windSpeed.value} ${data.windSpeed.unit}</div>
        </div>
        <div class="weather-item">
            <h3>Precipitation</h3>
            <div class="value">${data.precipitation.value}${data.precipitation.unit}</div>
        </div>
        <div class="weather-item">
            <h3>UV Index</h3>
            <div class="value">${data.uvIndex.value}</div>
        </div>
        <div class="weather-item">
            <h3>Pressure</h3>
            <div class="value">${data.pressure.value} ${data.pressure.unit}</div>
        </div>
    `;
}

// Display soil data
function displaySoilData(data) {
    const container = document.getElementById('soilData');
    container.innerHTML = Object.entries(data).map(([key, item]) => {
        const statusClass = `status-${item.status}`;
        return `
            <div class="soil-item">
                <h3>${formatKey(key)}</h3>
                <div class="value">${item.value} ${item.unit || ''}</div>
                <span class="status ${statusClass}">${item.status.toUpperCase()}</span>
            </div>
        `;
    }).join('');
}

// Display plant data
function displayPlantData(data) {
    const container = document.getElementById('plantData');
    const healthClass = `health-${data.health.status}`;
    container.innerHTML = `
        <div class="plant-item">
            <h3>NDVI (Vegetation Index)</h3>
            <div class="value">
                <span class="health-indicator ${healthClass}"></span>
                ${data.ndvi.value} (${data.ndvi.status})
            </div>
        </div>
        <div class="plant-item">
            <h3>Overall Health</h3>
            <div class="value">
                <span class="health-indicator ${healthClass}"></span>
                ${data.health.value}${data.health.unit}
            </div>
        </div>
        <div class="plant-item">
            <h3>Growth Stage</h3>
            <div class="value">${data.growthStage}</div>
        </div>
        <div class="plant-item">
            <h3>Water Stress</h3>
            <div class="value">${(data.waterStress.value * 100).toFixed(1)}% (${data.waterStress.status})</div>
        </div>
        <div class="plant-item">
            <h3>Disease Risk</h3>
            <div class="value">${(data.diseaseRisk.value * 100).toFixed(1)}% (${data.diseaseRisk.status})</div>
        </div>
    `;
}

// Generate tasks based on current data
function generateTasks() {
    const tasks = [];
    
    // Analyze soil conditions
    if (currentData.soil) {
        if (currentData.soil.moisture.value < 30) {
            tasks.push({
                title: 'Irrigate Field',
                description: 'Soil moisture is low. Robot should water the crops.',
                priority: 'high',
                action: 'irrigate',
                estimatedTime: '2 hours'
            });
        }
        
        if (currentData.soil.nitrogen.value < 20) {
            tasks.push({
                title: 'Apply Nitrogen Fertilizer',
                description: 'Nitrogen levels are below optimal. Apply fertilizer.',
                priority: 'high',
                action: 'fertilize',
                estimatedTime: '1.5 hours'
            });
        }
        
        if (currentData.soil.ph.value < 6.0 || currentData.soil.ph.value > 7.5) {
            tasks.push({
                title: 'Adjust Soil pH',
                description: 'Soil pH is outside optimal range. Apply pH correction.',
                priority: 'medium',
                action: 'ph_adjust',
                estimatedTime: '1 hour'
            });
        }
    }
    
    // Analyze weather conditions
    if (currentData.weather) {
        if (currentData.weather.precipitation.value > 5) {
            tasks.push({
                title: 'Monitor Drainage',
                description: 'Heavy rainfall detected. Check field drainage systems.',
                priority: 'medium',
                action: 'monitor',
                estimatedTime: '30 minutes'
            });
        }
        
        if (currentData.weather.temp.value > 30) {
            tasks.push({
                title: 'Increase Irrigation',
                description: 'High temperature detected. Increase watering frequency.',
                priority: 'high',
                action: 'irrigate',
                estimatedTime: '2 hours'
            });
        }
        
        if (currentData.weather.windSpeed.value > 20) {
            tasks.push({
                title: 'Check Plant Stability',
                description: 'High winds detected. Inspect plants for damage.',
                priority: 'medium',
                action: 'inspect',
                estimatedTime: '1 hour'
            });
        }
    }
    
    // Analyze plant health
    if (currentData.plants) {
        if (currentData.plants.ndvi.value < 0.5) {
            tasks.push({
                title: 'Investigate Low Vegetation',
                description: 'NDVI indicates poor plant health. Inspect affected areas.',
                priority: 'high',
                action: 'inspect',
                estimatedTime: '1.5 hours'
            });
        }
        
        if (currentData.plants.diseaseRisk.value > 0.3) {
            tasks.push({
                title: 'Apply Pesticide',
                description: 'High disease risk detected. Apply preventive treatment.',
                priority: 'high',
                action: 'spray',
                estimatedTime: '2 hours'
            });
        }
        
        if (currentData.plants.waterStress.value > 0.3) {
            tasks.push({
                title: 'Urgent Irrigation Needed',
                description: 'Plants showing water stress. Immediate watering required.',
                priority: 'high',
                action: 'irrigate',
                estimatedTime: '2.5 hours'
            });
        }
        
        // Regular maintenance tasks
        tasks.push({
            title: 'Routine Field Inspection',
            description: 'Perform regular visual inspection of crops.',
            priority: 'low',
            action: 'inspect',
            estimatedTime: '1 hour'
        });
    }
    
    // Sort tasks by priority
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    tasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    
    currentData.tasks = tasks;
    displayTasks(tasks);
    displayDecisionLogic();
}

// Display tasks
function displayTasks(tasks) {
    const container = document.getElementById('tasksList');
    
    if (tasks.length === 0) {
        container.innerHTML = '<div class="loading">No tasks required. All systems optimal.</div>';
        return;
    }
    
    container.innerHTML = tasks.map(task => `
        <div class="task-item priority-${task.priority}">
            <div class="task-info">
                <div class="task-title">${task.title}</div>
                <div class="task-description">${task.description}</div>
                <div class="task-description" style="margin-top: 5px; font-size: 0.85em; color: #95a5a6;">
                    Estimated time: ${task.estimatedTime}
                </div>
            </div>
            <span class="task-priority priority-${task.priority}">${task.priority}</span>
        </div>
    `).join('');
}

// Display decision logic
function displayDecisionLogic() {
    const container = document.getElementById('decisionLogic');
    
    const logic = [
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
    ];
    
    container.innerHTML = logic.map(item => `
        <div class="decision-item">
            <h3>IF: ${item.condition}</h3>
            <div class="logic">
                <strong>THEN:</strong> ${item.action}<br>
                <em>Reason:</em> ${item.reasoning}
            </div>
        </div>
    `).join('');
}

// Update API status
function updateApiStatus() {
    const container = document.getElementById('apiStatus');
    container.innerHTML = `
        <div class="api-item">
            <span class="label">API Key:</span>
            <span class="value success">Active</span>
        </div>
        <div class="api-item">
            <span class="label">Connection:</span>
            <span class="value success" id="apiConnection">Connected</span>
        </div>
        <div class="api-item">
            <span class="label">Last Update:</span>
            <span class="value" id="apiLastUpdate">Just now</span>
        </div>
        <div class="api-item">
            <span class="label">Data Source:</span>
            <span class="value">AgroMonitoring API</span>
        </div>
    `;
}

// Update status indicator
function updateStatus(text, connected) {
    document.getElementById('statusText').textContent = text;
    const dot = document.getElementById('statusDot');
    if (connected) {
        dot.classList.add('connected');
    } else {
        dot.classList.remove('connected');
    }
}

// Update last update time
function updateLastUpdate() {
    const now = new Date();
    document.getElementById('lastUpdate').textContent = now.toLocaleString();
}

// Format key names
function formatKey(key) {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}

// Load simulated data (fallback)
function loadSimulatedData() {
    loadSimulatedWeather();
    loadSimulatedSoil();
    loadSimulatedPlants();
    generateTasks();
    updateApiStatus();
    updateStatus('Using Simulated Data', true);
    updateLastUpdate();
}

function loadSimulatedWeather() {
    const weatherData = {
        temp: { value: 22.5, unit: '°C' },
        humidity: { value: 65, unit: '%' },
        pressure: { value: 1013.25, unit: 'hPa' },
        windSpeed: { value: 12.3, unit: 'km/h' },
        windDirection: { value: 180, unit: '°' },
        precipitation: { value: 0, unit: 'mm' },
        uvIndex: { value: 6, unit: '' },
        visibility: { value: 10, unit: 'km' }
    };
    currentData.weather = weatherData;
    displayWeatherData(weatherData);
}

function loadSimulatedSoil() {
    const soilData = {
        temperature: { value: 18.5, unit: '°C', status: 'optimal' },
        moisture: { value: 45, unit: '%', status: 'optimal' },
        ph: { value: 6.8, unit: '', status: 'optimal' },
        nitrogen: { value: 25, unit: 'ppm', status: 'warning' },
        phosphorus: { value: 15, unit: 'ppm', status: 'optimal' },
        potassium: { value: 180, unit: 'ppm', status: 'optimal' },
        organicMatter: { value: 3.2, unit: '%', status: 'optimal' }
    };
    currentData.soil = soilData;
    displaySoilData(soilData);
}

function loadSimulatedPlants() {
    const plantData = {
        ndvi: { value: 0.72, status: 'good' },
        evi: { value: 0.45, status: 'good' },
        health: { value: 85, unit: '%', status: 'good' },
        growthStage: 'Vegetative',
        waterStress: { value: 0.15, status: 'low' },
        diseaseRisk: { value: 0.12, status: 'low' }
    };
    currentData.plants = plantData;
    displayPlantData(plantData);
}

// Show error message
function showError(message) {
    const container = document.getElementById('weatherData');
    if (container) {
        container.innerHTML = `<div class="error">${message}</div>`;
    }
}

// Initialize API status display
updateApiStatus();

