"""
ESP32 Servo Test Code for MG996R Servos
MicroPython version

Hardware:
- Servo 1 (Base): GPIO D2 (GPIO 2)
- Servo 2 (Shoulder): GPIO D5 (GPIO 5)
- Servo 3 (Elbow): GPIO D18 (GPIO 18)
- MG996R 180-degree servos
- External power supply (5V)
"""

from machine import Pin, PWM
import time

# Servo GPIO pins
SERVO_BASE_PIN = 2      # D2
SERVO_SHOULDER_PIN = 5  # D5
SERVO_ELBOW_PIN = 18    # D18

# MG996R servo specifications
# PWM frequency: 50Hz (20ms period)
# Pulse width: 0.5ms (0°) to 2.5ms (180°)
# Duty cycle: 2.5% (0°) to 12.5% (180°)
SERVO_FREQ = 50  # 50Hz
SERVO_MIN_DUTY = 25   # 0.5ms / 20ms * 1024 = 25.6 (0°)
SERVO_MAX_DUTY = 128  # 2.5ms / 20ms * 1024 = 128 (180°)
SERVO_MID_DUTY = 77   # 1.5ms / 20ms * 1024 = 76.8 (90°)

# Initialize PWM for each servo
servo_base = PWM(Pin(SERVO_BASE_PIN), freq=SERVO_FREQ)
servo_shoulder = PWM(Pin(SERVO_SHOULDER_PIN), freq=SERVO_FREQ)
servo_elbow = PWM(Pin(SERVO_ELBOW_PIN), freq=SERVO_FREQ)

def angle_to_duty(angle):
    """
    Convert angle (0-180) to PWM duty cycle.
    
    Args:
        angle: Angle in degrees (0-180)
    
    Returns:
        Duty cycle value (0-1024)
    """
    # Clamp angle to valid range
    angle = max(0, min(180, angle))
    # Linear mapping: 0° -> MIN_DUTY, 180° -> MAX_DUTY
    duty = int(SERVO_MIN_DUTY + (angle / 180.0) * (SERVO_MAX_DUTY - SERVO_MIN_DUTY))
    return duty

def set_servo_angle(servo, angle):
    """
    Set servo to specific angle.
    
    Args:
        servo: PWM object (servo_base, servo_shoulder, or servo_elbow)
        angle: Angle in degrees (0-180)
    """
    duty = angle_to_duty(angle)
    servo.duty(duty)
    print(f"Set servo to {angle}° (duty: {duty})")

def test_servo(servo, name, delay=0.5):
    """
    Test a single servo by sweeping through its range.
    
    Args:
        servo: PWM object
        name: Servo name for display
        delay: Delay between positions (seconds)
    """
    print(f"\n=== Testing {name} ===")
    
    # Move to 0°
    set_servo_angle(servo, 0)
    time.sleep(delay)
    
    # Move to 90° (center)
    set_servo_angle(servo, 90)
    time.sleep(delay)
    
    # Move to 180°
    set_servo_angle(servo, 180)
    time.sleep(delay)
    
    # Return to center
    set_servo_angle(servo, 90)
    time.sleep(delay)
    
    print(f"{name} test complete!")

def test_all_servos():
    """Test all three servos together."""
    print("\n=== Testing All Servos Together ===")
    
    # All to 0°
    print("Moving all servos to 0°...")
    set_servo_angle(servo_base, 0)
    set_servo_angle(servo_shoulder, 0)
    set_servo_angle(servo_elbow, 0)
    time.sleep(1)
    
    # All to 90°
    print("Moving all servos to 90°...")
    set_servo_angle(servo_base, 90)
    set_servo_angle(servo_shoulder, 90)
    set_servo_angle(servo_elbow, 90)
    time.sleep(1)
    
    # All to 180°
    print("Moving all servos to 180°...")
    set_servo_angle(servo_base, 180)
    set_servo_angle(servo_shoulder, 180)
    set_servo_angle(servo_elbow, 180)
    time.sleep(1)
    
    # Return to center
    print("Returning all servos to 90°...")
    set_servo_angle(servo_base, 90)
    set_servo_angle(servo_shoulder, 90)
    set_servo_angle(servo_elbow, 90)
    time.sleep(1)
    
    print("All servos test complete!")

def sweep_servo(servo, name, start_angle=0, end_angle=180, step=5, delay=0.1):
    """
    Smoothly sweep a servo through a range.
    
    Args:
        servo: PWM object
        name: Servo name
        start_angle: Starting angle
        end_angle: Ending angle
        step: Angle step size
        delay: Delay between steps
    """
    print(f"\n=== Sweeping {name} from {start_angle}° to {end_angle}° ===")
    
    if start_angle < end_angle:
        angles = range(start_angle, end_angle + 1, step)
    else:
        angles = range(start_angle, end_angle - 1, -step)
    
    for angle in angles:
        set_servo_angle(servo, angle)
        time.sleep(delay)
    
    print(f"{name} sweep complete!")

def main():
    """Main test sequence."""
    print("=" * 50)
    print("ESP32 Servo Test - MG996R Servos")
    print("=" * 50)
    print("\nInitializing servos...")
    print("Base: GPIO 2 (D2)")
    print("Shoulder: GPIO 5 (D5)")
    print("Elbow: GPIO 18 (D18)")
    print("\nStarting tests in 2 seconds...")
    time.sleep(2)
    
    # Test individual servos
    test_servo(servo_base, "Base (D2)")
    time.sleep(1)
    
    test_servo(servo_shoulder, "Shoulder (D5)")
    time.sleep(1)
    
    test_servo(servo_elbow, "Elbow (D18)")
    time.sleep(1)
    
    # Test all together
    test_all_servos()
    time.sleep(1)
    
    # Smooth sweep test
    print("\n=== Smooth Sweep Test ===")
    sweep_servo(servo_base, "Base", 0, 180, step=2, delay=0.05)
    time.sleep(0.5)
    sweep_servo(servo_shoulder, "Shoulder", 0, 180, step=2, delay=0.05)
    time.sleep(0.5)
    sweep_servo(servo_elbow, "Elbow", 0, 180, step=2, delay=0.05)
    
    print("\n" + "=" * 50)
    print("All tests complete!")
    print("=" * 50)
    print("\nServos are now at 90° (center position)")
    print("You can manually control them using:")
    print("  set_servo_angle(servo_base, angle)")
    print("  set_servo_angle(servo_shoulder, angle)")
    print("  set_servo_angle(servo_elbow, angle)")

# Run tests
if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nTest interrupted by user")
        # Return all servos to center
        set_servo_angle(servo_base, 90)
        set_servo_angle(servo_shoulder, 90)
        set_servo_angle(servo_elbow, 90)
        print("Servos returned to center position")
    except Exception as e:
        print(f"\nError: {e}")
        # Return all servos to center on error
        set_servo_angle(servo_base, 90)
        set_servo_angle(servo_shoulder, 90)
        set_servo_angle(servo_elbow, 90)

