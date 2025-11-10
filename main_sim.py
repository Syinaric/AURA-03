"""
Main simulation script for robot arm control.
Uses webcam with YOLOv8 to detect objects and executes tasks based on data-driven decisions.
Tasks are generated from agricultural data thresholds and executed using computer vision.
"""
import cv2
import json
import time
import sys
import threading
from detect import find_cup, detect_all_objects
from kinematics import px_to_table, load_calibration

# Try to import keyboard listener (for macOS compatibility)
try:
    from pynput import keyboard
    KEYBOARD_LISTENER_AVAILABLE = True
except ImportError:
    KEYBOARD_LISTENER_AVAILABLE = False
    print("Note: pynput not installed. Install with: pip install pynput")

# Try to import ESP32 controller (optional)
try:
    from esp32_control import ESP32Controller
    ESP32_AVAILABLE = True
except ImportError:
    ESP32_AVAILABLE = False
    print("Note: ESP32 control not available (pyserial not installed). Running in simulation mode.")

PRINT_JSON_ONLY = False  # True to suppress windows
USE_ESP32 = False  # Set to True to control real servos
esp32_controller = None

cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("Error: Camera 0 not available. Trying camera 1...")
    cap = cv2.VideoCapture(1)
    if not cap.isOpened():
        raise SystemExit("Error: No camera available. Check camera permissions in System Settings > Privacy & Security > Camera")
    else:
        print("Using camera 1")
else:
    print("Using camera 0")

cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
print("Camera initialized successfully")

# Load calibration
calibration = load_calibration()
print("Calibration loaded")

# Initialize ESP32 controller if requested
if ESP32_AVAILABLE and len(sys.argv) > 1 and sys.argv[1] == "--esp32":
    USE_ESP32 = True
    port = sys.argv[2] if len(sys.argv) > 2 else None
    print("\nConnecting to ESP32...")
    esp32_controller = ESP32Controller(port=port)
    if esp32_controller.connect():
        print("✅ ESP32 connected! Servos will be controlled in real-time.")
        USE_ESP32 = True
    else:
        print("❌ Failed to connect to ESP32. Running in simulation mode.")
        USE_ESP32 = False
        esp32_controller = None
elif ESP32_AVAILABLE:
    print("\n💡 Tip: Run with '--esp32 [port]' to control real servos")
    print("   Example: python main_sim.py --esp32 /dev/cu.usbserial-*")
    print("   Or: python main_sim.py --esp32  (auto-detect port)")

print("\nControls: q=quit, g=grab/harvest bottle (moves it to the side)")


