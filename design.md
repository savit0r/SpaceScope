# SpaceScope — Visual & UX Design Direction

> **Role:** Senior Product Designer + Frontend Engineer  
> **Goal:** Remove the "vibecoded" feeling from SpaceScope and make the experience feel like a polished space-science product rather than a generic Three.js demo.

---

## 1. Design North Star

SpaceScope should feel like:

**"A cinematic scientific instrument for exploring the solar system."**

Not:

- a gaming dashboard
- a generic SaaS dashboard with a space background
- a collection of glowing cards
- a portfolio Three.js demo
- a UI where every element has a neon border

The visual hierarchy should be:

**Space → Planet → Information → Controls**

The 3D scene is the hero. The UI should support it, not compete with it.

### Core principles

1. **Cinematic, not flashy**
2. **Scientific, not sterile**
3. **Minimal, not empty**
4. **Realistic, not hyper-stylized**
5. **Interactive, but discoverable**
6. **Depth comes from lighting and atmosphere, not excessive gradients**
7. **Every visual effect must have a purpose**

---

# 2. Reference Products

Study these products for interaction and visual direction:

### NASA Eyes

NASA's Eyes is the strongest reference for SpaceScope's overall interaction model. It combines real-time 3D environments, planetary exploration, spacecraft and information panels without turning the experience into a conventional dashboard.

- NASA Eyes: https://science.nasa.gov/eyes/
- NASA Eyes on the Solar System: https://eyes.nasa.gov/apps/solar-system/

**Borrow:**
- cinematic 3D environment
- contextual information panels
- object-focused exploration
- scientific hierarchy
- camera/follow modes
- time controls

**Do NOT copy:**
- legacy UI styling
- dense desktop controls
- exact visual layout

---

### Cosmoscope

https://cosmoscope.space/

Cosmoscope is an excellent reference for a modern browser-native 3D universe. It emphasizes scale, real positions, continuous exploration and minimal visual interference.

**Borrow:**
- dark cinematic canvas
- huge sense of scale
- minimal overlays
- object-focused interaction
- smooth camera movement
- visual storytelling

---

### Wanderstar

https://wanderstar.space/about/

Wanderstar is useful for studying a modern React + React Three Fiber solar-system experience.

**Borrow:**
- real orbital relationships
- clear exploration model
- camera following
- scientific accuracy as a product feature
- separation between "real scale" and "visible scale"

---

### splatlas

https://splatlas.space/

Useful reference for realistic planetary rendering.

**Borrow:**
- real NASA/USGS imagery
- planetary surface detail
- live sun lighting
- day/night terminator
- realistic planetary presentation

---

### Aphelion

https://aphelion.website/

Useful reference for combining cinematic exploration with educational content.

**Borrow:**
- cinematic planet presentation
- destination-based exploration
- progressive disclosure of information
- restrained UI

---

### COSMOS 3D concept

https://dribbble.com/shots/27402254-COSMOS-3D-Interactive-Solar-System-Explorer-WebGL-Three-js

Useful as a **visual design reference**, not a scientific reference.

**Borrow:**
- editorial typography
- dark cinematic composition
- planet-specific accent colors
- minimal interface

---

# 3. The Biggest Problem: "Vibecoded UI"

If SpaceScope currently contains things like:

```text
┌─────────────────────────────────────────┐
│ 🌌 SPACESCOPE                           │
│                                         │
│  [ Explore ] [ Planets ] [ About ]      │
│                                         │
│     glowing planet                      │
│                                         │
│  ┌──────────────┐  ┌──────────────┐     │
│  │ Card         │  │ Card         │     │
│  └──────────────┘  └──────────────┘     │
│                                         │
│       ✨ ✨ ✨ ✨                         │
└─────────────────────────────────────────┘
```

remove this pattern.

### Avoid

- excessive glassmorphism
- every card having `backdrop-filter`
- neon borders
- purple/blue gradients everywhere
- huge rounded cards
- excessive shadows
- emoji as UI icons
- glowing text
- floating cards covering the planet
- random decorative particles
- multiple competing accent colors
- "AI startup" style landing-page sections
- generic `Inter + gradient + glass` styling

