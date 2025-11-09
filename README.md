# A.U.R.A. FARM - Autonomous Utility Robotic Arm for farming 

Autonomous farming robot system with computer vision, natural language processing, and inverse kinematics.

## System Architecture

### Vision Pipeline

The system uses OpenCV for color-based detection and YOLOv8 for object-specific recognition. The camera feed is processed to detect objects by color (red, black, blue, etc.) or by label (apple, bottle, etc.). Detected objects are tracked with bounding boxes and centroids, which are converted from pixel coordinates to real-world table coordinates using a calibrated mapping.

### Natural Language Processing

Commands are parsed using regex patterns and Pydantic models. The NLU system extracts:
- **Task**: pick_place, nudge, open, close
- **Target**: color, label, or nearest object
- **Direction**: left/right, forward/back
- **Distance**: "a little" (0.03m) or explicit measurements

Commands can be entered via keyboard or speech recognition (using SpeechRecognition library).

### Coordinate System

The system uses a bird's-eye view camera setup. Pixel coordinates from the camera are mapped to table coordinates (meters) using calibration parameters stored in `calibration.json`. The calibration defines:
- Origin point (table center)
- Scale factors (meters per pixel)
- Arm base position
- Coordinate flip settings

### Inverse Kinematics

For a 6-DOF robot arm, the system calculates joint angles from target positions:
- **Base**: Rotation toward target
- **Shoulder**: Upper arm pitch
- **Elbow**: Lower arm pitch
- **Wrist**: Continuous rotation servo
- **Gripper Yaw/Pitch**: 180° servos

Joint angles are converted to servo microsecond commands (900-2100 range) for MG996R servos.

### Decision Making System

The system integrates with the AgroMonitoring API to fetch real-time farm data:
- **Weather conditions**: Temperature, humidity, wind, precipitation
- **Soil metrics**: Moisture, pH, nitrogen, phosphorus, potassium
- **Plant health**: NDVI, growth stage, water stress, disease risk

Decision logic analyzes this data and automatically generates robot tasks:
- Low soil moisture (<30%) → Irrigate field
- High temperature (>30°C) → Increase irrigation frequency
- Low NDVI (<0.5) → Investigate and treat affected areas
- High disease risk (>30%) → Apply preventive pesticide
- Low nitrogen (<20ppm) → Apply fertilizer

These tasks are sent to the robot arm system, which executes them using the vision and kinematics pipeline.

### Hardware Integration

The system generates servo commands that can be sent to an ESP32 microcontroller. The ESP32 controls:
- 3x MG996R servos (Base, Shoulder, Elbow)
- 1x 9g continuous rotation servo (Wrist)
- 2x 180° servos (Gripper Yaw, Pitch)

Servo test code is provided for both MicroPython and Arduino IDE.

## Data Flow

1. **Camera** → Object detection → Pixel coordinates
2. **Calibration** → Pixel to table coordinate conversion
3. **NLU** → Command parsing → Target selection
4. **Kinematics** → Table coordinates → Joint angles → Servo commands
5. **Frontend** → API data → Task recommendations → Robot actions

## File Structure

- `main_sim.py`: Main loop integrating vision, NLU, and kinematics
- `detect.py`: OpenCV/YOLO object detection
- `nlu.py`: Natural language command parsing
- `kinematics.py`: Coordinate conversion and inverse kinematics
- `calibrate.py`: Interactive camera calibration tool
- `frontend/`: React dashboard with Three.js background
- `esp32_servo_test.*`: Hardware test code
