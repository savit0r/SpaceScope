# SpaceScope — Technical Deep Dive: Camera Transitions & Easing (Phase 6)

This document explains the technical concepts behind 3D camera motion, interpolation, non-linear easing, `lookAt` spatial targeting, GSAP timelines, and memory leak prevention in **SpaceScope**.

---

## 1. Interpolation

**Interpolation** is the mathematical process of calculating intermediate values between a starting value $A$ and an ending value $B$ over a normalized progress parameter $t \in [0.0, 1.0]$.

### Linear Interpolation (`lerp`) Formula
In 3D spatial vector space, Linear Interpolation calculates intermediate position $\mathbf{P}(t)$ using:

$$\mathbf{P}(t) = (1 - t) \mathbf{A} + t \mathbf{B} = \mathbf{A} + t(\mathbf{B} - \mathbf{A})$$

- When $t = 0.0$, $\mathbf{P}(0) = \mathbf{A}$ (starting camera position).
- When $t = 1.0$, $\mathbf{P}(1) = \mathbf{B}$ (target planet focus position).

In 3D WebGL camera navigation, linear interpolation produces constant velocity motion. While functional, pure linear interpolation can feel robotic and abrupt at start and end points.

---

## 2. Easing Curves

**Easing** applies a non-linear rate of change to the progress parameter $t$, simulating physical acceleration and deceleration.

Instead of advancing $t$ at a constant rate, easing functions pass $t$ through mathematical power curves $E(t)$:

```
Linear (Constant Rate)           Ease-In-Out (Smooth Start & Stop)
     Progress ↑                      Progress ↑
     1.0 ┼     /                     1.0 ┼       /
         │    /                          │      /
         │   /                           │    _╱
     0.0 ┼──/────► Time              0.0 ┼──╱────► Time
```

### Common Easing Profiles in GSAP
1. **`power2.inOut` (Cubic Easing):** Acceleration at the start, linear motion during the middle phase, and smooth deceleration to a rest.
2. **`power3.out` (Exponential Deceleration):** Rapid initial speed when selecting a planet, smoothly gliding into focus.

SpaceScope uses `power2.inOut` for camera focus transitions because it mimics physical camera crane movements, eliminating jarring starts and stops.

---

## 3. Camera Position

In Three.js, a `PerspectiveCamera` is defined by its 3D spatial coordinate $(X, Y, Z)$ in world space:

- **$X$-axis:** Horizontal lateral translation (left/right).
- **$Y$-axis:** Vertical elevation translation (up/down).
- **$Z$-axis:** Depth distance along the viewing frustum (near/far).

When focusing on a selected planet, calculating the desired camera position requires placing the camera at a comfortable offset relative to the planet's center:

$$\mathbf{P}_{\text{cam}} = \mathbf{P}_{\text{planet}} + \mathbf{V}_{\text{offset}}$$

Where $\mathbf{V}_{\text{offset}} = (0, \text{offset}_y, \text{offset}_z)$ ensures the planet is centered in view without clipping through geometry.

---

## 4. `lookAt` Vector & OrbitControls Target

The `camera.lookAt(vector)` method re-orients the 3D orientation matrix of the camera so that its optical axis points directly at a specific 3D coordinate vector $(X_{\text{target}}, Y_{\text{target}}, Z_{\text{target}})$.

When using `@react-three/drei` `<OrbitControls>`, manual calls to `camera.lookAt()` get overridden by OrbitControls on every frame loop.

To properly focus the camera using OrbitControls:
1. **Animate `orbitControls.target`:** The focal center point around which OrbitControls rotates is updated to the planet's world coordinates.
2. **Call `orbitControls.update()`:** Synchronizes the internal camera transformation matrix with the new target.

---

## 5. GSAP Timelines & Interruption Safety

**GSAP (GreenSock Animation Platform) Timelines** allow orchestrating synchronized multi-property tweens over time with precise control callbacks.

### Why GSAP Timelines Are Used for Camera Transitions:
1. **Synchronized Dual-Vector Interpolation:** A single timeline simultaneously animates both `camera.position` and `orbitControls.target` using identical duration and easing curves.
2. **Interruption Safety:** If a user selects a new planet while a transition is running, or rotates the mouse manually, `timeline.kill()` immediately cancels the running tween, preventing competing animations or camera jumps.
3. **Memory Leak Prevention:** In React components, unmounting or dependency updates can leave orphaned animation timers running in the background. Returning `timeline.kill()` inside `useEffect` cleanup guarantees zero memory leaks.

```typescript
useEffect(() => {
  // Kill existing timeline before starting a new transition
  if (timelineRef.current) {
    timelineRef.current.kill();
    timelineRef.current = null;
  }

  const tl = gsap.timeline({
    onUpdate: () => orbitControls.update()
  });

  tl.to(orbitControls.target, { x, y, z, duration: 1.4, ease: 'power2.inOut' }, 0);
  tl.to(camera.position, { x: camX, y: camY, z: camZ, duration: 1.4, ease: 'power2.inOut' }, 0);

  timelineRef.current = tl;

  return () => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
  };
}, [selectedPlanet, isCameraFocused]);
```
