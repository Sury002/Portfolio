const { useState, useEffect, useRef, useMemo } = React;

// --- Constants ---
const RESUME_LINK = "https://drive.google.com/file/d/1qvWBuQ7RTOBkeaMilGquXEPT0Gs-lido/view";

// ─── 3D Scene Manager ────────────────────────────────────────────────────────
function init3DScene() {
  const canvas = document.querySelector('#canvas3d');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 6);

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
  dirLight.position.set(10, 20, 15);
  dirLight.castShadow = true;
  scene.add(dirLight);

  // Environment Map (Procedural)
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envScene = new THREE.Scene();
  const envLight = new THREE.Mesh(new THREE.SphereGeometry(100, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.BackSide }));
  envScene.add(envLight);
  const envMap = pmrem.fromScene(envScene).texture;
  scene.environment = envMap;

  const pl1 = new THREE.PointLight(0xc2a05d, 80, 25);
  pl1.position.set(-6, 4, 8);
  scene.add(pl1);

  const pl2 = new THREE.PointLight(0xfdfcf0, 50, 25);
  pl2.position.set(6, -4, 8);
  scene.add(pl2);

  const pl3 = new THREE.PointLight(0xf5d0a9, 15, 12);
  pl3.position.set(0, 0, 5);
  scene.add(pl3);

  // Studio Lights (Invisible planes that create long reflections)
  const studioLightMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  const sl1 = new THREE.Mesh(new THREE.PlaneGeometry(5, 20), studioLightMat);
  sl1.position.set(-10, 10, 5);
  sl1.lookAt(0, 0, 0);
  scene.add(sl1); // reflected by metal surfaces

  const sl2 = new THREE.Mesh(new THREE.PlaneGeometry(20, 5), studioLightMat);
  sl2.position.set(0, -10, 10);
  sl2.lookAt(0, 0, 0);
  scene.add(sl2);

  // Warm rim light for premium feel
  const rimLight = new THREE.PointLight(0xc2a05d, 30, 20);
  rimLight.position.set(-5, -3, 4);
  scene.add(rimLight);

  // ── Materials ──────────────────────────────────────────────────────────────
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.0,
    transmission: 0.95,
    thickness: 1.5,
    ior: 1.5,
    transparent: true,
    opacity: 0.9,
    envMapIntensity: 2.0,
  });

  const goldMat = new THREE.MeshPhysicalMaterial({
    color: 0xc2a05d,
    metalness: 1.0,
    roughness: 0.15,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    envMapIntensity: 2.5,
  });

  // Space Gray chassis (dark enough to pop on light bg)
  const silverMat = new THREE.MeshPhysicalMaterial({
    color: 0x2a2a2c,
    metalness: 1.0,
    roughness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    envMapIntensity: 2.5,
  });

  // Jet black for screens/bezels
  const obsidianMat = new THREE.MeshPhysicalMaterial({
    color: 0x0a0a0a,
    metalness: 0.3,
    roughness: 0.05,
    clearcoat: 1.0,
    envMapIntensity: 1.0,
  });

  // Glowing screen material
  const screenMat = new THREE.MeshPhysicalMaterial({
    color: 0x111827,
    emissive: 0x1e3a5f,
    emissiveIntensity: 0.8,
    metalness: 0.0,
    roughness: 0.0,
  });

  const glowMat = new THREE.MeshPhysicalMaterial({
    color: 0xa855f7,
    metalness: 0.0,
    roughness: 0.0,
    emissive: 0xa855f7,
    emissiveIntensity: 1.0,
    transparent: true,
    opacity: 0.85,
  });

  // ── MODEL 1: Laptop (Hero) ─────────────────────────────────────────────────
  function buildLaptop() {
    const group = new THREE.Group();

    // 1. Bottom Chassis (Anodized Aluminum)
    const baseGroup = new THREE.Group();
    const mainBase = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.1, 2.3), silverMat);
    baseGroup.add(mainBase);

    // Rounded Corners for Chassis
    const cornerRadius = 0.1;
    const cornerGeo = new THREE.CylinderGeometry(cornerRadius, cornerRadius, 0.1, 32);
    const pos = [[-1.6, 1.05], [1.6, 1.05], [-1.6, -1.05], [1.6, -1.05]];
    pos.forEach(([x, z]) => {
      const c = new THREE.Mesh(cornerGeo, silverMat);
      c.position.set(x, 0, z);
      baseGroup.add(c);
    });

    // Ports (USB-C)
    const portGeo = new THREE.BoxGeometry(0.08, 0.03, 0.12);
    const portMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    [[-1.7, 0.2], [-1.7, 0.4], [1.7, 0.3]].forEach(([x, z]) => {
      const p = new THREE.Mesh(portGeo, portMat);
      p.position.set(x, 0, z);
      baseGroup.add(p);
    });

    group.add(baseGroup);

    // 2. Trackpad & Keyboard Bed
    const bedGeo = new THREE.BoxGeometry(3.2, 0.01, 2.1);
    const bed = new THREE.Mesh(bedGeo, new THREE.MeshPhysicalMaterial({ color: 0xe5e5e5, roughness: 0.4 }));
    bed.position.y = 0.055;
    group.add(bed);

    const tpGeo = new THREE.BoxGeometry(1.0, 0.01, 0.65);
    const tp = new THREE.Mesh(tpGeo, glassMat);
    tp.position.set(0, 0.06, 0.7);
    group.add(tp);

    // 3. Precision Keys
    const keyMat = new THREE.MeshPhysicalMaterial({ color: 0x1a1a1a, roughness: 0.8 });
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 14; c++) {
        const k = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.03, 0.16), keyMat);
        k.position.set(-1.25 + c * 0.19, 0.07, -0.3 + r * 0.19);
        group.add(k);
      }
    }

    // 4. Screen Assembly
    const screenGroup = new THREE.Group();
    screenGroup.position.set(0, 0.05, -1.1);

    // Lid (Aluminum)
    const lid = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.06, 2.3), silverMat);
    lid.position.set(0, 1.15, 1.15);
    screenGroup.add(lid);

    // Glass Screen with code content
    const screenFace = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 2.1), screenMat);
    screenFace.position.set(0, 1.15, 1.185);
    screenGroup.add(screenFace);

    // Reflection Overlay
    const refl = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 2.1), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.05, roughness: 0, metalness: 1 }));
    refl.position.set(0, 1.15, 1.19);
    screenGroup.add(refl);

    // Code lines on screen
    const codeColors = [0x60a5fa, 0xa78bfa, 0x34d399, 0xfbbf24, 0xf87171, 0x38bdf8];
    for (let i = 0; i < 10; i++) {
      const w = 0.4 + Math.random() * 1.6;
      const line = new THREE.Mesh(
        new THREE.PlaneGeometry(w, 0.04),
        new THREE.MeshBasicMaterial({ color: codeColors[i % codeColors.length], transparent: true, opacity: 0.85 })
      );
      line.position.set(-0.8 + Math.random() * 0.4, 1.8 - i * 0.18, 1.19);
      screenGroup.add(line);
    }

    // Webcam
    const cam = new THREE.Mesh(new THREE.CircleGeometry(0.02, 32), new THREE.MeshBasicMaterial({ color: 0x0a0a0a }));
    cam.position.set(0, 2.15, 1.19);
    screenGroup.add(cam);

    // Logo (Glowing Torus)
    const logo = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.02, 16, 64), goldMat);
    logo.position.set(0, 1.15, 1.12);
    logo.rotation.x = Math.PI / 2;
    screenGroup.add(logo);

    screenGroup.rotation.x = -Math.PI * 0.55;
    group.add(screenGroup);

    // 5. Specular Edge Highlights (Simulating light catching beveled edges)
    const edgeMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
    const edge1 = new THREE.Mesh(new THREE.BoxGeometry(3.42, 0.01, 0.01), edgeMat);
    edge1.position.set(0, 0.05, 1.15); // Front edge of base
    baseGroup.add(edge1);

    const edge2 = new THREE.Mesh(new THREE.BoxGeometry(0.01, 2.1, 0.01), edgeMat);
    edge2.position.set(1.61, 1.15, 1.19); // Side edge of screen
    screenGroup.add(edge2);

    group.rotation.x = 0.15;
    group.rotation.y = -0.3;
    group.position.set(1.8, -0.2, 0);
    group.scale.set(0.9, 0.9, 0.9);
    return group;
  }

  // ── MODEL 2: Mobile Phone (About) ─────────────────────────────────────────
  function buildPhone() {
    const group = new THREE.Group();

    // 1. Unibody (Titanium with Rounded Edges)
    const bodyGroup = new THREE.Group();
    const mainBody = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.4, 0.15), silverMat);
    bodyGroup.add(mainBody);

    // Rounded Edges (4 corners)
    const r = 0.15;
    const corner = new THREE.CylinderGeometry(r, r, 0.15, 32);
    const pos = [[-0.6, 1.2], [0.6, 1.2], [-0.6, -1.2], [0.6, -1.2]];
    pos.forEach(([x, y]) => {
      const c = new THREE.Mesh(corner, silverMat);
      c.rotation.x = Math.PI / 2;
      c.position.set(x, y, 0);
      bodyGroup.add(c);
    });
    group.add(bodyGroup);

    // 2. Multi-Layer Glass Display
    const displayGroup = new THREE.Group();
    displayGroup.position.z = 0.08;

    const bezel = new THREE.Mesh(new THREE.BoxGeometry(1.15, 2.35, 0.02), obsidianMat);
    displayGroup.add(bezel);

    const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 2.3), screenMat);
    screen.position.z = 0.015;
    displayGroup.add(screen);

    // Reflection Overlay
    const pRefl = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 2.3), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.08, roughness: 0, metalness: 1 }));
    pRefl.position.z = 0.025;
    displayGroup.add(pRefl);

    // App icons on screen
    const appColors = [0x60a5fa, 0xa78bfa, 0x34d399, 0xfbbf24, 0xf87171, 0x38bdf8, 0xfb923c, 0xf472b6];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const icon = new THREE.Mesh(
          new THREE.BoxGeometry(0.15, 0.15, 0.01),
          new THREE.MeshBasicMaterial({ color: appColors[(row * 4 + col) % appColors.length] })
        );
        icon.position.set(-0.27 + col * 0.2, 0.7 - row * 0.28, 0.02);
        displayGroup.add(icon);
      }
    }

    // Dynamic Island
    const island = new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 0.12, 4, 16), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    island.rotation.z = Math.PI / 2;
    island.position.set(0, 1.05, 0.02);
    displayGroup.add(island);

    group.add(displayGroup);

    // 3. Pro Camera Module (High Detail)
    const camMod = new THREE.Group();
    const camBase = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.08), silverMat);
    camMod.add(camBase);

    [[-0.15, 0.15], [0.15, 0.15], [0, -0.18]].forEach(([cx, cy]) => {
      const lensHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.06, 32), silverMat);
      lensHousing.rotation.x = Math.PI / 2;
      lensHousing.position.set(cx, cy, 0.05);
      camMod.add(lensHousing);

      const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.02, 32), obsidianMat);
      lens.rotation.x = Math.PI / 2;
      lens.position.set(cx, cy, 0.09);
      camMod.add(lens);
    });
    camMod.position.set(0.25, 0.85, -0.1);
    group.add(camMod);

    // 4. Physical Buttons
    const btnGeo = new THREE.BoxGeometry(0.04, 0.25, 0.06);
    const volUp = new THREE.Mesh(btnGeo, silverMat);
    volUp.position.set(-0.62, 0.4, 0);
    group.add(volUp);

    const volDown = new THREE.Mesh(btnGeo, silverMat);
    volDown.position.set(-0.62, 0.1, 0);
    group.add(volDown);

    const power = new THREE.Mesh(btnGeo, silverMat);
    power.position.set(0.62, 0.25, 0);
    group.add(power);

    group.rotation.y = 0.3;
    group.rotation.x = 0.1;
    group.position.set(1.8, 0, 0);
    group.scale.set(1.1, 1.1, 1.1);

    // Specular Edge Highlights for Phone
    const pEdgeMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
    const pEdge1 = new THREE.Mesh(new THREE.BoxGeometry(0.01, 2.4, 0.01), pEdgeMat);
    pEdge1.position.set(0.6, 0, 0.08); // Side edge
    group.add(pEdge1);

    return group;
  }

  // ── MODEL 3: Glowing Code Terminal (Services) ──────────────────────────────
  function buildCodeSphere() {
    const group = new THREE.Group();

    // Central core
    const sphereGeo = new THREE.IcosahedronGeometry(1.2, 8);
    const sphere = new THREE.Mesh(sphereGeo, goldMat);
    group.add(sphere);

    // Glass shell
    const shellGeo = new THREE.IcosahedronGeometry(1.4, 4);
    const shell = new THREE.Mesh(shellGeo, glassMat);
    group.add(shell);

    // Internal Mechanical Complexity
    const innerCore = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const g = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 0.05), silverMat);
      g.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      innerCore.add(g);
    }
    group.add(innerCore);
    // Orbital rings with dots
    for (let i = 0; i < 3; i++) {
      const rGeo = new THREE.TorusGeometry(1.8 + i * 0.2, 0.01, 32, 100);
      const rMat = new THREE.MeshBasicMaterial({ color: 0xc2a05d, transparent: true, opacity: 0.4 });
      const ring = new THREE.Mesh(rGeo, rMat);
      ring.rotation.x = Math.random() * Math.PI;
      ring.rotation.y = Math.random() * Math.PI;
      group.add(ring);

      const dotGeo = new THREE.SphereGeometry(0.06, 16, 16);
      const dotMat = new THREE.MeshPhysicalMaterial({ color: 0xc2a05d, emissive: 0xc2a05d, emissiveIntensity: 1.5 });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.set(1.8 + i * 0.2, 0, 0);
      ring.add(dot);
    }

    // Floating code brackets
    const bracketPositions = [
      { pos: [-2, 0.8, 0.5], text: '</>' },
      { pos: [2, -0.5, 0.3], text: '{}' },
      { pos: [0.5, 2, 0], text: '()' },
    ];
    bracketPositions.forEach(({ pos }) => {
      const bGeo = new THREE.BoxGeometry(0.3, 0.25, 0.05);
      const bMat = new THREE.MeshPhysicalMaterial({ color: 0xc2a05d, emissive: 0xc2a05d, emissiveIntensity: 0.8, transparent: true, opacity: 0.9 });
      const b = new THREE.Mesh(bGeo, bMat);
      b.position.set(...pos);
      group.add(b);
    });

    // Particle cloud around sphere
    const pts = [];
    for (let i = 0; i < 200; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const r = 2.5 + Math.random() * 1.5;
      pts.push(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
    }
    const ptGeo = new THREE.BufferGeometry();
    ptGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3));
    const ptMesh = new THREE.Points(ptGeo, new THREE.PointsMaterial({ size: 0.05, color: 0x818cf8, transparent: true, opacity: 0.7 }));
    group.add(ptMesh);

    group.position.set(1.8, 0, 0);
    group.scale.set(0.85, 0.85, 0.85);
    return group;
  }

  // ── MODEL 4: Globe / Network (Skills) ─────────────────────────────────────
  function buildGlobe() {
    const group = new THREE.Group();

    // 1. Solid Core (Jet Black Obsidian)
    const core = new THREE.Mesh(new THREE.SphereGeometry(1.35, 64, 64), obsidianMat);
    group.add(core);

    // 2. Diamond Tech Lattice (Gold with Glow)
    const latticeGeo = new THREE.IcosahedronGeometry(1.45, 1);
    const latticeMat = new THREE.MeshPhysicalMaterial({ 
      color: 0xc2a05d, 
      wireframe: true, 
      wireframeLineWidth: 3,
      emissive: 0xc2a05d,
      emissiveIntensity: 0.2
    });
    const lattice = new THREE.Mesh(latticeGeo, latticeMat);
    group.add(lattice);

    // Latitude & Longitude precision lines (Darker for contrast)
    const lineMat = new THREE.MeshBasicMaterial({ color: 0x1c1917, transparent: true, opacity: 0.2 });
    for (let i = 0; i < 12; i++) {
      const r1 = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.003, 16, 100), lineMat);
      r1.rotation.x = Math.PI / 2;
      r1.rotation.y = (i * Math.PI) / 6;
      group.add(r1);
    }

    // 3. Glowing Data Hubs (Gold with High Intensity)
    const hubs = [
      [1, 1, 1], [-1, -1, 1], [1, -1, -1], [-1, 1, -1],
      [0, 1.4, 0], [0, -1.4, 0], [1.4, 0, 0], [-1.4, 0, 0]
    ];
    hubs.forEach(([x, y, z]) => {
      const hub = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), new THREE.MeshPhysicalMaterial({ color: 0xc2a05d, emissive: 0xc2a05d, emissiveIntensity: 4 }));
      hub.position.set(x, y, z).normalize().multiplyScalar(1.45);
      group.add(hub);
      
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.8), new THREE.MeshBasicMaterial({ color: 0xc2a05d, transparent: true, opacity: 0.5 }));
      beam.position.copy(hub.position).multiplyScalar(1.2);
      beam.lookAt(0,0,0);
      beam.rotateX(Math.PI/2);
      group.add(beam);
    });

    group.position.set(1.8, 0, 0);
    return group;
  }

  // ── MODEL 5: Rocket (Projects/Contact) ────────────────────────────────────
  function buildRocket() {
    const group = new THREE.Group();

    // 1. Space Gray Hull (High Contrast)
    const fuseGroup = new THREE.Group();
    const mainHull = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 2.0, 32), silverMat);
    fuseGroup.add(mainHull);

    const nose = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.4, 0.8, 32), silverMat);
    nose.position.y = 1.4;
    fuseGroup.add(nose);

    // 2. High-Tech Windows (Glow for Contrast)
    const windowGlowMat = new THREE.MeshPhysicalMaterial({ color: 0x3b82f6, emissive: 0x3b82f6, emissiveIntensity: 2 });
    for (let i = 0; i < 3; i++) {
      const wFrame = new THREE.Mesh(new THREE.CircleGeometry(0.12, 32), goldMat);
      wFrame.position.set(0, 0.5 - i * 0.45, 0.46);
      fuseGroup.add(wFrame);
      const wGlass = new THREE.Mesh(new THREE.CircleGeometry(0.09, 32), windowGlowMat);
      wGlass.position.set(0, 0.5 - i * 0.45, 0.48);
      fuseGroup.add(wGlass);
    }

    // 3. Realistic Thruster System
    const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 0.4, 32), obsidianMat);
    nozzle.position.y = -1.2;
    fuseGroup.add(nozzle);

    const flame = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffaa00 }));
    flame.position.y = -1.6;
    flame.scale.set(0.7, 1.8, 0.7);
    fuseGroup.add(flame);

    // 4. Aerospace Fins (Sharper Geometry with Gold Edges)
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(0.6, -0.4);
    finShape.lineTo(0.6, -1.0);
    finShape.lineTo(0, -0.8);
    const finGeo = new THREE.ExtrudeGeometry(finShape, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.02 });
    
    for (let i = 0; i < 4; i++) {
      const f = new THREE.Mesh(finGeo, goldMat);
      f.rotation.y = i * Math.PI / 2;
      f.position.y = -0.4;
      fuseGroup.add(f);
    }

    group.add(fuseGroup);
    group.rotation.z = -Math.PI / 5;
    group.position.set(1.5, 0.5, 0);
    return group;
  }

  // ── Luxurious Ambient Particles (Gold Dust + Sparkles) ─────────────────────
  // Layer 1: Fine gold dust (slow drift)
  const dustGeo = new THREE.BufferGeometry();
  const dustArr = new Float32Array(4500);
  for (let i = 0; i < 4500; i++) dustArr[i] = (Math.random() - 0.5) * 35;
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustArr, 3));
  const dustParticles = new THREE.Points(dustGeo, new THREE.PointsMaterial({
    size: 0.02, color: 0xc2a05d, transparent: true, opacity: 0.25
  }));
  scene.add(dustParticles);

  // Layer 2: Bright sparkle points (twinkle)
  const sparkGeo = new THREE.BufferGeometry();
  const sparkArr = new Float32Array(900);
  for (let i = 0; i < 900; i++) sparkArr[i] = (Math.random() - 0.5) * 25;
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkArr, 3));
  const sparkParticles = new THREE.Points(sparkGeo, new THREE.PointsMaterial({
    size: 0.04, color: 0xffffff, transparent: true, opacity: 0.15
  }));
  scene.add(sparkParticles);

  // Layer 3: Warm atmospheric haze
  const hazeGeo = new THREE.BufferGeometry();
  const hazeArr = new Float32Array(600);
  for (let i = 0; i < 600; i++) hazeArr[i] = (Math.random() - 0.5) * 18;
  hazeGeo.setAttribute('position', new THREE.BufferAttribute(hazeArr, 3));
  const hazeParticles = new THREE.Points(hazeGeo, new THREE.PointsMaterial({
    size: 0.08, color: 0xd4a853, transparent: true, opacity: 0.06
  }));
  // ── Soft Contact Shadow (Radial Gradient) ──────────────────────────────
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 128; shadowCanvas.height = 128;
  const sCtx = shadowCanvas.getContext('2d');
  const gradient = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(0,0,0,0.4)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  sCtx.fillStyle = gradient;
  sCtx.fillRect(0, 0, 128, 128);
  const shadowTexture = new THREE.CanvasTexture(shadowCanvas);

  const shadowGeo = new THREE.PlaneGeometry(6, 4);
  const shadowMat = new THREE.MeshBasicMaterial({ 
    map: shadowTexture,
    transparent: true, 
    opacity: 0.6,
    side: THREE.DoubleSide
  });
  const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = -2.5;
  shadowPlane.position.x = 1.8;
  scene.add(shadowPlane);

  // ── Build all models ───────────────────────────────────────────────────────
  const models = [
    buildLaptop(),    // 0: Hero
    buildPhone(),     // 1: About
    buildCodeSphere(),// 2: Services
    buildGlobe(),     // 3: Skills
    buildRocket(),    // 4: Projects/Contact
  ];

  let currentModel = 0;
  models[0].visible = true;
  models.forEach((m, i) => {
    m.visible = i === 0;
    scene.add(m);
  });

  // ── Section mapping ────────────────────────────────────────────────────────
  const sections = ['home', 'about', 'services', 'skills', 'projects'];
  const sectionToModel = { home: 0, about: 1, services: 2, skills: 3, certificates: 3, projects: 4, contact: 4 };

  function transitionTo(targetIdx) {
    if (targetIdx === currentModel) return;
    const from = models[currentModel];
    const to = models[targetIdx];

    // Fade out current
    gsap.to(from.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 0.5, ease: 'power2.in', onComplete: () => { from.visible = false; } });
    gsap.to(from.position, { x: from.position.x - 3, duration: 0.5, ease: 'power2.in' });

    // Fade in next
    to.visible = true;
    const baseScale = [0.9, 1.1, 0.85, 1.0, 0.85][targetIdx];
    to.scale.set(0.001, 0.001, 0.001);
    to.position.x = models[targetIdx].position.x + 3;
    gsap.to(to.scale, { x: baseScale, y: baseScale, z: baseScale, duration: 0.7, ease: 'back.out(1.7)', delay: 0.3 });
    gsap.to(to.position, { x: 1.8, duration: 0.7, ease: 'power3.out', delay: 0.3 });

    currentModel = targetIdx;
  }

  // ── Intersection Observer for section detection ────────────────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const idx = sectionToModel[id];
        if (idx !== undefined) transitionTo(idx);
      }
    });
  }, { threshold: 0.35 });

  setTimeout(() => {
    Object.keys(sectionToModel).forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }, 1000);

  // ── Mouse tracking ─────────────────────────────────────────────────────────
  let mx = 0, my = 0;
  window.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Resize ─────────────────────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ── Animation loop ─────────────────────────────────────────────────────────
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.016;

    // Camera mouse parallax
    camera.position.x += (mx * 0.4 - camera.position.x) * 0.05;
    camera.position.y += (-my * 0.3 - camera.position.y) * 0.05;
    camera.lookAt(0.5, 0, 0);

    // Particles drift (Flowy movement)
    dustParticles.rotation.y += 0.00015;
    dustParticles.rotation.z += 0.00005;
    sparkParticles.rotation.y -= 0.0002;
    sparkParticles.position.y = Math.sin(t * 0.2) * 0.5;
    hazeParticles.rotation.y += 0.00005;
    hazeParticles.position.z = Math.cos(t * 0.1) * 0.3;

    // Shadow syncing
    if (shadowPlane) {
      shadowPlane.material.opacity = 0.6 + Math.sin(t * 0.5) * 0.1;
      shadowPlane.scale.set(1 + Math.sin(t * 0.5) * 0.05, 1 + Math.sin(t * 0.5) * 0.05, 1);
    }

    // Sparkle twinkle effect
    sparkParticles.material.opacity = 0.1 + Math.sin(t * 1.5) * 0.08;

    // Per-model animations
    const m = models[currentModel];
    if (!m || !m.visible) { renderer.render(scene, camera); return; }

    switch (currentModel) {
      case 0: // Laptop: gentle float + screen pulse
        m.rotation.y = -0.3 + Math.sin(t * 0.4) * 0.08;
        m.position.y = -0.2 + Math.sin(t * 0.5) * 0.08;
        break;

      case 1: // Phone: slow spin + bob
        m.rotation.y = 0.3 + Math.sin(t * 0.3) * 0.15;
        m.position.y = Math.sin(t * 0.6) * 0.1;
        break;

      case 2: // Code sphere: fast spin + ring orbits
        m.rotation.y += 0.008;
        m.rotation.x += 0.002;
        m.children.forEach((c, i) => {
          if (c.isGroup || c.geometry?.type === 'TorusGeometry') {
            c.rotation.z += 0.004 + i * 0.002;
          }
        });
        break;

      case 3: // Globe: steady rotation + pulse rings
        m.rotation.y += 0.005;
        m.children.forEach(c => {
          if (c._pulsePhase !== undefined) {
            c._pulsePhase += 0.04;
            c.material.opacity = 0.4 + Math.sin(c._pulsePhase) * 0.4;
            const s = 1 + Math.sin(c._pulsePhase) * 0.3;
            c.scale.set(s, s, s);
          }
        });
        break;

      case 4: // Rocket: tilt float + flame pulse
        m.rotation.y = 0.3 + Math.sin(t * 0.5) * 0.1;
        m.position.y = 0.5 + Math.sin(t * 0.7) * 0.15;
        m.rotation.z = -Math.PI / 5 + Math.sin(t * 0.3) * 0.05;
        break;
    }

    renderer.render(scene, camera);
  }
  animate();

  // ── Loader ─────────────────────────────────────────────────────────────────
  const loader = document.querySelector('#loader');
  const lbar = document.querySelector('#loader-bar');
  let p = 0;
  const itv = setInterval(() => {
    p += Math.random() * 18 + 5;
    if (p >= 100) {
      p = 100;
      clearInterval(itv);
      setTimeout(() => {
        if (loader) loader.classList.add('fade-out');
        setTimeout(() => { if (loader) loader.style.display = 'none'; }, 1000);
      }, 400);
    }
    if (lbar) lbar.style.width = `${p}%`;
  }, 120);

  return () => {
    observer.disconnect();
    renderer.dispose();
  };
}

