# ESP32 Servo Test Setup Guide

## Hardware Connections

### Servo Motors (MG996R)
- **Servo 1 (Base)**: GPIO 2 (D2)
- **Servo 2 (Shoulder)**: GPIO 5 (D5)
- **Servo 3 (Elbow)**: GPIO 18 (D18)

### Power Supply
- **External 5V power supply** (required for MG996R servos)
- **Common ground** between ESP32 and power supply
- **DO NOT power servos from ESP32 5V pin** (insufficient current)

### Wiring Diagram
```
ESP32 Dev Board          External Power Supply
    GND  ────────────────  GND (common ground)
    D2   ────────────────  Servo 1 Signal (yellow/orange wire)
    D5   ────────────────  Servo 2 Signal (yellow/orange wire)
    D18  ────────────────  Servo 3 Signal (yellow/orange wire)
    
External Power Supply
    +5V  ────────────────  Servo 1 Red wire
    +5V  ────────────────  Servo 2 Red wire
    +5V  ────────────────  Servo 3 Red wire
    GND  ────────────────  Servo 1 Black/Brown wire
    GND  ────────────────  Servo 2 Black/Brown wire
    GND  ────────────────  Servo 3 Black/Brown wire
```

## Software Setup

### Option 1: MicroPython

1. **Install MicroPython on ESP32:**
   ```bash
   # Download esptool
   pip install esptool
   
   # Download MicroPython firmware from:
   # https://micropython.org/download/esp32/
   
   # Flash firmware (replace COM_PORT with your port)
   esptool.py --chip esp32 --port /dev/ttyUSB0 erase_flash
   esptool.py --chip esp32 --port /dev/ttyUSB0 write_flash -z 0x1000 esp32-xxx.bin
   ```

2. **Upload test code:**
   - Use Thonny IDE or `ampy`:
   ```bash
   pip install adafruit-ampy
   ampy --port /dev/ttyUSB0 put esp32_servo_test.py
   ```

3. **Run the test:**
   - In Thonny: Open `esp32_servo_test.py` and click Run
   - Or via REPL: `exec(open('esp32_servo_test.py').read())`

### Option 2: Arduino IDE

1. **Install ESP32 Board Support:**
   - File > Preferences > Additional Board Manager URLs:
     ```
     https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
     ```
   - Tools > Board > Boards Manager > Search "ESP32" > Install

2. **Install ESP32Servo Library:**
   - Tools > Manage Libraries > Search "ESP32Servo" > Install

3. **Select Board:**
   - Tools > Board > ESP32 Arduino > ESP32 Dev Module
   - Tools > Port > Select your COM port

4. **Upload Code:**
   - Open `esp32_servo_test.ino`
   - Click Upload
   - Open Serial Monitor (115200 baud) to see output

## Test Sequence

The test code will automatically:

1. **Individual Servo Tests:**
   - Each servo moves: 0° → 90° → 180° → 90°

2. **All Servos Together:**
   - All servos move simultaneously to 0°, 90°, 180°, then back to 90°

3. **Smooth Sweep Test:**
   - Each servo smoothly sweeps from 0° to 180°

## MG996R Servo Specifications

- **Voltage**: 4.8V - 7.2V (5V recommended)
- **Current**: ~1A per servo (idle), ~2.5A (stalled)
- **Angle Range**: 180 degrees
- **PWM Frequency**: 50Hz (20ms period)
- **Pulse Width**: 
  - 0.5ms = 0°
  - 1.5ms = 90° (center)
  - 2.5ms = 180°

## Troubleshooting

### Servos Don't Move
- Check power supply (must be 5V, sufficient current)
- Verify common ground connection
- Check signal wire connections
- Ensure code is uploaded correctly

### Servos Jitter or Vibrate
- Power supply may be insufficient (use external supply)
- Check for loose connections
- Add capacitors (1000µF) across power supply

### Servos Move to Wrong Angles
- Calibrate pulse widths (adjust MIN_PULSE and MAX_PULSE)
- Some servos may need different pulse ranges

### ESP32 Resets
- Power supply issue (servos drawing too much current)
- Use external power supply, not ESP32 5V pin
- Add decoupling capacitors

## Manual Control

### MicroPython:
```python
from esp32_servo_test import set_servo_angle, servo_base, servo_shoulder, servo_elbow

# Set individual angles
set_servo_angle(servo_base, 45)      # Base to 45°
set_servo_angle(servo_shoulder, 90)  # Shoulder to 90°
set_servo_angle(servo_elbow, 135)    # Elbow to 135°
```

### Arduino:
```cpp
// In loop() or setup()
servo_base.write(45);
servo_shoulder.write(90);
servo_elbow.write(135);
```

## Next Steps

After testing, integrate with the main robot arm system:
- Update `kinematics.py` with your servo configuration
- Connect ESP32 to computer via serial/USB
- Send servo commands from Python code