The interface should feel closer to a **mission-control instrument** than a landing page.

---

# 4. Visual Language

## Background

Use almost-black space rather than pure black.

Recommended base:

```css
--space-950: #030509;
--space-900: #070A10;
--space-850: #0B0F17;
```

The background should have extremely subtle variation.

### Background layers

Layer 1:
- near-black base

Layer 2:
- sparse stars

Layer 3:
- extremely subtle distant nebula/cloud texture

Layer 4:
- optional atmospheric light from nearby objects

Do not put a huge purple/blue nebula behind everything.

---

# 5. Color System

Use mostly neutral UI colors.

```css
--text-primary: rgba(255,255,255,.92);
--text-secondary: rgba(255,255,255,.62);
--text-muted: rgba(255,255,255,.38);

--border-subtle: rgba(255,255,255,.10);
--surface: rgba(10,14,21,.72);
--surface-solid: #0A0E15;

--accent: #8FD8FF;
```

### Planet colors

Planet colors should come from the selected planet.

Example:

```js
const planetAccent = {
  mercury: '#B7A58A',
  venus: '#D8B477',
  earth: '#55B9E8',
  mars: '#D76A4A',
  jupiter: '#D9A66A',
  saturn: '#D9C38A',
  uranus: '#78C9CE',
  neptune: '#5A79D8'
}
```

Important:

**The planet's accent should not recolor the entire UI.**

Use it subtly for:

- selected state
- small indicators
- data visualization
- progress/range controls
- tiny glow around the selected object

---

# 6. Typography

The typography should feel scientific/editorial.

### Recommended

**Display / headings:**
- Space Grotesk
- Geist
- IBM Plex Sans

**Optional editorial accent:**
- Cormorant Garamond
- Instrument Serif

Do not use an elaborate sci-fi font for the entire interface.

### Hierarchy

Planet name:

```text
MARS
```

Large, restrained, uppercase.

Secondary:

```text
THE RED PLANET
```

Small uppercase tracking.

Data:

```text
3.39 × 10³ km
```

Body:

```text
Mars is the fourth planet from the Sun...
```

### Typography rules

- Headings: 400–600
- Body: 400
- Labels: 500–600
- Avoid ultra-bold text everywhere
- Use whitespace instead of font weight to create hierarchy

---

# 7. Layout Architecture

The primary experience should be **scene-first**.

Recommended structure:

```text
┌─────────────────────────────────────────────────────┐
│ SPACESCOPE                         SEARCH / SETTINGS │
│                                                     │
│                                                     │
│                    3D SCENE                         │
│                                                     │
│                                                     │
│                                                     │
│                                                     │
│  ← SOLAR SYSTEM                         PLANET INFO │
│                                                     │
│                 ───── timeline ─────                │
└─────────────────────────────────────────────────────┘
```

The canvas should occupy approximately:

**90–100% of the viewport.**

UI should float above the scene only when necessary.

---

# 8. Navigation

Keep navigation extremely small.

Top-left:

```text
SPACESCOPE
Solar System Explorer
```

Top-right:

```text
Search
Settings
Help
```

Do not build a large navbar.

### Navigation behavior

On desktop:

- top-left branding
- top-right utility controls
- bottom controls
- contextual planet panel

On mobile:

- logo
- search/menu
- bottom sheet for planet information

---

# 9. Planet Information Panel

The planet information panel is one of the most important components.

Avoid:

```text
┌─────────────────────┐
│ MARS                │
│                     │
│ Temperature         │
│  -63°C              │
│                     │
│ Distance             │
│  227M km             │
│                     │
│ [Explore]            │
└─────────────────────┘
```

This looks like a SaaS dashboard.

Instead:

```text
                         MARS
                    THE RED PLANET

                 [large planet scene]

  4TH PLANET FROM THE SUN

  227.9M km          24.6h          2
  DISTANCE           DAY            MOONS

  ───────────────────────────────────

  Mars is a cold desert world...

  [ EXPLORE SURFACE ]
```