// --- Components ---

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = ["Home", "About", "Services", "Skills", "Certificates", "Projects", "Contact"];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'glass-nav py-3' : 'py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-black/5 group-hover:border-primary/50 transition-all duration-500">
            <img src="./Assets/Logo.jpeg" alt="DevTactix" className="w-full h-full object-contain" />
          </div>
          <span className="text-2xl font-black font-outfit tracking-tighter text-slate-900 group-hover:text-primary transition-colors uppercase">
            DEVTACTIX
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}
              className="text-xs font-bold uppercase tracking-widest text-stone-600 hover:text-primary transition-colors nav-link">
              {item}
            </a>
          ))}
          <a href={RESUME_LINK} target="_blank" className="btn-primary py-2 px-5 text-xs text-white">
            Resume <i className="fas fa-download text-[10px]"></i>
          </a>
        </div>

        <button className="lg:hidden text-stone-900 text-2xl z-50" onClick={() => setMenuOpen(!menuOpen)}>
          <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars-staggered'}`}></i>
        </button>
      </div>

      <div className={`lg:hidden fixed inset-0 bg-white/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-8 transition-all duration-500 ${menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        {navItems.map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`}
            className="text-3xl font-bold font-outfit text-slate-900 hover:text-primary transition-colors"
            onClick={() => setMenuOpen(false)}>
            {item}
          </a>
        ))}
      </div>
    </nav>
  );
}

