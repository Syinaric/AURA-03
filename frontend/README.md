# Autonomous Farming Dashboard

A React-based web dashboard for monitoring agricultural data and generating tasks for an autonomous farming robot.

## Features

- **Weather Monitoring**: Real-time weather data (temperature, humidity, wind, precipitation, UV index)
- **Soil Analysis**: Soil temperature, moisture, pH, and nutrient levels (nitrogen, phosphorus, potassium)
- **Plant Health**: NDVI, EVI, growth stage, water stress, and disease risk monitoring
- **Task Generation**: Automatic task recommendations based on current conditions
- **Decision Logic**: Transparent decision-making process for robot actions
- **Dark Theme**: Strong black background with white text and animated Dither background

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)

### Installation

```bash
cd frontend
npm install
```

### Development Server

```bash
npm run dev
```

The dashboard will open automatically at: http://localhost:8000

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## API Configuration

The dashboard uses the AgroMonitoring API:
- **API Key**: `cec1a47088dfc73f60889c29598e6e5e`
- **Base URL**: `https://api.agromonitoring.com/agro/1.0`

### Note on API Integration

The current implementation uses simulated data that matches the AgroMonitoring API structure. To integrate with the actual API:

1. **Create a Polygon**: Define your farm field boundaries
2. **Get Polygon ID**: Use the polygon ID for API calls
3. **Update API Calls**: Modify `src/utils/api.js` to use actual API endpoints:
   - `/weather?appid={API_KEY}&polyid={POLYGON_ID}`
   - `/soil?appid={API_KEY}&polyid={POLYGON_ID}`
   - `/satellite?appid={API_KEY}&polyid={POLYGON_ID}`

## Task Generation Logic

The dashboard automatically generates tasks based on:

- **Soil Moisture < 30%** → Irrigate Field (High Priority)
- **Temperature > 30°C** → Increase Irrigation (High Priority)
- **NDVI < 0.5** → Investigate Low Vegetation (High Priority)
- **Disease Risk > 30%** → Apply Pesticide (High Priority)
- **Nitrogen < 20ppm** → Apply Fertilizer (High Priority)
- **pH Outside 6.0-7.5** → Adjust Soil pH (Medium Priority)
- **Heavy Rainfall** → Monitor Drainage (Medium Priority)
- **High Winds** → Check Plant Stability (Medium Priority)

## Robot Actions

The dashboard suggests these robot actions:

- **irrigate**: Water the crops
- **fertilize**: Apply fertilizer
- **spray**: Apply pesticides
- **ph_adjust**: Adjust soil pH
- **inspect**: Visual inspection of crops
- **monitor**: Monitor field conditions

## File Structure

```
frontend/
├── src/
│   ├── components/      # React components
│   │   ├── Dither.jsx   # Animated background component
│   │   ├── WeatherCard.jsx
│   │   ├── SoilCard.jsx
│   │   ├── PlantCard.jsx
│   │   ├── TasksCard.jsx
│   │   ├── DecisionCard.jsx
│   │   ├── ApiStatusCard.jsx
│   │   └── Card.css     # Shared card styles
│   ├── styles/
│   │   ├── index.css    # Global styles
│   │   └── App.css      # App-specific styles
│   ├── utils/
│   │   └── api.js       # API utilities
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── README.md            # This file
```

## Dither Component

The dashboard uses a Dither component for the animated background. The component accepts these props:

- `waveColor`: Array of RGB values [r, g, b] (default: [0.5, 0.5, 0.5])
- `disableAnimation`: Boolean to disable animation (default: false)
- `enableMouseInteraction`: Boolean to enable mouse interaction (default: true)
- `mouseRadius`: Mouse interaction radius (default: 0.3)
- `colorNum`: Number of colors for dithering (default: 4)
- `waveAmplitude`: Wave amplitude (default: 0.3)
- `waveFrequency`: Wave frequency (default: 3)
- `waveSpeed`: Wave animation speed (default: 0.05)

**Note**: The Dither component is currently a placeholder. Please provide the actual Dither component code to replace `src/components/Dither.jsx`.

## Future Integration

This frontend is designed to be separate from the robot arm backend. When ready to integrate:

1. Create an API endpoint that receives task recommendations
2. Send tasks from this dashboard to the robot control system
3. Receive status updates from the robot
4. Display robot status and task completion

## Notes

- Currently uses simulated data for demonstration
- Auto-refreshes every 5 minutes
- Fully responsive design
- Dark theme with strong blacks and white text
- No backend connection required (standalone)
