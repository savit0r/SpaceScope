# SpaceScope — Technical Deep Dive: Raycasting & 3D Pointer Events (Phase 5)

This document explains the mathematical foundations and architectural implementation of 3D object selection, raycasting, synthetic pointer events, and camera focus interpolation in **SpaceScope**.

---

## 1. The 2D DOM vs. 3D WebGL Raycasting Problem

In standard 2D web applications, user interaction relies on the **2D DOM box model**. The browser tracks rectangular bounding boxes and propagates native click/hover events down the DOM tree.

In a 3D WebGL application, the entire 3D universe is rendered onto a single 2D `<canvas>` HTML element. The DOM API only receives a 2D screen coordinate $(x_{\text{pixel}}, y_{\text{pixel}})$. It has no knowledge of depth, 3D spatial positions $(X, Y, Z)$, or polygon geometry inside the WebGL context.

To detect which 3D planet a user hovered or clicked, WebGL engines use **Raycasting**.

---

## 2. The 3D Raycasting Pipeline Explained

Raycasting converts a 2D screen coordinate into a 3D mathematical ray projected through 3D world space.

```
[ 2D Cursor (x, y) ] 
       │
       ▼
[ Normalized Device Coordinates (NDC: -1.0 to +1.0) ]
       │
       ▼
[ Ray Origin (Camera) & Direction Vector (Raycaster) ]
       │
       ▼
[ Polygon Intersection Testing in Scene Graph ]
       │
       ▼
[ Intersected Mesh Object Triggered (R3F Event) ]
```

### Step A: Screen-Space to Normalized Device Coordinates (NDC)
When the user clicks at screen pixel position $(x_{\text{pixel}}, y_{\text{pixel}})$, Three.js converts these pixel coordinates into **Normalized Device Coordinates (NDC)**, ranging from $-1.0$ to $+1.0$ across both axes:

$$\text{NDC}_x = \left(\frac{x_{\text{pixel}}}{\text{viewport width}}\right) \times 2 - 1$$

$$\text{NDC}_y = -\left(\frac{y_{\text{pixel}}}{\text{viewport height}}\right) \times 2 + 1$$

### Step B: Unprojecting Ray Vector from Camera
A 3D mathematical ray vector is constructed:
- **Ray Origin ($\mathbf{O}$):** The camera's current 3D world position $(X_{\text{cam}}, Y_{\text{cam}}, Z_{\text{cam}})$.
- **Ray Direction ($\mathbf{D}$):** The normalized vector unprojected from the camera lens through the NDC point into 3D world space.

$$\mathbf{R}(t) = \mathbf{O} + t \mathbf{D} \quad (t \ge 0)$$

### Step C: Polygon Intersection Testing
Three.js calculates ray-sphere and ray-triangle polygon intersections against meshes in the scene graph. Intersections are sorted by distance $t$, identifying the closest visible 3D object to the viewer.

---

## 3. React Three Fiber (R3F) Synthetic Pointer Events

React Three Fiber (R3F) automates Three.js Raycaster management and maps intersections directly onto React component props:

```tsx
<mesh
  onPointerOver={(e) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  }}
  onPointerOut={() => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  }}
  onClick={(e) => {
    e.stopPropagation();
    selectPlanet(planet);
  }}
>
```

### Why `e.stopPropagation()` is Critical in 3D Scene Graphs
When a 3D ray is projected through space, it can pass through multiple stacked meshes (e.g. atmospheric haze shell, planetary body, ring geometry, background starfield).

Without calling `e.stopPropagation()`, the raycast event bubbles down through every intersected object in depth order. Calling `e.stopPropagation()` halts raycast traversal at the front-most intersected mesh, ensuring only the target planet processes the click or hover action.

---

## 4. Handling Empty Space Clicks (`onPointerMissed`)

To allow users to deselect a planet or reset camera focus by clicking empty space in the universe, SpaceScope utilizes R3F's native `<Canvas onPointerMissed={...}>` handler:

```tsx
<Canvas
  onPointerMissed={() => deselectPlanet()}
>
```

When a user clicks on the 3D canvas without the ray intersection hitting any active mesh, `onPointerMissed` fires, clearing the selected planet state and restoring standard orbital navigation.

---

## 5. Camera Focus Interpolation (`lerp`) & `OrbitControls`

`OrbitControls` manages camera rotation around a central focal point defined by `controls.target` (default origin $[0, 0, 0]$).

When a planet is selected, updating `controls.target` directly to the planet's live 3D world position changes the focal center without breaking OrbitControls:

```typescript
// Smooth linear interpolation (lerp) inside R3F useFrame loop
orbitControls.target.lerp(targetWorldPosition, lerpFactor);
camera.position.lerp(desiredCameraPosition, lerpFactor * 0.8);
orbitControls.update();
```

Using linear interpolation (`lerp`) inside `useFrame` smoothly transitions the camera view to focused planets over several frames, avoiding jarring camera cuts while maintaining full user pan and zoom control.
