"""
Main simulation script for robot arm control.
Uses webcam to detect cups and executes harvesting sequence when button is pressed.
"""
import cv2
import json
import time
from detect import find_cup, detect_all_objects
from kinematics import px_to_table, fake_ik_to_us, get_arm_orientation_info, load_calibration

PRINT_JSON_ONLY = False  # True to suppress windows

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

print("Controls: q=quit, g=grab/harvest cup (moves it to the side)")


def draw_ui(frame, cup=None, all_detections=None):
    """
    Draw detection UI on frame.
    """
    vis = frame.copy()
    
    # Draw all detections in gray (for reference)
    if all_detections:
        for det in all_detections:
            if det.get("label") != "cup":  # Don't draw cup twice
                x, y, w, h = det["bbox"]
                cx, cy = det["cx"], det["cy"]
                cv2.rectangle(vis, (x, y), (x + w, y + h), (100, 100, 100), 1)
                label = f"{det.get('label', 'object')} ({det.get('confidence', 0):.2f})"
                cv2.putText(vis, label, (x, max(0, y - 5)), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.4, (100, 100, 100), 1)
    
    # Draw cup detection prominently
    if cup:
        cx, cy = cup["cx"], cup["cy"]
        x, y, w, h = cup["bbox"]
        
        # Draw bounding box in green
        cv2.rectangle(vis, (x, y), (x + w, y + h), (0, 255, 0), 3)
        
        # Draw centroid
        cv2.circle(vis, (cx, cy), 8, (0, 255, 0), -1)
        cv2.circle(vis, (cx, cy), 12, (0, 255, 0), 2)
        
        # Draw label
        label = f"CUP ({cup.get('confidence', 0):.2f})"
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
    status = "CUP DETECTED" if cup else "No cup detected"
    cv2.putText(vis, status, (10, 30), 
               cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    
    return vis


def execute_harvesting_sequence(cup):
    """
    Execute the harvesting sequence: grab cup and move it to the side.
    
    Args:
        cup: Cup detection dict with 'cx', 'cy', 'bbox'
    """
    # Convert pixel coordinates to table coordinates
    cx, cy = cup["cx"], cup["cy"]
    x, y = px_to_table(cx, cy, calibration=calibration)
    
    print(f"\n{'='*60}")
    print(f"HARVESTING SEQUENCE INITIATED")
    print(f"{'='*60}")
    print(f"Cup detected at pixel: ({cx}, {cy})")
    print(f"Table coordinates: ({x:.3f}m, {y:.3f}m)")
    
    # Get arm orientation info
    orientation_info = get_arm_orientation_info(x, y, z=0.02, calibration=calibration)
    print(f"\nArm configuration:")
    print(f"  Base angle: {orientation_info['angles_deg']['base_deg']:.1f}°")
    print(f"  Shoulder angle: {orientation_info['angles_deg']['shoulder_deg']:.1f}°")
    print(f"  Elbow angle: {orientation_info['angles_deg']['elbow_deg']:.1f}°")
    print(f"  Wrist angle: {orientation_info['angles_deg']['wrist_deg']:.1f}°")
    
    # Calculate side position (move 5cm to the right)
    side_offset = 0.05  # 5cm to the side
    x_side = x + side_offset
    y_side = y
    
    # Define waypoints for harvesting sequence
    waypoints = [
        {"name": "above_cup", "x": x, "y": y, "z": 0.10, "grip": "open", "desc": "Move above cup"},
        {"name": "grab_cup", "x": x, "y": y, "z": 0.02, "grip": "close", "desc": "Lower and grab cup"},
        {"name": "lift", "x": x, "y": y, "z": 0.10, "grip": "close", "desc": "Lift cup"},
        {"name": "move_side", "x": x_side, "y": y_side, "z": 0.10, "grip": "close", "desc": "Move to side"},
        {"name": "drop", "x": x_side, "y": y_side, "z": 0.02, "grip": "open", "desc": "Lower and release"},
    ]
    
    print(f"\n{'='*60}")
    print(f"EXECUTING WAYPOINTS")
    print(f"{'='*60}")
    
    for i, wp in enumerate(waypoints, 1):
        print(f"\n[{i}/{len(waypoints)}] {wp['name'].upper()}: {wp['desc']}")
        print(f"  Position: ({wp['x']:.3f}m, {wp['y']:.3f}m, {wp['z']:.3f}m)")
        print(f"  Gripper: {wp['grip'].upper()}")
        
        # Calculate inverse kinematics
        us = fake_ik_to_us(wp["x"], wp["y"], wp["z"], calibration=calibration)
        
        # Set gripper state
        us[-1] = 1200 if wp["grip"] == "open" else 1800
        
        # Output servo command
        command = {
            "op": "j",
            "us": us,
            "wp": wp["name"],
            "position": {"x": wp["x"], "y": wp["y"], "z": wp["z"]},
            "gripper": wp["grip"]
        }
        
        print(f"  Servo commands: {us}")
        print(json.dumps(command))
        
        # Simulate movement delay
        time.sleep(0.2)
    
    print(f"\n{'='*60}")
    print(f"HARVESTING SEQUENCE COMPLETE")
    print(f"{'='*60}\n")


# Main loop
frame_count = 0
all_detections = []

while True:
    ok, frame = cap.read()
    if not ok:
        break
    
    # Flip frame horizontally
    frame = cv2.flip(frame, 1)
    
    # Detect cup every frame
    cup, _ = find_cup(frame, confidence=0.25)
    
    # Detect all objects every 5 frames (for display only)
    if frame_count % 5 == 0:
        all_detections, _ = detect_all_objects(frame, confidence=0.25)
    
    frame_count += 1
    
    # Draw UI
    vis = draw_ui(frame, cup, all_detections)
    
    if not PRINT_JSON_ONLY:
        cv2.imshow("A.U.R.A. FARM - Cup Detection", vis)
    
    k = cv2.waitKey(1) & 0xFF
    
    if k == ord('q'):
        break
    
    if k == ord('g'):
        # Grab/harvest command
        if cup:
            print("\n🔄 Initiating harvesting sequence...")
            execute_harvesting_sequence(cup)
        else:
            print("\n❌ No cup detected. Please position a cup in front of the camera.")
            print("   Make sure the cup is clearly visible in the frame.")

cap.release()
cv2.destroyAllWindows()
print("Camera released. Exiting.")