The panel should feel like a **museum placard / mission briefing**, not a dashboard card.

---

# 10. Glassmorphism Rules

Glass can be used, but very carefully.

### Good

```css
background: rgba(7, 10, 16, 0.68);
backdrop-filter: blur(18px);
border: 1px solid rgba(255,255,255,0.08);
```

### Bad

```css
background: linear-gradient(...);
border: 2px solid #8b5cf6;
box-shadow: 0 0 50px #8b5cf6;
```

### Rule

If everything is glass, **nothing feels important**.

Use glass only for:

- temporary information panels
- floating controls
- search
- settings
- contextual navigation

---

# 11. Making the Planets Actually Realistic

This is more important than adding more UI.

A realistic planet is not simply:

```text
Sphere + texture
```

It needs:

```text
Geometry
+
High-quality texture
+
Correct roughness
+
Lighting
+
Atmosphere
+
Normal/displacement detail
+
Shadow
+
Correct camera
+
Correct rotation
```

---

# 12. Planet Rendering Architecture

Recommended Three.js / React Three Fiber structure:

```text
Planet
├── Surface Mesh
│   ├── Color Map
│   ├── Normal Map
│   ├── Roughness Map
│   └── Displacement/Bump
│
├── Atmosphere
│   ├── Fresnel glow
│   └── scattering effect
│
├── Night Side
│   └── optional emissive map
│
└── Clouds (Earth)
    └── transparent rotating layer
```

Do not use one generic material for every planet.

---

# 13. Planet Material Rules

## Mercury

Needs:

- gray/brown rocky surface
- visible craters
- high roughness
- very little atmosphere
- strong terminator

Avoid:

- shiny gray sphere

---

## Venus

Needs:

- dense yellow/cream cloud layer
- extremely soft surface visibility
- atmospheric haze
- slow cloud movement

Avoid:

- orange solid ball

---

## Earth

Earth should receive the most rendering effort.

Use:

```text
Earth
├── Surface
├── Clouds
├── Atmosphere
├── Night Lights
└── Optional City/Cloud detail
```

Lighting should clearly show:

**day side → terminator → night side**

Night lights should only appear on the dark side.

---

## Mars

Needs:

- rusty orange/red surface
- darker regions
- visible terrain variation
- subtle atmosphere
- polar caps if texture supports them

Avoid:

- flat red material

---

## Jupiter

Jupiter needs:

- horizontal atmospheric bands
- different roughness/value variation
- Great Red Spot
- subtle cloud movement
- soft edge lighting

Most importantly:

**Do not treat Jupiter like a textured rocky sphere.**

It is a gas giant.

---

## Saturn

Saturn needs:

- banded atmosphere
- subtle surface detail
- realistic rings
- ring shadow on planet
- planet shadow on rings

The ring system should have:

- transparency
- alpha texture
- multiple ring bands
- subtle color differences

The ring shadow is one of the details that makes Saturn immediately feel more realistic.

---

## Uranus / Neptune

Use:

- smooth atmospheric gradients
- subtle cloud bands
- low-frequency noise
- very soft atmospheric rim

Avoid excessive texture detail.

---

# 14. Lighting

This is likely the biggest improvement you can make.

Do not use:

```js
ambientLight
directionalLight
```

and stop there.

The Sun should be the primary light source.

Conceptually:

```text
SUN
  ↓
PointLight / directional solar lighting
  ↓
Planet
  ↓
Atmospheric scattering
  ↓
Night side
```

### Desired result

The viewer should immediately see:

```text
LIGHT
██████████████░░░░░░
              ↑
          terminator
```

The terminator is critical.

It gives the planet depth.

---

# 15. Planet Rim Lighting

Use subtle Fresnel-based rim lighting.

Conceptually:

```glsl
float fresnel =
    pow(1.0 - dot(normal, viewDirection), 3.0);
```