def draw_ui(frame, bottle=None, all_detections=None):
    """
    Draw detection UI on frame.
    """
    vis = frame.copy()
    
    # Draw all detections in gray (for reference)
    if all_detections:
        for det in all_detections:
            if det.get("label") != "bottle":  # Don't draw bottle twice
                x, y, w, h = det["bbox"]
                cx, cy = det["cx"], det["cy"]
                cv2.rectangle(vis, (x, y), (x + w, y + h), (100, 100, 100), 1)
                label = f"{det.get('label', 'object')} ({det.get('confidence', 0):.2f})"
                cv2.putText(vis, label, (x, max(0, y - 5)), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.4, (100, 100, 100), 1)
    
    # Draw bottle detection prominently
    if bottle:
        cx, cy = bottle["cx"], bottle["cy"]
        x, y, w, h = bottle["bbox"]
        
        # Draw bounding box in green
        cv2.rectangle(vis, (x, y), (x + w, y + h), (0, 255, 0), 3)
        
        # Draw centroid
        cv2.circle(vis, (cx, cy), 8, (0, 255, 0), -1)
        cv2.circle(vis, (cx, cy), 12, (0, 255, 0), 2)
        
        # Draw label
        label = f"BOTTLE ({bottle.get('confidence', 0):.2f})"
        cv2.putText(vis, label, (x, max(0, y - 10)), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
        
        # Draw coordinates
        x_table, y_table = px_to_table(cx, cy, calibration=calibration)
        coord_text = f"Table: ({x_table:.3f}m, {y_table:.3f}m)"
        cv2.putText(vis, coord_text, (x, y + h + 20), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        
        # Draw pixel coordinates
        px_text = f"Pixel: ({cx}, {cy})"
        cv2.putText(vis, px_text, (x, y + h + 40), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)
    
    # Draw status
    status = "BOTTLE DETECTED" if bottle else "No bottle detected"
    cv2.putText(vis, status, (10, 30), 
               cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    
    # Draw controls with better visibility
    cv2.putText(vis, "PRESS 'G' TO GRAB | 'Q' TO QUIT", (10, vis.shape[0] - 30), 
               cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)
    cv2.putText(vis, ">>> CLICK THIS WINDOW FIRST <<<", (10, vis.shape[0] - 10), 
               cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
    
    return vis


# Hardcoded pickup sequence positions
# Servo microseconds: 1500 = center (90°), 900 = 0°, 2100 = 180°
# Base (D5): lower = left, higher = right
# Shoulder (D18): lower = arm up, higher = arm down
# Elbow (D22): lower = elbow up, higher = elbow down
# Only 3 servos: base, shoulder, elbow (no wrist)

HOME = [1500, 1500, 1500]  # [base, shoulder, elbow]

# Hardcoded pickup sequence for object directly in front
PICKUP_SEQUENCE = [
    # 1. Approach position (arm extended forward, above object)
    {"name": "approach", "servos": [1500, 1600, 1800], "delay": 2.5},
    
    # 2. Lower partway (smooth transition down)
    {"name": "lower_partway", "servos": [1500, 1400, 2000], "delay": 2.0},
    
    # 3. Lower to grab position (reach down to object)
    {"name": "lower", "servos": [1500, 1200, 2100], "delay": 2.5},
    
    # 4. Lift partway (smooth transition up - grabbing object)
    {"name": "lift_partway", "servos": [1500, 1400, 2000], "delay": 2.0},
    
    # 5. Lift up (pick up object)
    {"name": "lift", "servos": [1500, 1600, 1800], "delay": 2.5},
    
    # 6. Return to home position
    {"name": "home", "servos": HOME, "delay": 2.5},
]

# Flag to prevent multiple sequences running at once
sequence_running = False

# Global flag for keyboard input
key_pressed = None
key_lock = threading.Lock()

def on_key_press(key):
    """Handle keyboard press events."""
    global key_pressed
    try:
        # Debug: print what key was received
        print(f"\n[DEBUG] Key received: {key}, type: {type(key)}")
        
        if hasattr(key, 'char') and key.char:
            with key_lock:
                key_pressed = key.char.lower()
                print(f"\n>>> ✅ Key pressed via listener: '{key_pressed}'")
        elif key == keyboard.Key.space:
            with key_lock:
                key_pressed = ' '
                print(f"\n>>> ✅ Space pressed via listener")
        elif key == keyboard.Key.esc:
            with key_lock:
                key_pressed = 'q'
                print(f"\n>>> ✅ ESC pressed via listener")
        else:
            print(f"[DEBUG] Key not recognized: {key}")
    except Exception as e:
        print(f"[ERROR] Exception in on_key_press: {e}")

def on_key_release(key):
    """Handle keyboard release events."""
    pass

# Start keyboard listener in background thread
keyboard_listener = None
if KEYBOARD_LISTENER_AVAILABLE:
    try:
        keyboard_listener = keyboard.Listener(on_press=on_key_press, on_release=on_key_release, suppress=False)
        keyboard_listener.start()
        print("✅ Background keyboard listener started (works even when window not focused)")
        print("   NOTE: On macOS, you may need to grant Accessibility permissions")
        print("   System Settings > Privacy & Security > Accessibility > Terminal (or Python)")
        time.sleep(0.5)  # Give listener time to start
    except Exception as e:
        print(f"⚠️  Could not start keyboard listener: {e}")
        print("   Falling back to OpenCV window input only")
        KEYBOARD_LISTENER_AVAILABLE = False
else:
    print("⚠️  pynput not available - using OpenCV window input only")
    print("   Install with: pip install pynput")

def execute_harvesting_sequence(bottle):
    """
    Execute the hardcoded harvesting sequence: grab bottle and move it to the left.
    Runs in a separate thread so it doesn't block the camera.
    
    Args:
        bottle: Bottle detection dict with 'cx', 'cy', 'bbox' (used for display only)
    """
    global sequence_running
    
    if sequence_running:
        print("\n⚠️  Sequence already running. Please wait...")
        return
    
    def run_sequence():
        global sequence_running
        sequence_running = True
        
        # Convert pixel coordinates to table coordinates (for display)
        cx, cy = bottle["cx"], bottle["cy"]
        x, y = px_to_table(cx, cy, calibration=calibration)
        
        print(f"\n{'='*60}")
        print(f"HARVESTING SEQUENCE INITIATED")
        print(f"{'='*60}")
        print(f"Bottle detected at pixel: ({cx}, {cy})")
        print(f"Table coordinates: ({x:.3f}m, {y:.3f}m)")
        print(f"\nExecuting hardcoded pickup sequence...")
        print(f"{'='*60}")
        
        for i, step in enumerate(PICKUP_SEQUENCE, 1):
            print(f"\n[{i}/{len(PICKUP_SEQUENCE)}] {step['name'].upper()}")
            print(f"  Servos: Base(D5)={step['servos'][0]}us, Shoulder(D18)={step['servos'][1]}us, "
                  f"Elbow(D22)={step['servos'][2]}us")
            
            # Send command to ESP32 if connected
            if USE_ESP32 and esp32_controller:
                success = esp32_controller.set_servos_from_us_list(step['servos'])
                if success:
                    print(f"  ✅ Command sent to ESP32")
                else:
                    print(f"  ❌ Failed to send command to ESP32")
            else:
                print(f"  (Simulation mode - no ESP32)")
            
            # Wait for movement
            time.sleep(step['delay'])
        
        print(f"\n{'='*60}")
        print(f"HARVESTING SEQUENCE COMPLETE")
        print(f"{'='*60}\n")
        
        sequence_running = False
    
    # Run sequence in separate thread
    thread = threading.Thread(target=run_sequence, daemon=True)
    thread.start()


# Main loop
frame_count = 0
all_detections = []

while True:
    ok, frame = cap.read()
    if not ok:
        break
    
    # Flip frame horizontally
    frame = cv2.flip(frame, 1)
    
    # Detect bottle every frame
    bottle, _ = find_cup(frame, confidence=0.25)
    
    # Detect all objects every 5 frames (for display only)
    if frame_count % 5 == 0:
        all_detections, _ = detect_all_objects(frame, confidence=0.25)
    
    frame_count += 1
    
    # Draw UI
    vis = draw_ui(frame, bottle, all_detections)
    
    if not PRINT_JSON_ONLY:
        cv2.imshow("A.U.R.A. FARM - Bottle Detection", vis)
    
    # Check for keyboard input from both OpenCV window and background listener
    k = None
    
    # Method 1: Background keyboard listener (works without window focus) - check first
    if KEYBOARD_LISTENER_AVAILABLE:
        with key_lock:
            if key_pressed:
                k = key_pressed
                key_pressed = None  # Reset after reading
                print(f"\n>>> ✅ Using key from listener: '{k}'")
    
    # Method 2: OpenCV window input (requires window focus) - fallback
    if not k:
        cv_key = cv2.waitKey(1) & 0xFF
        if cv_key != 255 and cv_key != 0:
            try:
                k = chr(cv_key).lower()
                print(f"\n>>> ✅ Key from OpenCV window: '{k}'")
            except:
                pass
    
    # Process key press
    if k:
        if k == 'q':
            print("\nQuitting...")
            break
        
        if k == 'g':
            # Grab/harvest command - run hardcoded sequence regardless of bottle detection
            print("\n" + "="*60)
            print("🔄 INITIATING HARVESTING SEQUENCE...")
            print("="*60)
            print("   (Running hardcoded sequence - bottle detection is for display only)")
            # Use a dummy bottle dict for display purposes
            dummy_bottle = {"cx": 320, "cy": 240, "bbox": (280, 200, 80, 80), "confidence": 1.0}
            execute_harvesting_sequence(dummy_bottle)

cap.release()
cv2.destroyAllWindows()

# Stop keyboard listener
if keyboard_listener:
    keyboard_listener.stop()

# Disconnect ESP32 if connected
if esp32_controller:
    esp32_controller.disconnect()

print("Camera released. Exiting.")
