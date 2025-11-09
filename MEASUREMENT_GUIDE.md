# Robot Arm Measurement Guide

## Your Current Measurements

✅ **Base Height**: 61.2mm (0.0612m) - Height of base above table  
✅ **Shoulder Height**: 95mm (0.095m) - Table surface to shoulder rotating center  
✅ **Upper Arm Length**: 12cm (0.12m) - Shoulder center to elbow center  
✅ **Lower Arm Length**: 9cm (0.09m) - Elbow center to wrist center  
✅ **Wrist Orientation**: Wrist rotation axis is perpendicular to elbow rotation axis

---

## Remaining Measurements Needed

### 1. Wrist Offset (Wrist to Gripper Mount)

**What to measure:** Distance from wrist joint center to where the gripper attaches.

**How to measure:**
- Find the **wrist joint center** (the rotating point of the wrist servo)
- Find the **gripper mounting point** (where the gripper attaches to the wrist)
- Measure the **straight-line distance** between these two points
- This is usually along the wrist rotation axis

**Visual guide:**
```
[Elbow] ----9cm---- [Wrist Center] --?-- [Gripper Mount]
                              |
                              | (wrist offset)
                              |
                         [Gripper]
```

**Example:** If gripper mounts directly at wrist center = 0mm  
If there's a bracket/offset = measure that distance (e.g., 20mm = 0.02m)

---

### 2. Gripper Length

**What to measure:** Distance from gripper mounting point to the tip of the gripper fingers when fully open.

**How to measure:**
- Start at the **gripper mounting point** (where it attaches to wrist)
- Measure to the **tip of the gripper fingers** when fully open
- This is the maximum reach extension of the gripper

**Visual guide:**
```
[Gripper Mount] ----?---- [Gripper Tip (open)]
```

**Example:** If gripper extends 5cm from mount = 0.05m

---

### 3. Gripper Width

**What to measure:** Width of the gripper assembly (side to side).

**How to measure:**
- Measure the **maximum width** of the gripper assembly
- This is perpendicular to the gripper length
- Used for collision checking

**Example:** If gripper is 3cm wide = 0.03m

---

### 4. Joint Angle Limits

**What to measure:** The actual range of motion for each joint (not just servo limits).

**How to measure each joint:**

#### Base Joint (Rotation)
- Rotate the base **fully clockwise** - measure angle from home position
- Rotate the base **fully counterclockwise** - measure angle from home position
- **Note:** This is usually limited by mechanical stops, not servo limits
- Example: -170° to +170° (servo can do 180°, but mechanical stops limit it)

#### Shoulder Joint (Pitch)
- Move shoulder **fully up** (maximum angle above horizontal)
- Move shoulder **fully down** (maximum angle below horizontal)
- Measure from horizontal (0°) as reference
- Example: -45° (down) to +90° (up)

#### Elbow Joint (Pitch)
- Move elbow **fully extended** (straight, 180°)
- Move elbow **fully bent** (minimum angle)
- Measure the angle at the elbow joint
- Example: 30° (bent) to 180° (straight)

#### Wrist Joint (Roll - Continuous Rotation)
- This is a **continuous rotation servo** - no angle limits
- Just note the **speed range**: -100% to +100%
- Test: What's the maximum speed it can rotate?

#### Gripper Yaw (Rotation)
- Rotate gripper **fully left** - measure angle
- Rotate gripper **fully right** - measure angle
- Example: -90° to +90°

#### Gripper Pitch (Tilt)
- Tilt gripper **fully up** - measure angle
- Tilt gripper **fully down** - measure angle
- Example: -45° to +45°

---

## Measurement Tips

### Finding Joint Centers

**For rotating joints:**
1. Look for the **servo horn/shaft** - this is the rotation center
2. If there's a bearing, the **bearing center** is the joint center
3. Mark the center point with a pen/marker for easier measurement

**For wrist joint (perpendicular to elbow):**
- The wrist rotates around an axis that's **perpendicular** to the elbow axis
- This means: if elbow rotates in XY plane, wrist rotates in XZ or YZ plane
- Find the wrist servo shaft - that's the wrist center

### Measuring Link Lengths

**Upper Arm (Shoulder to Elbow):**
- Measure from **shoulder servo shaft center** to **elbow servo shaft center**
- Measure along the **straight line** between them (not along the curved arm)
- Use a ruler or caliper

**Lower Arm (Elbow to Wrist):**
- Measure from **elbow servo shaft center** to **wrist servo shaft center**
- Again, straight-line distance
- Note: The wrist axis is perpendicular, so measure to the wrist rotation center

### Measuring Angles

**Use a protractor or angle finder:**
- Digital angle finder (best option)
- Smartphone app with angle measurement
- Physical protractor

**Reference positions:**
- **Horizontal** = 0° (for shoulder/elbow pitch)
- **Vertical** = 90° (for base rotation)
- **Straight/extended** = 180° (for elbow)

---

## Step-by-Step Measurement Process

### Step 1: Measure Link Lengths
1. ✅ Base height: 61.2mm
2. ✅ Shoulder height: 95mm
3. ✅ Upper arm: 12cm
4. ✅ Lower arm: 9cm
5. ⏳ Wrist offset: _____ mm
6. ⏳ Gripper length: _____ mm
7. ⏳ Gripper width: _____ mm

### Step 2: Measure Joint Limits
1. ⏳ Base: min = _____°, max = _____°
2. ⏳ Shoulder: min = _____°, max = _____°
3. ⏳ Elbow: min = _____°, max = _____°
4. ⏳ Wrist: speed range = -100% to +100% (continuous)
5. ⏳ Gripper Yaw: min = _____°, max = _____°
6. ⏳ Gripper Pitch: min = _____°, max = _____°

### Step 3: Test Home Positions
- Where should each joint be when the arm is "home"?
- Usually: Base=0°, Shoulder=45°, Elbow=90°, Wrist=stopped, Gripper=centered

---

## Common Confusing Parts

### Wrist Joint (Perpendicular to Elbow)

**Understanding the geometry:**
- Elbow rotates in one plane (e.g., vertical plane)
- Wrist rotates in a **perpendicular plane** (e.g., horizontal plane)
- This is like a universal joint

**To measure wrist offset:**
- Find where the wrist servo is mounted on the lower arm
- The wrist servo shaft is the wrist center
- Measure from wrist center to gripper mounting point
- This distance is along the wrist rotation axis

### Gripper Mounting

**Two possibilities:**
1. **Direct mount**: Gripper attaches directly to wrist → offset = 0
2. **Bracket mount**: There's a bracket/adapter between wrist and gripper → measure bracket length

**To find gripper mounting point:**
- Look for where the gripper yaw servo attaches
- That's the gripper mounting point
- Measure from wrist center to that point

---

## Visual Reference

```
                    [Table Surface]
                         |
                    [Base: 61.2mm]
                         |
                    [Shoulder: 95mm total]
                         |
                    [Shoulder Joint] ← rotation center
                         |
                    [Upper Arm: 12cm]
                         |
                    [Elbow Joint] ← rotation center
                         |
                    [Lower Arm: 9cm]
                         |
                    [Wrist Joint] ← rotation center (perpendicular axis)
                         |
                    [Wrist Offset: ?] ← measure this
                         |
                    [Gripper Mount]
                         |
                    [Gripper Yaw] ← rotation
                         |
                    [Gripper Pitch] ← tilt
                         |
                    [Gripper Fingers]
```

---

## What to Report Back

When you have the measurements, provide them in this format:

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