Use this to create a very subtle atmospheric edge.

Do not create a giant neon outline.

Bad:

```text
      🔵🔵🔵
   🔵 PLANET 🔵
      🔵🔵🔵
```

Good:

```text
          subtle atmospheric rim
                 ╭────╮
              ╭──      ──╮
             │   PLANET   │
              ╰──      ──╯
                 ╰────╯
```

---

# 16. Camera

The camera should feel like a spacecraft camera.

### Default

- slight perspective
- planet occupies 35–55% of viewport
- enough empty space around it
- slow movement

### On planet selection

Use a cinematic transition:

```text
Current View
     ↓
0.2s ease-in
     ↓
camera begins moving
     ↓
1.0–1.5s smooth travel
     ↓
planet settles
     ↓
UI panel appears
```

Do not instantly teleport the camera.

---

# 17. Planet Rotation

Planet rotation should be extremely slow.

Do NOT rotate planets like:

```js
rotation.y += 0.01
```

because it looks like a product demo.

Use time-based astronomical rotation where possible.

Example concept:

```js
rotation.y += delta * rotationSpeed;
```

with planet-specific rotation speeds.

The user should barely notice the movement.

---

# 18. Orbit Lines

Orbit lines should be subtle.

Bad:

```text
━━━━━━ bright glowing orbit ━━━━━━
```

Good:

```text
· · · · · · · · · · · · · · · ·
```

Use:

- low opacity
- thin lines
- selected planet = slightly brighter
- inactive planets = barely visible

Orbit lines are supporting information, not decoration.

---

# 19. Stars

Avoid a giant particle field.

Real space is mostly empty.

Use:

- several thousand small stars
- varied brightness
- varied size
- extremely low opacity
- a few brighter stars

Avoid:

- rainbow stars
- huge glowing dots
- dense "galaxy wallpaper"

---

# 20. Nebula

Use nebula extremely sparingly.

A subtle nebula can establish depth, but should never compete with the planet.

Recommended:

```text
opacity: 0.05–0.15
blur: high
saturation: low
```

Think:

**background atmosphere**, not wallpaper.

---

# 21. Interaction Model

Every interaction should have a clear visual response.

### Hover planet

```text
planet
   ↓
subtle brightness increase
+
small label
+
tiny reticle
```

Example:

```text
              ◉
           MARS
        225M km
```

Do not display a giant tooltip.

---

### Click planet

1. Camera moves toward planet
2. Planet becomes selected
3. Information panel appears
4. Planet accent activates
5. Orbit remains visible
6. Other objects become slightly less prominent

---

# 22. Selection State

Selected planet:

```css
opacity: 1;
```

Other planets:

```css
opacity: 0.55;
```

But don't actually fade the entire solar system aggressively.

The scene should remain understandable.

---

# 23. Controls

Keep controls at the bottom.

Example:

```text
        −                         +
       zoom                     zoom

             ◀  2026  ▶

      ━━━━━━━━━━━━━━━━━━━━━
        REAL TIME / PAUSE
```

Possible controls:

- Play / pause
- time speed
- reset view
- camera mode
- orbit visibility
- labels
- scale mode

Advanced controls should live behind a settings panel.

---

# 24. "Real Scale" vs "Visual Scale"

A real solar system is impossible to display intuitively because the distances are enormous.

Therefore provide:

```text
SCALE

● REAL
○ VISUAL
```

### REAL

Use scientifically meaningful relative positions.

### VISUAL

Compress distances so the user can actually see the planets.

Always label the mode.

This is a better product decision than pretending a compressed solar system is physically accurate.

---

# 25. Loading Experience

Do not show:

```text
Loading...
██████████
```

Instead:

```text
SPACESCOPE

INITIALIZING SOLAR SYSTEM

Loading planetary textures
Loading orbital data
Calibrating camera

      87%
```

Keep it quiet and cinematic.

---

# 26. Microinteractions

Use animation only when it communicates something.

Good:

- camera transitions
- planet selection
- panel reveal
- hover response
- timeline movement
- loading transitions