function SectionLabel({ index, label }) {
  return (
    <div className="inline-flex items-center gap-3 mb-6">
      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-black">
        {String(index).padStart(2, '0')}
      </div>
      <span className="text-xs font-black uppercase tracking-[0.25em] text-primary">{label}</span>
    </div>
  );
}

function Hero() {
  return (
    <section id="home" className="section-container">
      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          AVAILABLE FOR FREELANCE & FULL-STACK ROLES
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black font-outfit leading-[1.05] mb-6 text-stone-900 tracking-tight">
          Hi, I'm <span className="text-primary-gradient">Surya</span> <br />
          <span className="text-stone-500">Software</span><br />
          Engineer.
        </h1>
        
        <p className="text-lg text-stone-600 mb-10 max-w-xl leading-relaxed">
          Founder of <span className="text-stone-900 font-bold">DevTactix</span> — building high-performance 
          web & mobile apps that drive real business results.
        </p>
        
        <div className="flex flex-wrap gap-4 mb-12">
          <a href="#projects" className="btn-primary px-8 py-4 text-white">
            View My Work <i className="fas fa-arrow-right ml-2"></i>
          </a>
          <a href="#contact" className="btn-outline px-8 py-4">
            Hire Me
          </a>
        </div>

        <div className="flex items-center gap-6">
          <a href="https://github.com/Sury002" target="_blank" className="text-xl text-stone-400 hover:text-primary transition-colors">
            <i className="fab fa-github"></i>
          </a>
          <a href="https://www.linkedin.com/in/suryak24/" target="_blank" className="text-xl text-stone-400 hover:text-blue-600 transition-colors">
            <i className="fab fa-linkedin-in"></i>
          </a>
          <div className="h-5 w-px bg-stone-300"></div>
          <div className="flex gap-2">
            {['React', 'Node', 'Flutter'].map(t => (
              <span key={t} className="px-2.5 py-1 rounded-md bg-stone-200 text-stone-600 text-[10px] font-bold uppercase tracking-wider">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section-container">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div className="relative order-2 md:order-1 group">
          <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-3xl opacity-60"></div>
          <div className="glass-card overflow-hidden p-2 relative z-10">
            <img src="./Assets/ProfilePic2.jpg" alt="Surya" className="w-full rounded-2xl transition-all duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 flex items-end justify-center p-6 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <h3 className="text-white text-3xl font-black font-outfit uppercase">Surya K</h3>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 glass-card p-5 z-20 animate-float border border-primary/20 bg-white/80">
            <div className="text-3xl font-black text-primary mb-0.5">MERN / MEAN</div>
            <div className="text-[10px] font-bold text-stone-500 tracking-widest uppercase">Core Expertise</div>
          </div>
        </div>
        
        <div className="order-1 md:order-2">
          <SectionLabel index={2} label="About Me" />
          <h2 className="text-4xl md:text-5xl font-black font-outfit mb-8 text-slate-900 uppercase tracking-tighter">
            Crafting <span className="text-primary-gradient">Digital</span><br />Experiences.
          </h2>
          <div className="space-y-5 text-slate-500 leading-relaxed">
            <p>I'm a <span className="text-slate-900 font-bold">Software Engineer</span> specializing in full-stack web and mobile development. My journey started with interactive UIs and evolved into complex architectures across platforms.</p>
            <p>I build <span className="text-primary font-semibold">performant applications</span> using MERN & MEAN stacks, with Flutter for cross-platform mobile. Clean code + intuitive UX is the standard I hold myself to.</p>
            <p>Through <span className="text-slate-900 font-bold">DevTactix</span>, I help businesses bring ideas to life with robust, scalable, beautifully designed solutions.</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8">
            {[{ n: '15+', l: 'Projects' }, { n: '100%', l: 'Dedication' }, { n: '2+', l: 'Years Exp.' }].map(s => (
              <div key={s.l} className="glass-card p-4 text-center border border-primary/10">
                <div className="text-2xl font-black text-primary mb-1">{s.n}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const services = [
    { title: "Full-Stack Development", desc: "High-performance apps using MERN & MEAN stacks.", icon: "fas fa-code", color: "bg-blue-500" },
    { title: "Mobile Development", desc: "Cross-platform mobile apps with Flutter.", icon: "fas fa-mobile-screen-button", color: "bg-cyan-500" },
    { title: "API Design", desc: "Robust backend systems & third-party integrations.", icon: "fas fa-plug", color: "bg-green-500" },
    { title: "Technical Consulting", desc: "Architecture, tech choice & performance guidance.", icon: "fas fa-lightbulb", color: "bg-yellow-500" },
  ];

  return (
    <section id="services" className="section-container">
      <div className="mb-16">
        <SectionLabel index={3} label="Services" />
        <h2 className="text-4xl md:text-5xl font-black font-outfit text-slate-900 uppercase tracking-tighter">
          What I <span className="text-primary-gradient">Build</span>.
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((s, i) => (
          <div key={i} className="glass-card p-8 group flex gap-6 items-start">
            <div className={`w-14 h-14 rounded-2xl ${s.color} flex-shrink-0 flex items-center justify-center text-2xl text-white group-hover:scale-110 transition-all duration-500 shadow-lg`}>
              <i className={s.icon}></i>
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-primary transition-colors">{s.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Skills() {
  const skills = [
    { name: "React", icon: "fab fa-react", color: "text-blue-500", level: 85, category: "frontend" },
    { name: "Angular", icon: "devicon-angularjs-plain colored", color: "text-red-600", level: 75, category: "frontend" },
    { name: "JavaScript", icon: "fab fa-js", color: "text-yellow-500", level: 90, category: "frontend" },
    { name: "Tailwind CSS", icon: "devicon-tailwindcss-plain colored", color: "text-cyan-500", level: 85, category: "frontend" },
    { name: "TypeScript", icon: "devicon-typescript-plain colored", color: "text-blue-600", level: 80, category: "frontend" },
    { name: "Flutter", icon: "devicon-flutter-plain colored", color: "text-blue-400", level: 80, category: "mobile" },
    { name: "Node.js", icon: "devicon-nodejs-plain colored", color: "text-green-600", level: 80, category: "backend" },
    { name: "Express", icon: "devicon-express-original", color: "text-slate-700", level: 80, category: "backend" },
    { name: "REST API", icon: "fas fa-code", color: "text-indigo-600", level: 80, category: "backend" },
    { name: "MongoDB", icon: "devicon-mongodb-plain colored", color: "text-green-600", level: 75, category: "database" },
    { name: "MySQL", icon: "devicon-mysql-plain colored", color: "text-blue-600", level: 70, category: "database" },
    { name: "Git", icon: "devicon-git-plain colored", color: "text-orange-600", level: 85, category: "other" },
    { name: "Firebase", icon: "devicon-firebase-plain colored", color: "text-yellow-600", level: 75, category: "other" },
  ];

  const categories = [
    { id: "frontend", name: "Frontend", icon: "fas fa-laptop-code" },
    { id: "mobile", name: "Mobile", icon: "fas fa-mobile-screen" },
    { id: "backend", name: "Backend", icon: "fas fa-server" },
    { id: "database", name: "Database", icon: "fas fa-database" },
    { id: "other", name: "Other", icon: "fas fa-cogs" },
  ];

  const [activeCategory, setActiveCategory] = useState("frontend");
  const filtered = skills.filter(s => s.category === activeCategory);

  return (
    <section id="skills" className="section-container">
      <div className="mb-16">
        <SectionLabel index={4} label="Skills" />
        <h2 className="text-4xl md:text-5xl font-black font-outfit text-stone-900 uppercase tracking-tighter">
          Technical <span className="text-primary-gradient">Stack</span>.
        </h2>
      </div>

      <div className="flex flex-wrap gap-3 mb-12">
        {categories.map((c) => (
          <button key={c.id} onClick={() => setActiveCategory(c.id)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${activeCategory === c.id ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-stone-200 text-stone-600 hover:bg-stone-300'}`}>
            <i className={c.icon}></i> {c.name}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((skill) => (
          <div key={skill.name} className="glass-card p-6 group hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-4 mb-3">
              <div className={`text-3xl ${skill.color} transition-transform group-hover:scale-110`}>
                <i className={skill.icon}></i>
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1.5">
                  <h3 className="font-bold text-stone-900 uppercase tracking-wider text-xs">{skill.name}</h3>
                  <span className="text-xs font-bold text-primary">{skill.level}%</span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-primary to-stone-400 h-full rounded-full transition-all duration-1000" style={{ width: `${skill.level}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Certificates() {
  const certificates = [
    { title: "IIT-M Pravartak Full Stack Development", issuer: "Guvi", date: "2025", image: "./Assets/Cert_FullStack.png", link: "https://v2.zenclass.in/certificateDownload/p53TIxsEDb9jhVb2" },
    { title: "HTML, CSS, and Tailwind CSS", issuer: "Guvi", date: "2025", image: "./Assets/Cert_Frontend.png", link: "https://v2.zenclass.in/certificateDownload/Hjn9GjWHS2FS8LbW" },
    { title: "JavaScript Basics", issuer: "Guvi", date: "2025", image: "./Assets/Cert_JS_Basics.png", link: "https://v2.zenclass.in/certificateDownload/ZUFgiemUELBvxbNx" },
    { title: "Advanced JavaScript", issuer: "Guvi", date: "2025", image: "./Assets/Cert_JS_Advanced.png", link: "https://v2.zenclass.in/certificateDownload/EEhSHRFDLsP6qYfn" },
    { title: "ReactJS", issuer: "Guvi", date: "2025", image: "./Assets/Cert_React.png", link: "https://v2.zenclass.in/certificateDownload/HfoIqpSiIwUVQpsb" },
    { title: "Node JS", issuer: "Guvi", date: "2025", image: "./Assets/Cert_Node.png", link: "https://v2.zenclass.in/certificateDownload/iNEWssqwvh9zLxsx" },
    { title: "Database", issuer: "Guvi", date: "2025", image: "./Assets/Cert_Database.png", link: "https://v2.zenclass.in/certificateDownload/7VkwA8LP7PgTOq1W" },
    { title: "TypeScript", issuer: "Guvi", date: "2025", image: "./Assets/Cert_TypeScript.png", link: "https://www.guvi.in/share-certificate/B7H8dnY041a1g06U15" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const next = () => setCurrentIndex((p) => (p + 1) % certificates.length);
  const prev = () => setCurrentIndex((p) => (p - 1 + certificates.length) % certificates.length);

  return (
    <section id="certificates" className="section-container">
      <div className="mb-16">
        <SectionLabel index={5} label="Certifications" />
        <h2 className="text-4xl md:text-5xl font-black font-outfit text-stone-900 uppercase tracking-tighter">
          My <span className="text-primary-gradient">Certs</span>.
        </h2>
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div className="glass-card overflow-hidden bg-white/40">
          <div className="grid md:grid-cols-5 gap-0">
            <div className="md:col-span-3 relative aspect-video md:aspect-auto">
              <img src={certificates[currentIndex].image} alt={certificates[currentIndex].title}
                className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-stone-200/40"></div>
            </div>
            <div className="md:col-span-2 p-8 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-primary uppercase tracking-widest mb-3">
                  {currentIndex + 1} / {certificates.length}
                </div>
                <h3 className="text-2xl font-black font-outfit text-stone-900 mb-3 leading-tight">{certificates[currentIndex].title}</h3>
                <p className="text-stone-600 text-sm mb-2">Issued by <span className="font-bold text-stone-900">{certificates[currentIndex].issuer}</span></p>
                <p className="text-stone-500 text-xs">{certificates[currentIndex].date}</p>
              </div>
              <div className="space-y-4">
                <a href={certificates[currentIndex].link} target="_blank"
                  className="btn-primary text-sm py-3 w-full text-center text-white block">
                  View Certificate <i className="fas fa-external-link-alt ml-2 text-xs"></i>
                </a>
                <div className="flex gap-3">
                  <button onClick={prev} className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-900 hover:bg-stone-900 hover:text-white transition-all text-sm">
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button onClick={next} className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-900 hover:bg-stone-900 hover:text-white transition-all text-sm">
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-2 mt-6">
          {certificates.map((_, i) => (
            <button key={i} onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-stone-300'}`}></button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  const projects = [
    { name: "FreshMart Elite", img: "./Assets/SupermarketDemo.png", category: "business", link: "https://freshmartelite.netlify.app/", desc: "Premium supermarket landing page with high-end emerald aesthetic.", icon: "fas fa-leaf", featured: true },
    { name: "FitZone Elite", img: "./Assets/GymDemo.png", category: "business", link: "https://fitzoneelite.netlify.app/", desc: "Landing page for a premium fitness center with dark aesthetic.", icon: "fas fa-dumbbell", featured: true },
    { name: "DentalCare Pro", img: "./Assets/DentalDemo.png", category: "business", link: "https://dentalproclinic.netlify.app/", desc: "Clinic management system with appointment scheduling.", icon: "fas fa-tooth", featured: true },
    { name: "Online Counseling", img: "./Assets/WellMind.png", category: "fullstack", link: "https://wellmindcounseling.netlify.app", desc: "MERN app for therapy with real-time chat and video.", icon: "fas fa-comments", featured: true },
    { name: "AI Assistant", img: "./Assets/AI Chat Assistant.png", category: "fullstack", link: "https://suryaaichatassistant.netlify.app", desc: "Modern AI chat app with conversation history and dark mode.", icon: "fas fa-robot" },
    { name: "Meme Generator", img: "./Assets/Meme Generator.png", category: "fullstack", link: "https://suryasmemegenerator.netlify.app", desc: "Full-stack meme creator and sharing platform.", icon: "fas fa-image" },
    { name: "QR Generator Pro", img: "./Assets/QR Code Generator Pro.png", category: "frontend", link: "https://suryaqrcodegeneratorpro.netlify.app", desc: "Feature-rich customizable QR code generator.", icon: "fas fa-qrcode" },
    { name: "Snake Game", img: "./Assets/Snake Game.png", category: "frontend", link: "https://suryassnakegame.netlify.app", desc: "Classic arcade game rebuilt with modern JavaScript.", icon: "fas fa-gamepad" },
    { name: "EcoHome Real Estate", img: "./Assets/RealEstateDemo.png", category: "business", link: "#", desc: "Modern real estate platform with property listings.", icon: "fas fa-home", comingSoon: true },
  ];

  const categories = [
    { id: "all", name: "All" },
    { id: "business", name: "Business" },
    { id: "fullstack", name: "Full-Stack" },
    { id: "frontend", name: "Frontend" }
  ];

  const [activeCategory, setActiveCategory] = useState("all");
  const filtered = activeCategory === "all" ? projects : projects.filter(p => p.category === activeCategory);

  return (
    <section id="projects" className="section-container">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <SectionLabel index={6} label="Portfolio" />
          <h2 className="text-4xl md:text-5xl font-black font-outfit text-stone-900 uppercase tracking-tighter">
            My <span className="text-primary-gradient">Work</span>.
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <button key={c.id} onClick={() => setActiveCategory(c.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeCategory === c.id ? 'bg-primary text-white' : 'bg-stone-200 text-stone-500 hover:bg-stone-300'}`}>
              {c.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p, i) => (
          <div key={i} className="glass-card group overflow-hidden flex flex-col">
            <div className="aspect-video relative overflow-hidden">
              <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              {p.comingSoon && (
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-white text-xs font-black tracking-widest uppercase border border-white/20 px-4 py-2 rounded-lg">Coming Soon</span>
                </div>
              )}
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                {!p.comingSoon && (
                  <a href={p.link} target="_blank" className="btn-primary py-2 px-6 text-white">
                    View Project <i className="fas fa-external-link-alt ml-2 text-xs"></i>
                  </a>
                )}
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <i className={`${p.icon} text-primary`}></i>
                <h3 className="text-lg font-bold text-stone-900">{p.name}</h3>
                {p.featured && <span className="ml-auto text-[9px] font-black text-primary uppercase tracking-widest border border-primary/30 px-2 py-0.5 rounded-full">Featured</span>}
              </div>
              <p className="text-stone-600 text-sm flex-1 line-clamp-2">{p.desc}</p>
              <div className="text-[10px] font-bold text-primary uppercase tracking-widest mt-3">{p.category}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("https://formspree.io/f/xgvzrvoj", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) { setStatus("success"); setFormData({ name: "", email: "", message: "" }); }
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  return (
    <section id="contact" className="section-container">
      <div className="glass-card p-8 md:p-14 relative overflow-hidden bg-white/40">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 grid md:grid-cols-2 gap-16">
          <div>
            <SectionLabel index={7} label="Contact" />
            <h2 className="text-4xl md:text-5xl font-black font-outfit text-stone-900 mb-8 uppercase tracking-tighter">
              Let's <span className="text-primary-gradient">Build</span><br />Together.
            </h2>
            <div className="space-y-6">
              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-stone-200 flex items-center justify-center text-xl text-primary group-hover:scale-110 transition-all border border-primary/10">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <div className="text-[10px] text-stone-500 font-bold uppercase tracking-widest mb-0.5">Email</div>
                  <a href="mailto:Suryabalaji791@gmail.com" className="text-stone-900 font-bold hover:text-primary transition-colors text-sm">Suryabalaji791@gmail.com</a>
                </div>
              </div>
              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-stone-200 flex items-center justify-center text-xl text-blue-600 group-hover:scale-110 transition-all border border-blue-600/10">
                  <i className="fab fa-linkedin-in"></i>
                </div>
                <div>
                  <div className="text-[10px] text-stone-500 font-bold uppercase tracking-widest mb-0.5">LinkedIn</div>
                  <a href="https://www.linkedin.com/in/suryak24/" target="_blank" className="text-stone-900 font-bold hover:text-blue-600 transition-colors text-sm">Surya K on LinkedIn</a>
                </div>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Name" required value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/50 border border-stone-200 rounded-xl px-5 py-3.5 text-stone-900 focus:outline-none focus:border-primary transition-colors w-full text-sm placeholder:text-stone-400" />
              <input type="email" placeholder="Email" required value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="bg-white/50 border border-stone-200 rounded-xl px-5 py-3.5 text-stone-900 focus:outline-none focus:border-primary transition-colors w-full text-sm placeholder:text-stone-400" />
            </div>
            <textarea placeholder="Tell me about your project..." required rows="5" value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              className="bg-white/50 border border-stone-200 rounded-xl px-5 py-3.5 text-stone-900 focus:outline-none focus:border-primary transition-colors w-full resize-none text-sm placeholder:text-stone-400"></textarea>
            <button disabled={status === "sending"} className="btn-primary w-full py-4 text-white">
              {status === "sending" ? "Sending..." : "Send Message"} <i className="fas fa-paper-plane ml-2"></i>
            </button>
            {status === "success" && <p className="text-green-600 text-sm font-bold text-center animate-pulse">Message sent! I'll get back to you soon.</p>}
            {status === "error" && <p className="text-red-500 text-sm font-bold text-center">Error sending. Please try again.</p>}
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-10 border-t border-stone-200 text-center bg-stone-50/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-xl font-black font-outfit tracking-tighter text-stone-900 mb-3 uppercase">DEV<span className="text-primary">TACTIX</span></div>
        <p className="text-stone-500 text-xs mb-6">© {new Date().getFullYear()} Surya K. All rights reserved.</p>
        <div className="flex justify-center gap-6">
          <a href="https://github.com/Sury002" target="_blank" className="text-stone-400 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest">Github</a>
          <a href="https://www.linkedin.com/in/suryak24/" target="_blank" className="text-stone-400 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}

// --- Scroll progress indicator ---
function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener('scroll', update);
    return () => window.removeEventListener('scroll', update);
  }, []);
  return (
    <div className="fixed top-0 left-0 w-full h-0.5 z-[60]">
      <div className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-100" style={{ width: `${progress}%` }}></div>
    </div>
  );
}

// --- Model indicator sidebar ---
function ModelIndicator() {
  const stages = [
    { icon: 'fas fa-laptop', label: 'Home' },
    { icon: 'fas fa-mobile-screen', label: 'About' },
    { icon: 'fas fa-code', label: 'Services' },
    { icon: 'fas fa-globe', label: 'Skills' },
    { icon: 'fas fa-rocket', label: 'Launch' },
  ];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sections = ['home', 'about', 'services', 'skills', 'projects'];
    const map = { home: 0, about: 1, services: 2, skills: 3, certificates: 3, projects: 4, contact: 4 };
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const idx = map[e.target.id];
          if (idx !== undefined) setActive(idx);
        }
      });
    }, { threshold: 0.4 });
    Object.keys(map).forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-4">
      {stages.map((s, i) => (
        <div key={i} className="flex items-center gap-2 group cursor-default">
          <div className={`text-right text-[10px] font-bold uppercase tracking-widest transition-all duration-300 overflow-hidden ${active === i ? 'text-primary max-w-20 opacity-100' : 'text-transparent max-w-0 opacity-0 group-hover:max-w-20 group-hover:opacity-100 group-hover:text-slate-400'}`}>
            {s.label}
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all duration-300 border ${active === i ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30 scale-110' : 'bg-white/80 text-slate-400 border-slate-200 hover:border-primary/40'}`}>
            <i className={s.icon}></i>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- App ---
function App() {
  useEffect(() => {
    // Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // Init 3D
    const cleanup = init3DScene();

    return () => {
      lenis.destroy();
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <div className="relative">
      <ScrollProgress />
      <Navbar />
      <ModelIndicator />
      <main>
        <Hero />
        <About />
        <Services />
        <Skills />
        <Certificates />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);