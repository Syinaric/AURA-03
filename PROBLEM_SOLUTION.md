# Problem and Solution

## The Problem

We built an autonomous robot arm that can detect and pick up bottles using computer vision. The main challenges were:

1. **Making the arm move smoothly** - The robot needed to reach down low enough to grab bottles without jerky movements
2. **Connecting vision to movement** - Getting the camera detection to control the real robot arm
3. **Keeping everything responsive** - The camera feed would freeze when the arm moved
4. **Calibrating the servos** - Some motors moved in the wrong direction and needed adjustment

## Our Solution

### 1. Hardcoded Pickup Sequence
Instead of complex calculations, we created a reliable sequence of arm positions that work consistently. We added intermediate steps between major movements to make the motion smooth and controlled.

### 2. Background Threading
We moved the arm sequence to run in the background so the camera feed stays smooth and responsive. Users can still see the detection while the arm moves.

### 3. ESP32 Integration
We connected the Python vision system to the ESP32 microcontroller via serial communication. The Python code sends commands, and the ESP32 controls the servos in real-time.

### 4. Servo Calibration
We tested and adjusted each servo motor to ensure they move in the correct direction. The shoulder motor was reversed, so we fixed its direction.

### 5. Bottle Detection
We implemented YOLO object detection to identify bottles in real-time. The system shows a green box around detected bottles and tracks their position.

## How It Works

1. **Camera detects bottle** - YOLO vision system identifies bottles in the camera feed
2. **User presses 'g'** - Triggers the pickup sequence
3. **Arm executes sequence** - Moves through 15 smooth steps:
   - Approaches above the bottle
   - Lowers to grab position
   - Lifts up (grabs bottle)
   - Moves left
   - Lowers to drop position
   - Releases bottle
   - Returns to home position
4. **Camera stays smooth** - All movement happens in background, camera feed never freezes

## Results

✅ Smooth camera feed with no lag  
✅ Reliable bottle pickup sequence  
✅ Real-time servo control via ESP32  
✅ Smooth, controlled arm movements  
✅ Proper return to home position  

## Technical Stack

- **Vision**: OpenCV + YOLO for bottle detection
- **Control**: Python for vision, Arduino C++ for ESP32
- **Hardware**: ESP32 microcontroller, 4 servo motors (Base, Shoulder, Elbow, Wrist)
- **Communication**: Serial connection between Python and ESP32

## Key Innovation

The combination of computer vision with real-time robot control, using background threading to keep the system responsive, allows for smooth autonomous bottle pickup while maintaining a live camera feed.
