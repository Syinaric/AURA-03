/*
 * ESP32 Servo Test Code for MG996R Servos
 * Arduino IDE version
 * 
 * Hardware:
 * - Servo 1 (Base): GPIO 2 (D2)
 * - Servo 2 (Shoulder): GPIO 5 (D5)
 * - Servo 3 (Elbow): GPIO 18 (D18)
 * - MG996R 180-degree servos
 * - External power supply (5V)
 * 
 * Required library: ESP32Servo
 * Install via: Tools > Manage Libraries > Search "ESP32Servo"
 */

#include <ESP32Servo.h>

// Servo GPIO pins
#define SERVO_BASE_PIN 2      // D2
#define SERVO_SHOULDER_PIN 5  // D5
#define SERVO_ELBOW_PIN 18    // D18

// Create servo objects
Servo servo_base;
Servo servo_shoulder;
Servo servo_elbow;

// MG996R servo specifications
// Pulse width: 500us (0°) to 2500us (180°)
#define SERVO_MIN_PULSE 500   // 0.5ms in microseconds
#define SERVO_MAX_PULSE 2500  // 2.5ms in microseconds

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("==========================================");
  Serial.println("ESP32 Servo Test - MG996R Servos");
  Serial.println("==========================================");
  Serial.println("\nInitializing servos...");
  Serial.println("Base: GPIO 2 (D2)");
  Serial.println("Shoulder: GPIO 5 (D5)");
  Serial.println("Elbow: GPIO 18 (D18)");
  
  // Attach servos to pins
  servo_base.attach(SERVO_BASE_PIN, SERVO_MIN_PULSE, SERVO_MAX_PULSE);
  servo_shoulder.attach(SERVO_SHOULDER_PIN, SERVO_MIN_PULSE, SERVO_MAX_PULSE);
  servo_elbow.attach(SERVO_ELBOW_PIN, SERVO_MIN_PULSE, SERVO_MAX_PULSE);
  
  Serial.println("\nServos attached. Starting tests in 2 seconds...");
  delay(2000);
  
  // Run test sequence
  testIndividualServos();
  delay(1000);
  
  testAllServos();
  delay(1000);
  
  sweepTest();
  
  Serial.println("\n==========================================");
  Serial.println("All tests complete!");
  Serial.println("==========================================");
  Serial.println("\nServos are now at 90° (center position)");
}

void loop() {
  // Continuous operation - you can add interactive commands here
  // For now, servos stay at center position
  delay(1000);
}

void testIndividualServos() {
  Serial.println("\n=== Testing Individual Servos ===");
  
  // Test Base
  Serial.println("\n--- Testing Base (D2) ---");
  setServoAngle(servo_base, "Base", 0);
  delay(500);
  setServoAngle(servo_base, "Base", 90);
  delay(500);
  setServoAngle(servo_base, "Base", 180);
  delay(500);
  setServoAngle(servo_base, "Base", 90);
  delay(500);
  
  // Test Shoulder
  Serial.println("\n--- Testing Shoulder (D5) ---");
  setServoAngle(servo_shoulder, "Shoulder", 0);
  delay(500);
  setServoAngle(servo_shoulder, "Shoulder", 90);
  delay(500);
  setServoAngle(servo_shoulder, "Shoulder", 180);
  delay(500);
  setServoAngle(servo_shoulder, "Shoulder", 90);
  delay(500);
  
  // Test Elbow
  Serial.println("\n--- Testing Elbow (D18) ---");
  setServoAngle(servo_elbow, "Elbow", 0);
  delay(500);
  setServoAngle(servo_elbow, "Elbow", 90);
  delay(500);
  setServoAngle(servo_elbow, "Elbow", 180);
  delay(500);
  setServoAngle(servo_elbow, "Elbow", 90);
  delay(500);
}

void testAllServos() {
  Serial.println("\n=== Testing All Servos Together ===");
  
  Serial.println("Moving all servos to 0°...");
  setServoAngle(servo_base, "Base", 0);
  setServoAngle(servo_shoulder, "Shoulder", 0);
  setServoAngle(servo_elbow, "Elbow", 0);
  delay(1000);
  
  Serial.println("Moving all servos to 90°...");
  setServoAngle(servo_base, "Base", 90);
  setServoAngle(servo_shoulder, "Shoulder", 90);
  setServoAngle(servo_elbow, "Elbow", 90);
  delay(1000);
  
  Serial.println("Moving all servos to 180°...");
  setServoAngle(servo_base, "Base", 180);
  setServoAngle(servo_shoulder, "Shoulder", 180);
  setServoAngle(servo_elbow, "Elbow", 180);
  delay(1000);
  
  Serial.println("Returning all servos to 90°...");
  setServoAngle(servo_base, "Base", 90);
  setServoAngle(servo_shoulder, "Shoulder", 90);
  setServoAngle(servo_elbow, "Elbow", 90);
  delay(1000);
}

void sweepTest() {
  Serial.println("\n=== Smooth Sweep Test ===");
  
  // Sweep Base
  Serial.println("Sweeping Base from 0° to 180°...");
  for (int angle = 0; angle <= 180; angle += 2) {
    setServoAngle(servo_base, "Base", angle);
    delay(50);
  }
  delay(500);
  
  // Sweep Shoulder
  Serial.println("Sweeping Shoulder from 0° to 180°...");
  for (int angle = 0; angle <= 180; angle += 2) {
    setServoAngle(servo_shoulder, "Shoulder", angle);
    delay(50);
  }
  delay(500);
  
  // Sweep Elbow
  Serial.println("Sweeping Elbow from 0° to 180°...");
  for (int angle = 0; angle <= 180; angle += 2) {
    setServoAngle(servo_elbow, "Elbow", angle);
    delay(50);
  }
  delay(500);
  
  // Return all to center
  setServoAngle(servo_base, "Base", 90);
  setServoAngle(servo_shoulder, "Shoulder", 90);
  setServoAngle(servo_elbow, "Elbow", 90);
}

void setServoAngle(Servo &servo, const char* name, int angle) {
  // Clamp angle to valid range
  angle = constrain(angle, 0, 180);
  
  // Write angle to servo
  servo.write(angle);
  
  Serial.print(name);
  Serial.print(": ");
  Serial.print(angle);
  Serial.println("°");
}