Avoid:

- bouncing buttons
- random floating elements
- excessive particle animations
- spinning icons
- constant UI movement

---

# 27. Motion System

Use consistent timing.

```css
--duration-fast: 160ms;
--duration-normal: 280ms;
--duration-slow: 600ms;
--duration-camera: 1200ms;
```

Recommended easing:

```css
cubic-bezier(0.22, 1, 0.36, 1)
```

Camera movement should feel smooth and heavy.

UI should feel quick.

---

# 28. Responsive Design

## Desktop

Prioritize:

**3D scene > information panel > controls**

Panel width:

```text
320–420px
```

Do not cover more than approximately 30% of the viewport.

---

## Tablet

Panel becomes narrower.

Controls become more compact.

---

## Mobile

Do not try to replicate the desktop interface.

Use:

```text
┌─────────────────────┐
│ SPACESCOPE      ☰   │
│                     │
│                     │
│       PLANET        │
│                     │
│                     │
│                     │
├─────────────────────┤
│ MARS                │
│ THE RED PLANET      │
│                     │
│ 227M km     24.6h   │
│                     │
│ EXPLORE             │
└─────────────────────┘
```

Use a bottom sheet.

---

# 29. Information Architecture

Do not show every fact immediately.

Use progressive disclosure.

### Level 1

```text
MARS
THE RED PLANET

227.9M km
24.6h day
2 moons
```

### Level 2

```text
Overview
Atmosphere
Composition
Orbit
Missions
Moons
```

### Level 3

Detailed scientific data.

This keeps the initial experience clean.

---

# 30. Search

Search should feel like a spacecraft navigation system.

Placeholder:

```text
Search planets, moons, missions...
```

Results:

```text
PLANETS

Mars
Jupiter
Saturn

MOONS

Europa
Titan
Ganymede

MISSIONS

Juno
Cassini
Voyager 1
```

Do not use generic dropdown styling.

---

# 31. Data Visualization

For planetary statistics, avoid giant cards.

Instead use compact data rows:

```text
RADIUS                  3,389.5 km
MASS                    6.39 × 10²³ kg
DAY                     24h 37m
YEAR                    687 days
MOONS                   2
```

Use alignment and typography rather than boxes.

---

# 32. UI Component Rules

Every component should answer:

> "Why does this exist?"

### Buttons

Primary:

```text
EXPLORE
```

Secondary:

```text
LEARN MORE
```

Tertiary:

```text
VIEW DATA
```

Avoid:

```text
✨ Explore the Universe 🚀
```

The product should feel mature.

---

# 33. Iconography

Use one icon system consistently.

Recommended:

- Lucide
- Phosphor

Do not mix:

- emoji
- Font Awesome
- random SVGs
- AI-generated icons

Use icons only where they improve recognition.

---

# 34. Accessibility

Minimum requirements:

- keyboard navigation
- visible focus states
- reduced-motion mode
- readable contrast
- buttons with accessible labels
- touch targets ≥ 44px
- don't communicate state through color alone

For reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

The 3D experience should also offer reduced animation.

---

# 35. Performance Rules

Realistic 3D can become expensive.

Do not sacrifice performance for visual tricks.

### Recommended

- compressed textures
- KTX2/Basis textures
- mipmaps
- lazy-load planet assets
- dispose unused textures
- lower resolution on mobile
- instanced stars
- limit post-processing
- use LOD where useful

### Quality levels

```text
AUTO
HIGH
MEDIUM
LOW
```

Auto should consider:

- device
- screen resolution
- GPU capability
- FPS

---

# 36. Texture Strategy

If the goal is realism, prioritize texture quality over UI decoration.

Suggested texture stack:

```text
albedo/color
normal/bump
roughness
specular (where appropriate)
cloud
night lights
height/displacement
```

Do not use giant 8K textures for every planet.

Use appropriate resolutions and compressed GPU formats.

---

# 37. Post Processing

Use restraint.

Potential effects:

