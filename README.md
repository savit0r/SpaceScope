# SpaceScope — 3D Solar System Explorer

[![React 19](https://img.shields.io/badge/React-19.2-61dafb.svg?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r186-black.svg?logo=three.js&logoColor=white)](https://threejs.org/)
[![R3F](https://img.shields.io/badge/@react--three/fiber-9.8-black.svg)](https://docs.pmnd.rs/react-three-fiber/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-5.0-729b1b.svg?logo=vitest&logoColor=white)](https://vitest.dev/)
[![GSAP](https://img.shields.io/badge/GSAP-3.15-88ce02.svg?logo=greensock&logoColor=white)](https://greensock.com/gsap/)

> An interactive, cinematic 3D solar system exploration web application and scientific instrument inspired by **NASA Eyes on the Solar System**.  
> Built as an in-depth study into modern frontend engineering, WebGL rendering, 3D mathematical modeling, and advanced glassmorphism design systems.

---

## 🌟 Project Purpose & Motivation

**SpaceScope** was conceived and built as a hands-on exploration of modern frontend technologies. The primary goal was to push the boundaries of what is possible in the browser without relying on heavy external game engines (like Unity or Unreal WebGL exports).

### Core Frontend Challenges Explored:
1. **Bridging Declarative React with Imperative WebGL**: Investigating how to leverage **React 19** and **React Three Fiber (R3F)** to build a complex, multi-object 3D scenegraph while keeping code modular, readable, and maintainable.
2. **High-Performance 60 FPS Animation Architecture**: Solving the fundamental challenge of synchronizing high-frequency WebGL render loops with the React Virtual DOM without causing frame drops or unnecessary component re-renders.
3. **Procedural Graphics & Asset Optimization**: Exploring how to generate rich visual assets (planetary surface textures, ring structures, atmospheric clouds) dynamically via code and the HTML5 Canvas 2D API instead of downloading megabytes of static image textures over the network.
4. **Astronomical & Physics Simulation**: Translating real Keplerian celestial mechanics, orbital inclinations, axial obliquities, and logarithmic scaling models into performant JavaScript/TypeScript calculations.
5. **Modern Glassmorphic UI Engineering**: Developing a mission-control HUD with native CSS `backdrop-filter`, multi-bevel specular edge lighting, and layered shadows that complement the 3D scene rather than obstructing it.

---

## 🚀 How It Works (System Mechanics)

### 1. Dual-Scale Mathematical Engine
Real astronomical distances span billions of kilometers (e.g. Neptune is 4.5 billion km away). In true physical scale, planets are microscopic sub-pixel specks lost in pitch-black void. SpaceScope implements a dual-scale mathematical engine:
- **Visual Scale (Compressed Mode)**: Uses a power-law compression equation:
  $$\text{Distance} = \text{baseOffset} + (\text{Distance}_{\text{km}})^{0.48} \times \text{scaleFactor}$$
  This non-linear curve pulls the distant outer planets inward while spreading the inner planets apart, keeping all 8 planets visible and interactive simultaneously.
- **Real Scale (Astronomical Units Mode)**: Computes exact proportional Astronomical Units ($\text{AU} = \text{km} / 149.59787 \times 10^6$) and maps distances linearly. This allows users to visualize the true, vast voids of our solar system.

### 2. Deterministic Keplerian Timeline & Scrubber
Planetary motion is not driven by arbitrary frame counters. Instead, SpaceScope computes celestial positions deterministically from simulated elapsed days:
$$\omega = \frac{2\pi}{T_{\text{orbit}}}, \quad \theta = \theta_0 + \omega \cdot \text{elapsedDays}$$
- Users can scrub the timeline across years (from Jan 1, 2026 to Dec 31, 2030).
- Users can adjust simulation speed from **$1\times$** up to **$60\times$** real-time simulated days per second.
- Planetary coordinates $[X, 0, Z]$ update instantaneously and deterministically based on elapsed time.

### 3. Dynamic Camera Pathfinding & Inertial Orbit Tracking
When a user selects a revolving planet:
1. **GSAP Pathfinding**: The camera initiates an active pursuit toward the planet's live 3D world coordinates with smooth `power2.inOut` easing. The camera is placed on the tangent vector toward the sunlit hemisphere, ensuring the day-side terminator is dramatically lit.
2. **Live Orbital Frame Riding**: Once arrived, the camera locks onto the revolving planet in real time. As the planet travels along its orbit, the camera calculates position deltas and travels synchronously with it, allowing the user to rotate and zoom around the planet while it hurtles through space.

### 4. GPU-Instanced Asteroid Belt (NASA Eyes on Asteroids)
- Renders **1,800 individual Keplerian asteroids** between Mars ($2.1\text{ AU}$) and Jupiter ($3.3\text{ AU}$) in **one single draw call** using Three.js `InstancedMesh`.
- Asteroids follow Kepler's Third Law ($v \propto a^{-1.5}$), with authentic spectral classifications: Carbonaceous C-type (75%), Silicate S-type (17%), and Metallic M-type (8%).

### 5. Multi-Tier Deep Space Starfield
- A pure black background (`#000000`) populated by **31,200+ multi-spectral stars**:
  - **22,000 Micro-Stars**: Ultra-crisp pinpoint stars.
  - **8,000 Mid-Magnitude Stars**: Multi-spectral color temperatures (White Class A, Pale Blue Class B, Cream-Gold Class G, Amber Class K).
  - **1,200 Prominent Celestial Beacons**: Bright guide stars with soft optical falloff.
- The starfield dynamically anchors to the camera's position, preserving true infinite optical distance.

### 6. Zero-Asset Procedural Planetary Textures
SpaceScope synthesizes all planetary textures programmatically at initialization:
- **Jupiter**: 9 atmospheric belts and zones, mathematical shear turbulence waves, and the Great Red Spot oval storm.
- **Saturn**: Concentric ring bands with the authentic **Cassini Division** dark gap ($0.74 - 0.77$ normalized radius).
- **Mars**: Rust-colored iron-oxide terrain, basaltic albedo markings, and white polar ice caps.
- **Earth**: Deep oceans, continental biomes, and a separate rotating procedural cloud layer.

### 7. Mission-Control Frosted Glassmorphism UI
- Semi-transparent glass panels (`rgba(7, 12, 22, 0.45)`) with high-refraction optical diffusion (`backdrop-filter: blur(28px) saturate(200%)`).
- Multi-bevel specular edge catch (`border-top: rgba(255,255,255,0.42)`, `border-left: rgba(255,255,255,0.24)`).
- Layered elevation shadows and inner cyan photon glow.
- Ambient backdrop overlays kept at $0.35$ opacity so 3D planets and stars remain visible through open modals.

---

## 🛠️ Tech Stack & Architecture

```
                       ┌──────────────────────────────┐
                       │     React 19 UI Contexts     │
                       │ Simulation, Selection, Comp  │
                       └──────────────┬───────────────┘
                                      │
              ┌───────────────────────┴───────────────────────┐
              ▼                                               ▼
   ┌───────────────────────┐                     ┌────────────────────────┐
   │  2D Glassmorphic HUD  │                     │ Three.js WebGL Canvas  │
   │ ControlsOverlay       │                     │ SceneContainer (R3F)   │
   │ PlanetDetailPanel     │                     │ SolarSystem Coordinator│
   │ ComparisonModal       │                     │ CameraController (GSAP)│
   │ Search & Settings     │                     │ Instanced AsteroidBelt │
   └───────────────────────┘                     └────────────────────────┘
              │                                               │
              └───────────────────────┬───────────────────────┘
                                      ▼
                       ┌──────────────────────────────┐
                       │  Mathematical Utility Layer  │
                       │ astronomy.ts, timeline.ts,   │
                       │ textures.ts, animation.ts    │
                       └──────────────────────────────┘
```

| Layer | Technologies |
| :--- | :--- |
| **UI Framework** | React 19, TypeScript |
| **3D Rendering** | Three.js, @react-three/fiber, @react-three/drei |
| **Camera & Motion** | GSAP (GreenSock Animation Platform) |
| **Icons & Design** | Lucide React, Space Grotesk & Outfit Typography, Vanilla CSS Glassmorphism |
| **Build & Tests** | Vite 8, Vitest (31 unit tests passing at 100%), Oxlint |

---

## 📂 Project Directory Structure

```
SpaceScope/
├── index.html                    # Root HTML5 entry point & font loading
├── vite.config.ts                # Vite 8 build & HMR configuration
├── tsconfig.json                 # Strict TypeScript configuration
├── package.json                  # Project scripts & dependencies
├── PROJECT_DOCUMENTATION.md      # In-depth architectural & interview guide
├── src/
│   ├── main.tsx                  # React 19 DOM entry mount
│   ├── App.tsx                   # Top-level composition & context providers
│   ├── index.css                 # Master glassmorphism design system
│   │
│   ├── types/                    # Domain definitions & interfaces
│   │   ├── planet.ts             # CelestialBody, VisualProperties, Missions
│   │   ├── simulation.ts         # SimulationState, ScaleMode, QualityMode
│   │   └── comparison.ts         # ComparisonState
│   │
│   ├── data/                     # Authoritative astronomical datasets
│   │   ├── planets.ts            # Physical parameters for Sun, 8 planets, Pluto, asteroids
│   │   └── planets.test.ts       # Data invariant integrity tests
│   │
│   ├── context/                  # React Context providers (State Management)
│   │   ├── SimulationContext.tsx # Master clock, speed, scale mode, throttled refs
│   │   ├── SelectionContext.tsx  # Selected body, camera target & focus tracking
│   │   └── ComparisonContext.tsx # Side-by-side comparative inspection state
│   │
│   ├── utils/                    # Core mathematical engines
│   │   ├── astronomy.ts          # Radius & distance scaling equations, formatters
│   │   ├── astronomy.test.ts     # Astronomy math unit tests
│   │   ├── timeline.ts           # Keplerian mean anomaly propagation & date conversions
│   │   ├── timeline.test.ts      # Timeline math unit tests
│   │   ├── animation.ts          # Angular velocity & rotational speed equations
│   │   ├── animation.test.ts     # Animation physics unit tests
│   │   └── textures.ts           # Zero-asset procedural Canvas texture synthesizer
│   │
│   ├── components/
│   │   ├── scene/                # WebGL 3D Components (R3F)
│   │   │   ├── SceneContainer.tsx    # Canvas shell, ACES tone mapping, OrbitControls
│   │   │   ├── SolarSystem.tsx       # Master 3D coordinator & frame loop
│   │   │   ├── Sun.tsx               # PointLight source, emissive core, Fresnel corona
│   │   │   ├── Planet.tsx            # Planet mesh, axial tilt, rings, clouds, 3D HUD pin
│   │   │   ├── CameraController.tsx  # Dynamic GSAP pursuit & live orbit tracking
│   │   │   ├── AsteroidBelt.tsx      # 1,800-body Keplerian InstancedMesh belt
│   │   │   ├── Starfield.tsx         # 31,200 multi-spectral particle starfield
│   │   │   ├── OrbitPath.tsx         # 192-point Keplerian line loop with inclination
│   │   │   └── Lighting.tsx          # Standalone lighting harness
│   │   │
│   │   └── ui/                   # Mission-Control HUD & Glass Modals
│   │       ├── ControlsOverlay.tsx      # Header bar, timeline scrubber, playback tray
│   │       ├── PlanetDetailPanel.tsx    # Museum placard with progressive disclosure tabs
│   │       ├── PlanetComparisonModal.tsx# Side-by-side comparative analysis modal
│   │       ├── SearchModal.tsx          # Aerospace search & teleportation navigation
│   │       └── SettingsModal.tsx        # Instrument settings & scale toggles
```

---

## 💻 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/SpaceScope.git

# Navigate into the project directory
cd SpaceScope

# Install dependencies
npm install
```

### Running Locally
```bash
# Start development server with instant HMR
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### Running Unit Tests
```bash
# Run Vitest test suite
npm run test
```
All 31 unit tests validate data model integrity, scaling equations, orbital angular velocities, and timeline conversions.

### Building for Production
```bash
# Type check and build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🎮 Navigation & Controls

| Action | Control | Description |
| :--- | :--- | :--- |
| **Orbit Camera** | Left-Click + Drag | Freely orbit around the current camera target |
| **Pan Camera** | Right-Click + Drag | Pan spatial vantage point across the plane |
| **Zoom View** | Scroll Wheel / Pinch | Zoom in toward planets or out to full system |
| **Select Planet** | Left-Click on Planet / Pin | Targets body, smoothly transitions camera, and tracks orbit |
| **Deselect** | Click Empty Space / Close Button | Returns camera to broad solar system overview |
| **Search** | Click Search / Press `/` | Quick-jump search by planet name, mission, or space agency |
| **Dismiss Modals** | `Escape` Key | Instantly dismisses any open modal or panel |

---

## 📖 In-Depth Technical Documentation

For an exhaustive technical breakdown—including mathematical derivations, function-by-function API specifications, and interview talking points—see:
- **[PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md)**

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
