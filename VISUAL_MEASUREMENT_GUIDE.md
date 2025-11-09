# Visual Measurement Guide for Your 3D-Printed Robot Arm

Based on your arm image, here's exactly where to measure each dimension:

## ✅ Already Measured

- **Base Height**: 61.2mm (from table to base top)
- **Shoulder Height**: 95mm (from table to shoulder rotation center)
- **Upper Arm**: 12cm (shoulder to elbow)
- **Lower Arm**: 9cm (elbow to wrist)

---

## 📏 Remaining Measurements Needed

### 1. Wrist Offset (Wrist Center to Gripper Mount)

**What to look for:**
- Find the **wrist servo** (the servo that rotates the gripper around the wrist axis)
- Look for the **servo horn/shaft** - that's the wrist rotation center
- Find where the **gripper yaw servo** attaches (the servo that rotates the gripper left/right)
- That attachment point is the gripper mounting point

**How to measure:**
1. Locate the wrist servo shaft (the rotating part at the end of the lower arm)
2. Locate where the gripper assembly attaches (usually where the gripper yaw servo is mounted)
3. Measure the **straight-line distance** between these two points
4. This distance is along the wrist rotation axis

**Visual reference:**
```
[Lower Arm] ----9cm---- [Wrist Servo Shaft] --?-- [Gripper Yaw Servo Mount]
                              ↑                        ↑
                        Wrist Center          Gripper Mount
                              |
                              | (measure this distance)
                              |
                         [Gripper Assembly]
```

**If gripper mounts directly to wrist:** Offset = 0mm  
**If there's a bracket/adapter:** Measure the bracket length

---

### 2. Gripper Length

**What to look for:**
- The **gripper mounting point** (where gripper yaw servo attaches)
- The **tip of the gripper fingers** when fully open

**How to measure:**
1. Start at the gripper mounting point (gripper yaw servo center)
2. Measure to the **tip of the gripper fingers** when fully open
3. This is the maximum reach of the gripper

**Visual reference:**
```
[Gripper Mount] ----?---- [Gripper Finger Tips (open)]
```

**Typical range:** 30-80mm depending on gripper design

---

### 3. Gripper Width

**What to look for:**
- The **widest part** of the gripper assembly
- Usually the gripper body or the gears

**How to measure:**
1. Measure the **maximum width** of the gripper assembly
2. This is perpendicular to the gripper length
3. Used for collision checking

**Typical range:** 20-50mm

---

### 4. Joint Angle Limits

**How to test each joint:**

#### Base Joint (Rotation)
1. Power on the arm
2. Rotate base **fully clockwise** - note the angle
3. Rotate base **fully counterclockwise** - note the angle
4. **Note:** Mechanical stops may limit range (e.g., -170° to +170° even though servo can do 180°)

**Measurement method:**
- Mark a reference line on the base
- Mark a reference line on the table
- Use a protractor to measure the angle between them

#### Shoulder Joint (Pitch - Up/Down)
1. Move shoulder **fully up** (maximum angle above horizontal)
2. Move shoulder **fully down** (maximum angle below horizontal)
3. Measure from horizontal (0°) as reference

**Measurement method:**
- Use a digital angle finder or smartphone app
- Place it along the upper arm segment
- Measure angle from horizontal

**Typical range:** -45° (down) to +90° (up)

#### Elbow Joint (Pitch - Bend/Straighten)
1. Move elbow **fully extended** (straight, 180°)
2. Move elbow **fully bent** (minimum angle)
3. Measure the angle at the elbow joint

**Measurement method:**
- Use angle finder on the lower arm segment
- Measure angle from upper arm segment
- Fully extended = 180°, fully bent = typically 30-60°

**Typical range:** 30° (bent) to 180° (straight)

#### Gripper Yaw (Left/Right Rotation)
1. Rotate gripper **fully left** - measure angle
2. Rotate gripper **fully right** - measure angle
3. Measure from center (0°) as reference