- subtle bloom
- subtle tone mapping
- subtle ambient occlusion
- subtle atmospheric scattering

Avoid:

- heavy bloom
- chromatic aberration
- film grain everywhere
- excessive vignette
- lens flare over every light source

A planet should look realistic before post-processing.

---

# 38. Realism Priority Order

When improving a planet, work in this exact order:

### 1. Lighting

If lighting is wrong, everything looks fake.

### 2. Texture

Use high-quality scientific imagery.

### 3. Material

Correct roughness/specularity.

### 4. Geometry

Enough subdivisions and detail.

### 5. Atmosphere

Especially Earth, Venus, Mars, Uranus and Neptune.

### 6. Shadows

Planet/ring/cloud shadows.

### 7. Motion

Correct rotation/orbit behavior.

### 8. Post-processing

Only after the above are correct.

---

# 39. What NOT To Do

Do not ask an AI coding agent:

> "Make the website more futuristic and beautiful."

That usually produces:

- more gradients
- more glass
- more shadows
- more cards
- more animations
- more glowing borders

Instead provide precise design constraints.

### Good prompt

```text
Redesign the planet information panel.

Constraints:
- No gradient background
- No neon borders
- No excessive glassmorphism
- Maximum 1 border
- 320–400px width
- Use neutral black surface
- Planet accent only for small interactive states
- Editorial typography
- Information should feel like a scientific mission briefing
- Preserve the 3D canvas as the visual hero
- Add animation only for panel entry
```

---

# 40. Recommended Design Tokens

```css
:root {
  --space-950: #030509;
  --space-900: #070A10;
  --space-850: #0B0F17;

  --text-primary: rgba(255,255,255,.92);
  --text-secondary: rgba(255,255,255,.62);
  --text-muted: rgba(255,255,255,.38);

  --line: rgba(255,255,255,.10);
  --line-strong: rgba(255,255,255,.18);

  --surface: rgba(8,12,18,.72);

  --accent: #8FD8FF;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;

  --duration-fast: 160ms;
  --duration-normal: 280ms;
  --duration-slow: 600ms;
  --duration-camera: 1200ms;
}
```

Keep the design system small.

---

# 41. Suggested Page Structure

## Home / Solar System

```text
┌──────────────────────────────────────────────┐
│ SPACESCOPE                  SEARCH   SETTINGS│
│                                              │
│                                              │
│                SOLAR SYSTEM                  │
│                                              │
│        ☉   ○    ○      ○                    │
│                                              │
│                                              │
│                                              │
│                         ┌───────────────┐    │
│                         │ EARTH         │    │
│                         │ THE BLUE      │    │
│                         │ PLANET        │    │
│                         │               │    │
│                         │ 1 AU          │    │
│                         │ 24h           │    │
│                         └───────────────┘    │
│                                              │
│     ◀       ━━━━━ TIME ━━━━━       ▶        │
└──────────────────────────────────────────────┘
```

---

# 42. Planet Detail Experience

When selecting Mars:

```text
        camera moves
             ↓

       [ MARS ]

   THE RED PLANET

────────────────────────────

DISTANCE       227.9M KM
DAY            24H 37M
YEAR           687 DAYS
MOONS          2

────────────────────────────

A cold desert world shaped by
ancient geological processes...

[ EXPLORE MARS ]
```

The scene remains visible behind/next to the information.

---

# 43. Visual Hierarchy Test

Take a screenshot of SpaceScope and squint.

You should immediately see:

```text
1. Planet / 3D scene
2. Selected object
3. Planet name
4. Key information
5. Controls
6. Everything else
```

If you see:

```text
1. Navbar
2. Cards
3. Buttons
4. Glow
5. Text
6. Planet
```

the design is backwards.

---

# 44. Before / After Goal

### Current "vibecoded" direction

```text
Dark background
+ gradients
+ glass cards
+ neon
+ random stars
+ generic 3D sphere
+ lots of UI
= AI-generated space website
```

### Target SpaceScope

