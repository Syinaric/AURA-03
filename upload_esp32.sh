#!/bin/bash
# ESP32 Upload Script for macOS/Linux
# Usage: ./upload_esp32.sh [PORT]

# Default port (change to match your ESP32)
DEFAULT_PORT="/dev/cu.usbserial-0001"

# Get port from argument or use default
PORT=${1:-$DEFAULT_PORT}

echo "=========================================="
echo "ESP32 Servo Test Upload Script"
echo "=========================================="
echo ""

# Check if ampy is installed
if ! command -v ampy &> /dev/null; then
    echo "Error: ampy not found. Installing..."
    pip install adafruit-ampy
fi

# Check if port exists
if [ ! -e "$PORT" ]; then
    echo "Error: Port $PORT not found!"
    echo ""
    echo "Available ports:"
    ls /dev/cu.* 2>/dev/null | grep -i usb
    ls /dev/tty.* 2>/dev/null | grep -i usb
    echo ""
    echo "Usage: ./upload_esp32.sh /dev/cu.usbserial-XXXX"
    exit 1
fi

echo "Uploading esp32_servo_test.py to ESP32..."
echo "Port: $PORT"
echo ""

# Upload the file
ampy --port "$PORT" --baud 115200 put esp32_servo_test.py

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Upload successful!"
    echo ""
    echo "To run the test, connect to ESP32 REPL and type:"
    echo "  exec(open('esp32_servo_test.py').read())"
    echo ""
    echo "Or use: ampy --port $PORT run esp32_servo_test.py"
else
    echo ""
    echo "✗ Upload failed. Check:"
    echo "  1. ESP32 is connected"
    echo "  2. Port is correct"
    echo "  3. MicroPython is installed on ESP32"
    echo "  4. No other program is using the port"
fi