**Measurement method:**
- Mark reference line on gripper
- Mark reference line on wrist
- Use protractor to measure rotation

**Typical range:** -90° to +90°

#### Gripper Pitch (Up/Down Tilt)
1. Tilt gripper **fully up** - measure angle
2. Tilt gripper **fully down** - measure angle
3. Measure from level (0°) as reference

**Measurement method:**
- Use angle finder on gripper body
- Measure from horizontal

**Typical range:** -45° to +45°

---

## 🔍 Identifying Parts on Your Arm

### Finding Joint Centers

**Base Joint:**
- Look at the **base** - the rotating part on top
- The **servo shaft** in the center is the rotation point
- This is where the first arm segment attaches

**Shoulder Joint:**
- Where the **first arm segment** connects to the **second segment**
- Look for the **shoulder servo** - its shaft is the shoulder center
- This is 95mm above the table (you already measured this)

**Elbow Joint:**
- Where the **upper arm** connects to the **lower arm**
- Look for the **elbow servo** - its shaft is the elbow center
- This is 12cm from the shoulder center

**Wrist Joint:**
- At the end of the **lower arm** (9cm from elbow)
- Look for the **wrist servo** - this rotates the gripper
- The servo shaft is the wrist center
- **Important:** This axis is perpendicular to the elbow axis

**Gripper Mount:**
- Where the **gripper yaw servo** is mounted
- This is usually attached to the wrist servo
- May have a bracket or adapter between wrist and gripper

---

## 📐 Measurement Tools Needed

1. **Ruler or Caliper** - For linear measurements (mm/cm)
2. **Digital Angle Finder** - Best for angle measurements
3. **Smartphone App** - Many free angle measurement apps available
4. **Protractor** - Traditional angle measurement tool

---

## 🎯 Quick Measurement Checklist

### Link Lengths
- [x] Base height: 61.2mm
- [x] Shoulder height: 95mm
- [x] Upper arm: 12cm
- [x] Lower arm: 9cm
- [ ] **Wrist offset: _____ mm**
- [ ] **Gripper length: _____ mm**
- [ ] **Gripper width: _____ mm**

### Joint Limits
- [ ] **Base: -_____° to +_____°**
- [ ] **Shoulder: -_____° to +_____°**
- [ ] **Elbow: _____° to _____°**
- [x] Wrist: Continuous rotation (speed control)
- [ ] **Gripper Yaw: -_____° to +_____°**
- [ ] **Gripper Pitch: -_____° to +_____°**

### GPIO Pins
- [x] Base: GPIO 2 (D2)
- [x] Shoulder: GPIO 5 (D5)
- [x] Elbow: GPIO 18 (D18)
- [ ] **Wrist: GPIO _____**
- [ ] **Gripper Yaw: GPIO _____**
- [ ] **Gripper Pitch: GPIO _____**

---

## 💡 Measurement Tips

### For Wrist Offset:
- If you see a **bracket or adapter** between the wrist servo and gripper, measure that bracket's length
- If the gripper mounts **directly** to the wrist servo horn, offset = 0mm
- Look for the **gripper yaw servo** - that's where the gripper assembly starts

### For Gripper Length:
- Open the gripper **fully** before measuring
- Measure from the **gripper yaw servo center** to the **finger tips**
- This is the maximum reach extension

### For Joint Angles:
- **Test physically** - don't just use servo limits
- Mechanical stops may limit actual range
- Use an angle finder for accuracy
- Test both directions (clockwise/counterclockwise, up/down)

---

## 📋 Report Format

Once you have all measurements, provide them like this:

```
Wrist Offset: X mm
Gripper Length: X mm
Gripper Width: X mm

Base Joint: -X° to +X°
Shoulder Joint: -X° to +X°
Elbow Joint: X° to X°
Gripper Yaw: -X° to +X°
Gripper Pitch: -X° to +X°

Wrist GPIO Pin: X
Gripper Yaw GPIO Pin: X
Gripper Pitch GPIO Pin: X
```

Then I'll update the inverse kinematics code with your exact specifications!