```text
Scientific data
+ cinematic lighting
+ realistic planetary materials
+ restrained typography
+ sparse UI
+ purposeful motion
+ accurate interaction
= premium space exploration product
```

---

# 45. Implementation Roadmap

Do NOT redesign everything simultaneously.

## Phase 1 — Remove visual noise

- remove unnecessary cards
- remove excessive gradients
- remove neon borders
- simplify navbar
- simplify controls
- reduce decorative particles

**Goal:** clean composition.

---

## Phase 2 — Fix planet rendering

Start with **Earth**.

Implement:

1. realistic texture
2. directional/solar lighting
3. normal map
4. atmosphere
5. cloud layer
6. night lights
7. day/night terminator
8. realistic rotation

Then create the material architecture for other planets.

---

## Phase 3 — Rebuild information panel

Create one excellent reusable component:

```text
PlanetInfoPanel
```

with:

- planet identity
- key stats
- description
- actions
- responsive bottom-sheet behavior

---

## Phase 4 — Camera system

Implement:

```text
select planet
→ calculate target position
→ interpolate camera
→ orient toward planet
→ settle
→ reveal information
```

---

## Phase 5 — Motion polish

Add:

- hover
- selection
- camera transitions
- panel transitions
- timeline
- subtle planetary rotation

No decorative animation yet.

---

## Phase 6 — Performance

Measure:

- FPS
- texture memory
- draw calls
- load time
- mobile performance

Then add quality scaling.

---

# 46. Definition of Done

SpaceScope is visually successful when:

### Visual

- [ ] Planet looks believable before post-processing
- [ ] Lighting creates a convincing day/night boundary
- [ ] Atmosphere is subtle
- [ ] Textures contain real surface detail
- [ ] UI does not dominate the scene
- [ ] No unnecessary neon
- [ ] No excessive glassmorphism
- [ ] Typography feels intentional
- [ ] Space background feels deep but restrained

### UX

- [ ] User immediately understands what can be clicked
- [ ] Selecting a planet feels cinematic
- [ ] Information appears progressively
- [ ] Controls don't obscure the scene
- [ ] Search is fast and obvious
- [ ] Mobile experience is intentionally designed

### Engineering

- [ ] Planet materials are reusable
- [ ] Assets are lazy-loaded
- [ ] textures are compressed
- [ ] rendering quality adapts to device
- [ ] animation respects reduced-motion preferences
- [ ] unused WebGL resources are disposed

---

# 47. Final Design Philosophy

The most important rule for SpaceScope:

> **Do less, but make every detail believable.**

Do not try to impress the user with 30 effects.

Make them stop and think:

> "Wait... this actually looks like a planet."

The realism should come from:

**lighting + material + texture + scale + motion + restraint.**

The premium feeling should come from:

**typography + spacing + composition + interaction.**

And the product should feel like:

> **A window into the solar system — not a website placed on top of a 3D scene.**

---

# 48. Reference Links

- NASA Eyes: https://science.nasa.gov/eyes/
- NASA Solar System Explorer: https://eyes.nasa.gov/apps/solar-system/
- NASA Planetary Science Resources: https://science.nasa.gov/planetary-science/resources/
- Cosmoscope: https://cosmoscope.space/
- Wanderstar: https://wanderstar.space/about/
- splatlas: https://splatlas.space/
- Aphelion: https://aphelion.website/
- 3D Solar System: https://www.3dsolarsystem.net/
- COSMOS 3D visual reference: https://dribbble.com/shots/27402254-COSMOS-3D-Interactive-Solar-System-Explorer-WebGL-Three-js

---

## Design Review Checklist

Before accepting any future UI change, ask:

1. Does this make the space experience clearer?
2. Does this make the planet feel more realistic?
3. Is this interaction necessary?
4. Is the UI competing with the 3D scene?
5. Would removing this element make the interface better?
6. Does the animation communicate something?
7. Does this look like a scientific product or an AI-generated landing page?
8. Does the design still work without the glow?

If the answer to #7 is "AI-generated landing page", simplify it.
