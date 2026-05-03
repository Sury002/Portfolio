const { useState, useEffect, useRef, useMemo } = React;

// --- Constants ---
const RESUME_LINK = "https://drive.google.com/file/d/1qvWBuQ7RTOBkeaMilGquXEPT0Gs-lido/view";

// ─── 3D Scene Manager ────────────────────────────────────────────────────────
function init3DScene(theme) {
  const canvas = document.querySelector('#canvas3d');
  if (!canvas) return;

  const isBusiness = theme === 'business';

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ReinhardToneMapping;
  renderer.toneMappingExposure = isBusiness ? 1.55 : 1.3;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 300);
  camera.position.set(0, 0, 11);

  // ── Ambient ──
  scene.add(new THREE.AmbientLight(0xffffff, isBusiness ? 0.05 : 0.12));

  // ── Lights ──
  if (isBusiness) {
    // Single pure yellow-gold hue across all lights
    const GOLD = 0xffc033;
    const k = new THREE.PointLight(GOLD, 500, 50); k.position.set(7, 8, 8);    scene.add(k);
    const f = new THREE.PointLight(GOLD, 250, 40); f.position.set(14, -2, 3);  scene.add(f);
    const r = new THREE.PointLight(GOLD, 120, 30); r.position.set(-10, 4, -5); scene.add(r);
    const u = new THREE.PointLight(GOLD, 150, 25); u.position.set(3, -8, 4);   scene.add(u);
  } else {
    // Engineer — cool cyan/blue rim lighting for the octahedron
    const k = new THREE.PointLight(0x4fc3ff, 500, 40); k.position.set(6, 5, 6);  scene.add(k);
    const f = new THREE.PointLight(0x22d3ee, 280, 30); f.position.set(-6, -3, 4); scene.add(f);
    const r = new THREE.PointLight(0xffffff, 140, 20); r.position.set(-5, 0, -5); scene.add(r);
    const u = new THREE.PointLight(0x60a5fa, 180, 25); u.position.set(4, -6, 3);  scene.add(u);
  }

  // ── 3D Model Group ──
  const group = new THREE.Group();
  group.position.set(3.0, 0.5, 0);
  scene.add(group);

  // ── Radial halo sprite helper (used by both themes) ──
  const makeHalo = (inner, mid, outer) => {
    const c = document.createElement('canvas');
    c.width = c.height = 512;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    g.addColorStop(0.00, inner);
    g.addColorStop(0.18, mid);
    g.addColorStop(0.50, outer);
    g.addColorStop(1.00, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 512);
    return new THREE.CanvasTexture(c);
  };

  // Orbitals: small polyhedra that circle the main model
  const orbitals = [];

  if (isBusiness) {
    // ── Torus knot — polished gold with subtle mesh overlay ──
    const geo = new THREE.TorusKnotGeometry(2.2, 0.62, 600, 120, 2, 3);

    // 1. Polished gold body — warm mid-gold with high metalness/low roughness
    group.add(new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({
      color: 0xd9a441,
      metalness: 1.0,
      roughness: 0.22,
      clearcoat: 1.0,
      clearcoatRoughness: 0.15,
      envMapIntensity: 1.2,
    })));

    // 2. Subtle bright wireframe overlay — lighter so the polished surface shows through
    group.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
      color: 0xffdd66, wireframe: true, transparent: true, opacity: 0.35,
    })));

    // ── Warm yellow rim halo ──
    const haloTex = makeHalo('rgba(255,200,80,0.55)', 'rgba(220,160,40,0.25)', 'rgba(120,80,0,0.08)');
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({
      map: haloTex, transparent: true, blending: THREE.AdditiveBlending,
      depthWrite: false, opacity: 0.5,
    }));
    halo.scale.set(11, 11, 1);
    halo.position.set(3.5, 0.3, -2.5);
    scene.add(halo);

    // ── Thin orbital ring ──
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(3.3, 0.009, 8, 240),
      new THREE.MeshBasicMaterial({ color: 0xffcc55, transparent: true, opacity: 0.3 })
    );
    ring1.rotation.x = Math.PI / 2.6;
    group.add(ring1);
    orbitals.push({ mesh: ring1, type: 'ring', speed: 0.0022, axis: 'z' });
  } else {
    // ── Engineer — luminous crystal octahedron with glowing sapphire edges ──
    const geo = new THREE.OctahedronGeometry(2.3, 0);

    // 1. Translucent blue glass body (sapphire-like)
    group.add(new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({
      color: 0x08132c,
      metalness: 0.4, roughness: 0.25,
      transparent: true, opacity: 0.78,
      clearcoat: 1.0, clearcoatRoughness: 0.1,
      transmission: 0.35, ior: 1.4,
    })));

    // 2. Bright cyan edges — main outline
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({ color: 0x4fc3ff, transparent: true, opacity: 1.0 })
    );
    group.add(edges);

    // 3. Outer glow halo edges (scaled slightly larger for light-bleed effect)
    const edgesGlow = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({ color: 0xbfe6ff, transparent: true, opacity: 0.7 })
    );
    edgesGlow.scale.setScalar(1.008);
    group.add(edgesGlow);

    // 4. Inner glowing core — small bright sphere for depth
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.55, 1),
      new THREE.MeshStandardMaterial({
        color: 0x1e40af, emissive: 0x60a5fa, emissiveIntensity: 2.5,
        metalness: 0.4, roughness: 0.3,
      })
    );
    group.add(core);
    orbitals.push({ mesh: core, type: 'spin', sx: 0.015, sy: 0.022, sz: 0.008 });

    // 5. Core wireframe for extra detail
    const coreWire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.58, 1),
      new THREE.MeshBasicMaterial({
        color: 0xbfdbfe, wireframe: true,
        transparent: true, opacity: 0.5,
      })
    );
    group.add(coreWire);
    orbitals.push({ mesh: coreWire, type: 'spin', sx: -0.02, sy: -0.015, sz: -0.01 });

    // 6. Soft blue rim halo
    const haloTex = makeHalo('rgba(130,200,255,0.55)', 'rgba(60,130,220,0.25)', 'rgba(20,60,140,0.08)');
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({
      map: haloTex, transparent: true, blending: THREE.AdditiveBlending,
      depthWrite: false, opacity: 0.5,
    }));
    halo.scale.set(10, 10, 1);
    halo.position.set(3.5, 0.3, -2.5);
    scene.add(halo);

    // 7. Thin orbital ring
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.3, 0.009, 8, 240),
      new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.28 })
    );
    ring.rotation.x = Math.PI / 2.4;
    ring.rotation.y = 0.4;
    group.add(ring);
    orbitals.push({ mesh: ring, type: 'ring', speed: 0.0022, axis: 'z' });
  }

  // ── Ambient drifting wireframe shapes (depth fillers) ──
  const ambientShapes = [];
  {
    const geoms = [
      new THREE.DodecahedronGeometry(0.8, 0),
      new THREE.IcosahedronGeometry(0.7, 0),
      new THREE.OctahedronGeometry(0.6, 0),
      new THREE.TetrahedronGeometry(0.9, 0),
    ];
    const col = isBusiness ? 0xff9944 : 0x4a90e2;
    for (let i = 0; i < 10; i++) {
      const g = geoms[i % geoms.length];
      const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({
        color: col, wireframe: true, transparent: true,
        opacity: 0.12 + Math.random() * 0.15,
      }));
      m.position.set(
        (Math.random() - 0.5) * 28,
        (Math.random() - 0.5) * 16,
        -4 - Math.random() * 12
      );
      m.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      m.userData = {
        rx: (Math.random() - 0.5) * 0.004,
        ry: (Math.random() - 0.5) * 0.005,
        driftY: 0.003 + Math.random() * 0.004,
        phase: Math.random() * Math.PI * 2,
      };
      scene.add(m);
      ambientShapes.push(m);
    }
  }

  // ── Floating particle dust (soft glowing motes) ──
  const dust = (() => {
    const n = 260;
    const positions = new Float32Array(n * 3);
    const speeds = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
      speeds[i] = 0.002 + Math.random() * 0.004;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const tex = makeHalo(
      isBusiness ? 'rgba(255,200,120,1)' : 'rgba(180,220,255,1)',
      isBusiness ? 'rgba(255,140,40,0.6)' : 'rgba(100,170,255,0.6)',
      'rgba(0,0,0,0)'
    );
    const mat = new THREE.PointsMaterial({
      size: 0.14, map: tex, transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: isBusiness ? 0xffcc66 : 0xaaccff,
      opacity: 0.55, sizeAttenuation: true,
    });
    const p = new THREE.Points(g, mat);
    p.userData = { speeds };
    scene.add(p);
    return p;
  })();

  // ── ANIMATED DOT-WAVE FLOOR (like reference image) ──
  // Build a grid of points we can deform each frame with sine/cosine waves.
  // We cache (x0, z0) and per-frame recompute y + per-vertex color alpha
  // so wave crests appear brighter — mimicking the reference.
  const buildWaveField = ({ cols, rows, spacingX, spacingZ, baseColor, crestColor, size, opacity }) => {
    const count = cols * rows;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const base = new Float32Array(count * 2); // store original x, z for animation
    const halfCols = cols / 2;
    const cBase = new THREE.Color(baseColor);
    const cCrest = new THREE.Color(crestColor);
    let i = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c - halfCols) * spacingX;
        const z = -r * spacingZ;
        positions[i * 3]     = x;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = z;
        base[i * 2]     = x;
        base[i * 2 + 1] = z;
        colors[i * 3]     = cBase.r;
        colors[i * 3 + 1] = cBase.g;
        colors[i * 3 + 2] = cBase.b;
        i++;
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size, transparent: true, opacity, sizeAttenuation: true,
      vertexColors: true, depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const pts = new THREE.Points(geo, mat);
    pts.userData = { base, cols, rows, cBase, cCrest };
    return pts;
  };

  const waveLayers = [];

  if (isBusiness) {
    // Primary bright golden wave — the main crest layer
    const floor = buildWaveField({
      cols: 120, rows: 70, spacingX: 0.35, spacingZ: 0.35,
      baseColor: 0x5a2a00, crestColor: 0xffb347,
      size: 0.06, opacity: 1.0,
    });
    floor.position.set(1, -3.2, 9);
    floor.rotation.x = -Math.PI * 0.09;
    scene.add(floor);
    waveLayers.push({ pts: floor, amp: 0.9, freqA: 0.55, freqB: 0.35, speed: 1.0, phase: 0 });

    // Secondary deeper wave for parallax/depth
    const floor2 = buildWaveField({
      cols: 90, rows: 50, spacingX: 0.5, spacingZ: 0.5,
      baseColor: 0x2a1400, crestColor: 0xff8800,
      size: 0.05, opacity: 0.55,
    });
    floor2.position.set(3, -5.2, 4);
    floor2.rotation.x = -Math.PI * 0.06;
    scene.add(floor2);
    waveLayers.push({ pts: floor2, amp: 1.3, freqA: 0.4, freqB: 0.25, speed: 0.7, phase: 1.3 });
  } else {
    // Engineer — dense cyan particle wave (matches reference)
    const floor = buildWaveField({
      cols: 120, rows: 70, spacingX: 0.35, spacingZ: 0.35,
      baseColor: 0x0a2a55, crestColor: 0x7fd6ff,
      size: 0.06, opacity: 1.0,
    });
    floor.position.set(1, -3.2, 9);
    floor.rotation.x = -Math.PI * 0.09;
    scene.add(floor);
    waveLayers.push({ pts: floor, amp: 0.9, freqA: 0.55, freqB: 0.35, speed: 1.0, phase: 0 });

    // Secondary deeper wave
    const floor2 = buildWaveField({
      cols: 90, rows: 50, spacingX: 0.5, spacingZ: 0.5,
      baseColor: 0x05162e, crestColor: 0x3b82f6,
      size: 0.05, opacity: 0.5,
    });
    floor2.position.set(3, -5.2, 4);
    floor2.rotation.x = -Math.PI * 0.06;
    scene.add(floor2);
    waveLayers.push({ pts: floor2, amp: 1.3, freqA: 0.4, freqB: 0.25, speed: 0.7, phase: 1.3 });
  }

  // ── Starfield ──
  {
    const count = 500;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i*3]   = (Math.random() - 0.5) * 60;
      pos[i*3+1] = (Math.random() - 0.5) * 35;
      pos[i*3+2] = (Math.random() - 0.5) * 20;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(geo, new THREE.PointsMaterial({
      size: 0.04, color: isBusiness ? 0xffaa44 : 0xffffff,
      transparent: true, opacity: isBusiness ? 0.25 : 0.15,
    })));
  }

  // ── Animated background nebula via CSS custom property ──
  // We drive a CSS animation on the bg div by updating a data attribute
  const bgDiv = document.getElementById('theme-bg');

  // ── Mouse tracking ──
  let mx = 0, my = 0;
  const onMM = e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener('mousemove', onMM);

  // ── Animation loop ──
  let t = 0, animId;
  function animate() {
    animId = requestAnimationFrame(animate);
    t += 0.006;

    // Animate background nebula via the div's gradient
    if (bgDiv) {
      if (isBusiness) {
        const purpleX = 5 + Math.sin(t * 0.4) * 4;
        const purpleY = 30 + Math.sin(t * 0.3) * 8;
        const amberX  = 88 + Math.sin(t * 0.25) * 5;
        const amberY  = 55 + Math.cos(t * 0.35) * 10;
        const pulse   = 0.35 + Math.sin(t * 0.5) * 0.08;
        bgDiv.style.background = `
          radial-gradient(ellipse 55% 75% at ${purpleX}% ${purpleY}%, rgba(60,0,120,${pulse + 0.1}) 0%, rgba(20,0,50,0.5) 40%, transparent 70%),
          radial-gradient(ellipse 55% 65% at ${amberX}% ${amberY}%, rgba(60,25,0,${pulse}) 0%, rgba(15,5,0,0.6) 45%, transparent 70%),
          radial-gradient(ellipse 35% 40% at 50% 0%, rgba(40,0,80,0.25) 0%, transparent 55%),
          #04010e
        `;
      } else {
        const blueX  = 10 + Math.sin(t * 0.35) * 6;
        const blueY  = 35 + Math.cos(t * 0.28) * 10;
        const cyanX  = 88 + Math.sin(t * 0.3) * 5;
        const cyanY  = 60 + Math.cos(t * 0.4) * 8;
        const pulse  = 0.28 + Math.sin(t * 0.45) * 0.07;
        bgDiv.style.background = `
          radial-gradient(ellipse 55% 75% at ${blueX}% ${blueY}%, rgba(20,60,140,${pulse + 0.1}) 0%, rgba(5,20,60,0.5) 45%, transparent 75%),
          radial-gradient(ellipse 55% 60% at ${cyanX}% ${cyanY}%, rgba(0,90,140,${pulse}) 0%, rgba(5,20,40,0.55) 45%, transparent 75%),
          radial-gradient(ellipse 35% 40% at 50% 0%, rgba(30,60,180,0.22) 0%, transparent 55%),
          #02050f
        `;
      }
    }

    // Main-model group rotation — slow, majestic
    group.rotation.y += 0.004;
    group.rotation.z += 0.0012;
    group.position.y = Math.sin(t * 0.4) * 0.25 + 0.5;
    group.rotation.x += (-my * 0.12 - group.rotation.x) * 0.04;

    // Orbitals — independent motion (cubes circle; rings rotate; cores spin)
    for (const o of orbitals) {
      if (o.type === 'orbit') {
        const u = o.mesh.userData;
        u.angle += u.speed * 0.01;
        const tilt = u.tilt || 0;
        const x = Math.cos(u.angle) * u.radius;
        const y = Math.sin(u.angle) * u.radius * Math.sin(tilt);
        const z = Math.sin(u.angle) * u.radius * Math.cos(tilt);
        o.mesh.position.set(x, y, z);
        o.mesh.rotation.x += 0.03;
        o.mesh.rotation.y += 0.02;
      } else if (o.type === 'ring') {
        o.mesh.rotation.z += o.speed;
      } else if (o.type === 'spin') {
        o.mesh.rotation.x += o.sx;
        o.mesh.rotation.y += o.sy;
        o.mesh.rotation.z += o.sz;
      }
    }

    // Ambient drifting wireframes — slow rotation + gentle bob
    for (const m of ambientShapes) {
      m.rotation.x += m.userData.rx;
      m.rotation.y += m.userData.ry;
      m.position.y += Math.sin(t * m.userData.driftY * 60 + m.userData.phase) * 0.004;
    }

    // Dust — gentle upward drift with wrap
    {
      const arr = dust.geometry.attributes.position.array;
      const speeds = dust.userData.speeds;
      for (let i = 0; i < speeds.length; i++) {
        arr[i * 3 + 1] += speeds[i];
        arr[i * 3]     += Math.sin(t * 0.5 + i) * 0.0015;
        if (arr[i * 3 + 1] > 9) arr[i * 3 + 1] = -9;
      }
      dust.geometry.attributes.position.needsUpdate = true;
    }

    // Subtle camera parallax follows mouse
    camera.position.x += (mx * 0.5 - camera.position.x) * 0.02;
    camera.position.y += (-my * 0.3 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);

    // Animate wave layers — deform y and re-color crests
    for (const layer of waveLayers) {
      const { pts, amp, freqA, freqB, speed, phase } = layer;
      const { base, cBase, cCrest } = pts.userData;
      const posAttr = pts.geometry.attributes.position;
      const colAttr = pts.geometry.attributes.color;
      const tt = t * speed + phase;
      const invAmp = 1 / amp;
      for (let i = 0, n = base.length / 2; i < n; i++) {
        const x = base[i * 2];
        const z = base[i * 2 + 1];
        // Two overlapping sine/cos waves => organic dune look
        const y =
          Math.sin(x * freqA + tt) * amp * 0.55 +
          Math.cos(z * freqB - tt * 0.8) * amp * 0.55 +
          Math.sin((x + z) * 0.2 + tt * 0.6) * amp * 0.25;
        posAttr.array[i * 3 + 1] = y;
        // Crest highlighting: brighter color as y approaches amp
        const k = Math.min(1, Math.max(0, (y * invAmp + 1) * 0.5));
        const ease = k * k; // emphasise crests
        colAttr.array[i * 3]     = cBase.r + (cCrest.r - cBase.r) * ease;
        colAttr.array[i * 3 + 1] = cBase.g + (cCrest.g - cBase.g) * ease;
        colAttr.array[i * 3 + 2] = cBase.b + (cCrest.b - cBase.b) * ease;
      }
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
    }

    renderer.render(scene, camera);
  }
  animate();

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', onResize);

  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('mousemove', onMM);
    renderer.dispose();
  };
}

// ─── Shared Components ───────────────────────────────────────────────────────

function SectionLabel({ label }) {
  return (
    <div className="section-label reveal">
      <span className="label-cube" aria-hidden="true">
        <span></span><span></span><span></span><span></span><span></span><span></span>
      </span>
      <span className="section-label-rule"></span>
      <span className="section-label-text">{label}</span>
    </div>
  );
}

// Small rotating wireframe polyhedron accent — decorative 3D element
function PolyAccent() {
  return (
    <span className="poly-accent" aria-hidden="true">
      <span></span><span></span><span></span><span></span><span></span>
    </span>
  );
}

// Floating glow orbs inside a section wrapper — pure CSS 3D drift
function SectionOrbs() {
  return (
    <>
      <div className="float-orb o1"></div>
      <div className="float-orb o2"></div>
      <div className="float-orb o3"></div>
    </>
  );
}

function ProjectGrid({ projects, title }) {
  return (
    <section className="section-container">
      <SectionLabel label={title} />
      <div className="grid lg:grid-cols-2 gap-12 reveal">
        {projects.map((p, i) => (
          <div key={i} className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 aspect-video glass-panel">
            <img src={p.img} alt={p.name} className="w-full h-full object-cover object-center transition-all duration-1000 scale-100 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-12 flex flex-col justify-end backdrop-blur-sm">
              <div className="text-[10px] font-black text-theme tracking-[0.4em] uppercase mb-4">{p.category}</div>
              <h3 className="text-4xl font-black text-white mb-8 uppercase tracking-tighter">{p.name}</h3>
              <a href={p.link} target="_blank" className="btn-premium py-4 px-8 text-[10px]">Launch Project <i className="fas fa-arrow-right ml-2"></i></a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const TECH_STACK = [
  { name: "MERN / MEAN", level: "Architecture" },
  { name: "Node.js / Express", level: "Backend" },
  { name: "React / Angular", level: "Frontend" },
  { name: "Flutter / Dart", level: "Mobile Dev" },
  { name: "Tailwind / CSS", level: "Styling" },
  { name: "MongoDB / SQL", level: "Database" },
  { name: "Figma / UI Design", level: "Design" },
  { name: "Git / GitHub", level: "Workflow" }
];

function EngineerExperience() {
  const experiences = [
    {
      company: "Ideal Tech Labs",
      role: "Software Engineer 1",
      period: "Jan 2026 - Present",
      points: [
        "Architected multi-tenant payroll SaaS system with secure database isolation.",
        "Engineered flexible payroll engine supporting dynamic tax rules and deductions (PF, PT).",
        "Developed automated document generation systems for payslips and compliance reports.",
        "Refactored legacy ERP modules, standardizing UI/UX across enterprise planning systems.",
        "Implemented platform-wide subscription management and tenant control systems."
      ]
    },
    {
      company: "Ideal Tech Labs",
      role: "Full Stack Developer Intern",
      period: "Sep 2025 - Dec 2025",
      points: [
        "Built dynamic User Profile module supporting document management and personal analytics.",
        "Integrated biometric attendance hardware logs into structured system data via REST APIs.",
        "Optimized MongoDB queries and implemented real-time dashboards using Angular."
      ]
    },
    {
      company: "GUVI Geek Networks, IITM",
      role: "Full Stack Development Scholar",
      period: "Nov 2024 - Aug 2025",
      points: [
        "Mastered MERN stack architecture focusing on scalable web applications.",
        "Developed and deployed production-ready authentication systems using JWT.",
        "Engineered real-time dashboards with REST API integration and MongoDB Atlas."
      ]
    }
  ];

  return (
    <section id="experience" className="section-container">
      <SectionLabel label="Professional Tenure" />
      <div className="grid gap-12">
        {experiences.map((exp, i) => (
          <div key={i} className="glass-panel p-10 reveal">
            <div className="flex flex-col md:flex-row justify-between items-start mb-8">
              <div>
                <h3 className="text-3xl font-black mb-2 text-ink-900">{exp.company}</h3>
                <p className="text-theme font-bold tracking-[0.25em] text-[11px] uppercase">{exp.role}</p>
              </div>
              <span className="text-ink-300 font-mono text-xs">{exp.period}</span>
            </div>
            <ul className="space-y-4">
              {exp.points.map((p, j) => (
                <li key={j} className="flex gap-4 leading-relaxed" style={{color: 'var(--ink-500)'}}>
                  <span className="text-theme">•</span> {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function EngineerAbout() {
  return (
    <section className="section-container">
      <SectionLabel label="Core Profile" />
      <div className="grid lg:grid-cols-12 gap-16 items-start reveal">
        <div className="lg:col-span-5 relative group">
          <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 bg-white/5 relative z-10">
            <img src="./Assets/ProfilePic2.jpg" alt="Surya" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
          </div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-theme/20 rounded-full blur-[120px] -z-10 group-hover:bg-theme/40 transition-all duration-1000"></div>
        </div>
        <div className="lg:col-span-7 space-y-8">
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black font-outfit uppercase tracking-tighter leading-[0.95] text-ink-900">Architecting <br /><span className="text-gradient">End-to-End</span> Solutions.</h2>
          <div className="space-y-5 text-lg leading-relaxed max-w-xl" style={{color: 'var(--ink-500)'}}>
            <p>I am a <span className="text-ink-900 font-semibold">Software Engineer</span> specialised in building production-ready applications using both the MERN and MEAN stacks.</p>
            <p>While I started with a strong focus on front-end development, I now design complete systems including <span className="text-ink-900 font-semibold">scalable back-end architectures</span> and real-time database solutions.</p>
          </div>
          <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/[0.06]">
            {[{n:'15+', l:'Deployed'}, {n:'100%', l:'Precision'}, {n:'MERN/MEAN', l:'Core Stack'}, {n:'24/7', l:'Support'}].map(s => (
              <div key={s.l}>
                <div className="text-3xl font-black text-ink-900">{s.n}</div>
                <div className="text-[10px] font-bold tracking-[0.3em] text-ink-300 uppercase mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Certificates() {
  const certs = [
    { title: "IIT-M Full Stack Development", issuer: "Guvi", date: "2025", image: "./Assets/Cert_FullStack.png", link: "https://v2.zenclass.in/certificateDownload/p53TIxsEDb9jhVb2" },
    { title: "HTML, CSS, and Tailwind", issuer: "Guvi", date: "2025", image: "./Assets/Cert_Frontend.png", link: "https://v2.zenclass.in/certificateDownload/Hjn9GjWHS2FS8LbW" },
    { title: "JavaScript Basics", issuer: "Guvi", date: "2025", image: "./Assets/Cert_JS_Basics.png", link: "https://v2.zenclass.in/certificateDownload/ZUFgiemUELBvxbNx" },
    { title: "Advanced JavaScript", issuer: "Guvi", date: "2025", image: "./Assets/Cert_JS_Advanced.png", link: "https://v2.zenclass.in/certificateDownload/EEhSHRFDLsP6qYfn" },
    { title: "ReactJS", issuer: "Guvi", date: "2025", image: "./Assets/Cert_React.png", link: "https://v2.zenclass.in/certificateDownload/HfoIqpSiIwUVQpsb" },
    { title: "Node JS", issuer: "Guvi", date: "2025", image: "./Assets/Cert_Node.png", link: "https://v2.zenclass.in/certificateDownload/iNEWssqwvh9zLxsx" },
    { title: "Database", issuer: "Guvi", date: "2025", image: "./Assets/Cert_Database.png", link: "https://v2.zenclass.in/certificateDownload/7VkwA8LP7PgTOq1W" },
    { title: "TypeScript", issuer: "Guvi", date: "2025", image: "./Assets/Cert_TypeScript.png", link: "https://www.guvi.in/share-certificate/B7H8dnY041a1g06U15" },
  ];

  const [curr, setCurr] = useState(0);
  return (
    <section className="section-container">
      <SectionLabel label="Credentials" />
      <div className="glass-panel overflow-hidden reveal">
        <div className="grid md:grid-cols-2">
          <div className="aspect-video bg-black/40"><img src={certs[curr].image} className="w-full h-full object-cover opacity-80" /></div>
          <div className="p-12 flex flex-col justify-between">
            <div>
              <h3 className="text-3xl font-black mb-4 uppercase">{certs[curr].title}</h3>
              <p className="text-white/20 text-xs font-mono uppercase tracking-widest">{certs[curr].issuer} • {certs[curr].date}</p>
            </div>
            <div className="flex gap-4 pt-12">
              <a href={certs[curr].link} target="_blank" className="btn-premium flex-1 text-center py-4">Verify</a>
              <button onClick={() => setCurr((curr-1+certs.length)%certs.length)} className="w-16 h-16 border border-white/10 rounded-full hover:border-theme transition-all">←</button>
              <button onClick={() => setCurr((curr+1)%certs.length)} className="w-16 h-16 border border-white/10 rounded-full hover:border-theme transition-all">→</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- APP ARCHITECTURE ---

function App() {
  const [mode, setMode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { setTimeout(() => setLoading(false), 2000); }, []);
  useEffect(() => { if (mode) return init3DScene(mode); }, [mode]);
  useEffect(() => {
    const reveal = () => document.querySelectorAll('.reveal, .reveal-slide-l, .reveal-slide-r').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) el.classList.add('active');
    });
    window.addEventListener('scroll', reveal);
    reveal();
    return () => window.removeEventListener('scroll', reveal);
  }, [mode]);

  // Tilt-on-hover for all `.tilt` cards
  useEffect(() => {
    const nodes = document.querySelectorAll('.tilt');
    const handlers = [];
    nodes.forEach(el => {
      const onMove = e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width  - 0.5;
        const py = (e.clientY - r.top)  / r.height - 0.5;
        el.style.setProperty('--tx', `${px *  10}deg`);
        el.style.setProperty('--ty', `${py * -10}deg`);
      };
      const onLeave = () => {
        el.style.setProperty('--tx', '0deg');
        el.style.setProperty('--ty', '0deg');
      };
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
      handlers.push([el, onMove, onLeave]);
    });
    return () => handlers.forEach(([el, m, l]) => {
      el.removeEventListener('mousemove', m);
      el.removeEventListener('mouseleave', l);
    });
  }, [mode]);

  const businessProjects = [
    { name: "FreshMart Elite", img: "./Assets/SupermarketDemo.png", category: "SaaS E-Commerce", link: "https://freshmartelite.netlify.app/" },
    { name: "FitZone Pro", img: "./Assets/GymDemo.png", category: "HealthTech", link: "https://fitzoneelite.netlify.app/" },
    { name: "DentalCare OS", img: "./Assets/DentalDemo.png", category: "ERP System", link: "https://dentalproclinic.netlify.app/" },
    { name: "Skyline Estates", img: "./Assets/RealEstateDemo.png", category: "PropTech", link: "https://skylineestates.netlify.app/" },
  ];

  const personalProjects = [
    { name: "WellMind App", img: "./Assets/WellMind.png", category: "Fullstack", link: "https://wellmindcounseling.netlify.app" },
    { name: "Flavor Finder", img: "./Assets/Recipe.png", category: "Frontend", link: "https://flavorfinder.netlify.app/" },
    { name: "Nexus AI Chat", img: "./Assets/AI Chat Assistant.png", category: "Fullstack", link: "https://nexusaichat.netlify.app/" },
    { name: "Food Delight", img: "./Assets/Food Delight.png", category: "Frontend", link: "https://fooddelight01.netlify.app/" },
    { name: "QR Gen Pro", img: "./Assets/QR Code Generator Pro.png", category: "Frontend", link: "https://qrgenpro.netlify.app/" },
    { name: "Meme Master", img: "./Assets/Meme Generator.png", category: "Fullstack", link: "https://mememaster01.netlify.app/" },
    { name: "Retro Snake", img: "./Assets/Snake Game.png", category: "Creative", link: "https://retrosnake01.netlify.app/" },
  ];

  const business3DProjects = [
    { name: "Roasted Coffee 3D", img: "./Assets/Coffee3D.png", category: "3D Experience", link: "https://roastedcofee3d.netlify.app/" },
    { name: "Elite Gym 3D", img: "./Assets/GYM3D.png", category: "3D Experience", link: "https://elitegym3d.netlify.app/" },
  ];

  if (loading) return <div id="loader"><div className="loader-track"><div className="loader-bar" style={{ width: '100%', transition: 'width 2s ease' }}></div></div></div>;
  if (!mode) return <SplitLanding onSelect={setMode} />;

  return (
    <div className={`theme-${mode}`}>
      <style>{`:root { --theme-primary: ${mode === 'engineer' ? 'var(--primary-blue)' : 'var(--primary-orange)'}; --theme-secondary: ${mode === 'engineer' ? 'var(--secondary-cyan)' : 'var(--secondary-purple)'}; } .text-theme { color: var(--theme-primary); } .bg-theme { background-color: var(--theme-primary); } .border-theme { border-color: var(--theme-primary); }`}</style>
      
      {/* Theme background — animated by Three.js loop */}
      {mode === 'business' ? (
        <div id="theme-bg" style={{
          position: 'fixed', inset: 0, zIndex: -2,
          background: `
            radial-gradient(ellipse 55% 75% at 5% 30%, rgba(60,0,120,0.45) 0%, rgba(20,0,50,0.5) 40%, transparent 70%),
            radial-gradient(ellipse 55% 65% at 88% 55%, rgba(60,25,0,0.35) 0%, rgba(15,5,0,0.6) 45%, transparent 70%),
            radial-gradient(ellipse 35% 40% at 50% 0%, rgba(40,0,80,0.25) 0%, transparent 55%),
            #04010e
          `,
          transition: 'background 0.1s linear',
        }} />
      ) : (
        <div id="theme-bg" style={{
          position: 'fixed', inset: 0, zIndex: -2,
          background: `
            radial-gradient(ellipse 55% 75% at 10% 35%, rgba(20,60,140,0.35) 0%, rgba(5,20,60,0.5) 45%, transparent 75%),
            radial-gradient(ellipse 55% 60% at 88% 60%, rgba(0,90,140,0.3) 0%, rgba(5,20,40,0.55) 45%, transparent 75%),
            radial-gradient(ellipse 35% 40% at 50% 0%, rgba(30,60,180,0.22) 0%, transparent 55%),
            #02050f
          `,
          transition: 'background 0.1s linear',
        }} />
      )}
      
      <nav className="nav-bar pointer-events-none">
        <div className="nav-brand pointer-events-auto" onClick={() => setMode(null)}>
          <span className="nav-logo-wrap">
            <img
              src={mode === 'business' ? './Assets/Logo.jpeg' : './Assets/ProfilePic.jpeg'}
              alt={mode === 'business' ? 'DevTactix' : 'Surya K'}
              className="nav-logo"
            />
          </span>
          <span>{mode === 'engineer' ? 'SURYA K' : 'DEVTACTIX'}</span>
        </div>
        <div className="flex gap-10 pointer-events-auto">
          <button className="nav-switch" onClick={() => setMode(null)}>
            <span>Switch Side</span>
            <span className="nav-switch-dot"></span>
          </button>
        </div>
      </nav>

      <main className="relative z-10">
        <section className="section-container min-h-[90vh] flex items-center">
          <div className="grid lg:grid-cols-2 gap-16 items-center w-full reveal">
            <div className="max-w-3xl">
              <div className="hero-pill">
                <div className="live-pill w-2 h-2 rounded-full bg-theme"></div>
                <span className="text-[10px] font-bold tracking-[0.32em] uppercase text-ink-700">{mode === 'engineer' ? 'Software Engineer — MERN & MEAN' : 'Freelance Development Brand'}</span>
              </div>
              <h1 className="hero-h1 text-[clamp(3rem,8vw,6.5rem)] font-black leading-[0.9] mb-10 tracking-tighter uppercase">
                {mode === 'engineer' ? (
                  <>
                    <span className="text-ink-900">Scalable</span><br />
                    <span className="text-gradient">Systems</span><br />
                    <span className="text-ghost whitespace-nowrap">That Deliver.</span>
                  </>
                ) : (
                  <>
                    <span className="text-ink-900">Digital</span><br />
                    <span className="text-gradient-business">Products</span><br />
                    <span className="text-ghost whitespace-nowrap">That Scale.</span>
                  </>
                )}
              </h1>
              <p className="hero-lede mb-14">
                {mode === 'engineer'
                  ? "Software engineer specialised in building production-ready applications, scalable back-end architectures, and optimised development workflows."
                  : "Building scalable web applications and digital systems for modern businesses under the DevTactix brand."}
              </p>
              <div className="flex flex-wrap gap-5">
                <a href="#content" className="btn-premium btn-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-theme mr-3 inline-block"></span>
                  Explore Work
                </a>
                {mode === 'engineer' && <a href={RESUME_LINK} target="_blank" className="btn-premium">Resume</a>}
              </div>
            </div>
            {/* Right side — 3D model occupies this space via fixed canvas, shown via pointer-events passthrough */}
            <div className="hidden lg:flex items-center justify-center h-[60vh] relative">
              {/* Visual placeholder so the layout shifts text left — 3D model renders on canvas behind */}
              <div className="w-full h-full opacity-0 pointer-events-none"></div>
            </div>
          </div>
        </section>

        <div id="content">
          {mode === 'engineer' ? (
            <>
              <Marquee items={['MERN Stack', 'Scalable Systems', 'Clean Code', 'Real-time Dashboards', 'Production Ready', 'DevOps Aware', 'Type Safe', 'Tested']} />
              <EngineerAbout />
              <MetricsRow metrics={[
                { label: 'Projects Shipped', value: 15, suffix: '+', caption: 'In production today' },
                { label: 'Years Coding',    value: 2,  suffix: '+', caption: 'Full-stack focused' },
                { label: 'Tech Certs',      value: 8,         caption: 'IITM + Guvi verified' },
                { label: 'Uptime Target',   value: 99, suffix: '.9%', caption: 'p95 SLO mindset' },
              ]} />
              <SkillsGrid stack={TECH_STACK} />
              <Achievements />
              <EngineerExperience />
              <Certificates />
              <FilterableProjectGrid projects={personalProjects} />
            </>
          ) : (
            <>
              <Marquee items={['SaaS Platforms', 'Web Apps', 'Custom Dashboards', 'UI / UX', 'E-Commerce', 'Automation', 'Brand Sites', 'API Design']} />
              <BusinessServices />
              <MetricsRow metrics={[
                { label: 'Projects Shipped', value: 15, suffix: '+', caption: 'In production today' },
                { label: 'Technologies',     value: 10, suffix: '+', caption: 'Mastered & applied' },
                { label: 'Certifications',   value: 8,  suffix: '+', caption: 'IITM + Guvi verified' },
                { label: 'Avg Delivery',     value: 6,  suffix: 'wk', caption: 'MVP to launch' },
              ]} />
              <ProcessTimeline />
              <ProjectGrid projects={businessProjects} title="Business Case Studies" />
              <ProjectGrid projects={business3DProjects} title="3D Experiences" />
              <BusinessTech />
            </>
          )}
        </div>

        <section id="contact" className="section-container">
          <SectionLabel label="Direct Terminal" />
          <div className="grid lg:grid-cols-2 gap-16 items-start reveal">
            <div className="glass-panel p-12">
              <h2 className="text-[clamp(2.25rem,4vw,3.5rem)] font-black mb-6 tracking-tighter uppercase text-ink-900">Ready to <span className="text-gradient">Deploy?</span></h2>
              <p className="mb-12 text-lg leading-relaxed" style={{color: 'var(--ink-500)'}}>Have a project in mind or just want to say hi? Send a message and let's build something exceptional.</p>
              <div className="flex flex-wrap gap-6">
                {mode === 'engineer' ? (
                  <>
                    <a href="mailto:suryabalaji791@gmail.com" className="btn-premium">Email Me</a>
                    <a href="https://github.com/Sury002" target="_blank" className="btn-premium"><i className="fab fa-github mr-2"></i> GitHub</a>
                    <a href="https://linkedin.com/in/suryak24" target="_blank" className="btn-premium">LinkedIn</a>
                  </>
                ) : (
                  <>
                    <a href="mailto:contact.devtactix@gmail.com" className="btn-premium">Start a Project</a>
                    <a href="https://youtube.com/@dev.tactix" target="_blank" className="btn-premium"><i className="fab fa-youtube mr-2"></i> YouTube</a>
                    <a href="https://facebook.com/devTactix" target="_blank" className="btn-premium"><i className="fab fa-facebook mr-2"></i> Facebook</a>
                    <a href="https://instagram.com/dev.tactix" target="_blank" className="btn-premium">Instagram</a>
                  </>
                )}
              </div>
            </div>
            
            <div className="glass-panel p-12">
              <ContactForm email={mode === 'engineer' ? 'suryabalaji791@gmail.com' : 'contact.devtactix@gmail.com'} />
            </div>
          </div>
        </section>
      </main>
      <div id="cursor"></div><div id="cursor-follower"></div>
    </div>
  );
}

function FilterableProjectGrid({ projects }) {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Fullstack', 'Frontend', 'Creative'];
  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <section className="section-container">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 reveal">
        <SectionLabel label="Project Arsenal" />
        <div className="flex flex-wrap gap-4">
          {categories.map(c => (
            <button 
              key={c}
              onClick={() => setFilter(c)}
              className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 border ${filter === c ? 'bg-theme border-theme text-white shadow-lg shadow-theme/20' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20 hover:text-white'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-12 reveal">
        {filtered.map((p, i) => (
          <div key={p.name} className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 aspect-video glass-panel">
            <img src={p.img} alt={p.name} className="w-full h-full object-cover object-center transition-all duration-1000 scale-100 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-12 flex flex-col justify-end backdrop-blur-sm">
              <div className="text-[10px] font-black text-theme tracking-[0.4em] uppercase mb-4">{p.category}</div>
              <h3 className="text-4xl font-black text-white mb-8 uppercase tracking-tighter">{p.name}</h3>
              <a href={p.link} target="_blank" className="btn-premium py-4 px-8 text-[10px]">Launch Project <i className="fas fa-arrow-right ml-2"></i></a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SkillsGrid({ stack }) {
  return (
    <section id="skills" className="section-container">
      <SectionLabel label="Technical Arsenal" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 reveal">
        {stack.map((s, i) => (
          <div key={i} className="glass-panel p-8 group hover:border-theme/40 transition-all duration-700 hover:-translate-y-2">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-theme mb-6 group-hover:scale-110 transition-transform">
              <i className="fas fa-terminal text-xs"></i>
            </div>
            <div className="text-xl font-black mb-2 uppercase tracking-tighter text-ink-900 group-hover:text-theme transition-colors">{s.name}</div>
            <div className="text-[10px] font-mono text-ink-300 uppercase tracking-[0.3em]">{s.level}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ContactForm({ email }) {
  return (
    <form action={`https://formsubmit.co/${email}`} method="POST" className="space-y-6">
      <input type="hidden" name="_subject" value="New Portfolio Message!" />
      <input type="hidden" name="_template" value="table" />
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4">Full Name</label>
          <input type="text" name="name" required placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-theme focus:outline-none transition-all" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4">Email Address</label>
          <input type="email" name="email" required placeholder="john@example.com" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-theme focus:outline-none transition-all" />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4">Message</label>
        <textarea name="message" required rows="5" placeholder="How can I help you?" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-theme focus:outline-none transition-all resize-none"></textarea>
      </div>
      
      <button type="submit" className="btn-premium w-full">Send Message</button>
    </form>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// Split Landing Components
function SplitLanding({ onSelect }) {
  return (
    <div className="split-landing">
      <div className="split-side side-engineer" onClick={() => onSelect('engineer')}>
        <div className="split-content">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/20 mb-8 mx-auto shadow-lg shadow-white/10">
            <img src="./Assets/ProfilePic.jpeg" alt="Surya K" className="w-full h-full object-cover object-top" />
          </div>
          <h2 className="text-6xl font-black mb-6">SURYA K</h2>
          <p className="text-white/40 font-bold tracking-widest mb-10 uppercase">Software Engineer</p>
          <button className="btn-premium">View Professional Work</button>
        </div>
      </div>
      <div className="split-side side-business" onClick={() => onSelect('business')}>
        <div className="split-content">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/20 mb-8 mx-auto shadow-lg shadow-white/10 bg-white">
            <img src="./Assets/Logo.jpeg" alt="DevTactix" className="w-full h-full object-contain p-2" />
          </div>
          <h2 className="text-6xl font-black mb-6">DEVTACTIX</h2>
          <p className="text-white/40 font-bold tracking-widest mb-10 uppercase">Freelance Brand</p>
          <button className="btn-premium">Start A Project</button>
        </div>
      </div>
    </div>
  );
}

// Business Side Services (Shared)
function BusinessServices() {
  const services = [
    { title: "Web Applications", icon: "fas fa-code", desc: "End-to-end scalable web systems built for performance and growth.", tags: ["React", "Node", "MongoDB"] },
    { title: "SaaS Platforms", icon: "fas fa-layer-group", desc: "Multi-tenant architectures designed for high availability and security.", tags: ["Auth", "Billing", "Tenancy"] },
    { title: "UI/UX Development", icon: "fas fa-bezier-curve", desc: "Modern, high-fidelity interfaces with a focus on conversion and retention.", tags: ["Figma", "Tailwind", "Motion"] },
    { title: "Custom Dashboards", icon: "fas fa-chart-line", desc: "Data-driven management systems with real-time analytics.", tags: ["Charts", "Realtime", "KPIs"] }
  ];
  return (
    <section className="section-container relative">
      <SectionOrbs />
      <SectionLabel label="Solutions Matrix" />
      <div className="grid lg:grid-cols-2 gap-8 reveal">
        {services.map((s, i) => (
          <div key={i} className="service-card group tilt">
            <div className="flex items-start justify-between mb-10">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl text-theme transition-all group-hover:scale-110 group-hover:border-theme/40"><i className={s.icon}></i></div>
              <span className="text-[10px] font-mono tracking-[0.3em] text-white/20">0{i + 1}</span>
            </div>
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter text-ink-900 group-hover:text-theme transition-colors">{s.title}</h3>
            <p className="leading-relaxed mb-8" style={{color: 'var(--ink-500)'}}>{s.desc}</p>
            <div className="flex flex-wrap gap-2">
              {s.tags.map(tg => (
                <span key={tg} className="text-[10px] font-bold uppercase tracking-[0.25em] px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-ink-500">{tg}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Marquee strip of rolling keywords ──────────────────────────────────────
function Marquee({ items }) {
  const seq = [...items, ...items];
  return (
    <div className="marquee-wrap reveal">
      <div className="marquee-track">
        {seq.map((s, i) => (
          <span key={i} className="marquee-item">
            <span className="marquee-dot">◆</span> {s}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Animated counter for metrics ───────────────────────────────────────────
function Counter({ to, suffix = '', duration = 1800 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const start = performance.now();
          const tick = now => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(to * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      });
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

function MetricsRow({ metrics }) {
  return (
    <section className="section-container !min-h-[60vh] relative">
      <SectionOrbs />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 reveal relative z-10">
        {metrics.map((m, i) => (
          <div key={i} className="metric-card group tilt">
            <div className="text-[10px] font-bold tracking-[0.3em] text-ink-300 uppercase mb-4">{m.label}</div>
            <div className="text-[clamp(2.5rem,4vw,3.5rem)] font-black font-outfit text-gradient leading-none mb-3"><Counter to={m.value} suffix={m.suffix || ''} /></div>
            <div className="text-sm" style={{color: 'var(--ink-500)'}}>{m.caption}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Process timeline (business) ────────────────────────────────────────────
function ProcessTimeline() {
  const steps = [
    { n: '01', title: 'Discovery', desc: 'Deep-dive into your goals, audience and constraints. Scope, budget and KPIs get defined here.' },
    { n: '02', title: 'Architecture', desc: 'Technical blueprint, database design, API contracts and UI wireframes reviewed together.' },
    { n: '03', title: 'Build Sprints', desc: 'Two-week iterations with live staging, automated tests and weekly demo reviews.' },
    { n: '04', title: 'Launch & Scale', desc: 'Production deploy, performance tuning, monitoring, and continued feature rollout.' },
  ];
  return (
    <section className="section-container relative">
      <SectionOrbs />
      <SectionLabel label="Engagement Process" />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 reveal relative z-10">
        {steps.map((s, i) => (
          <div key={s.n} className="process-card tilt">
            <div className="text-[10px] font-mono tracking-[0.3em] text-theme mb-6">PHASE {s.n}</div>
            <div className="text-5xl font-black font-outfit text-ink-100 mb-6">{s.n}</div>
            <h3 className="text-xl font-black uppercase tracking-tighter mb-4 text-ink-900">{s.title}</h3>
            <p className="leading-relaxed text-sm" style={{color: 'var(--ink-500)'}}>{s.desc}</p>
            {i < steps.length - 1 && <div className="process-arrow"><i className="fas fa-arrow-right"></i></div>}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Business Technology Stack (real, no fake client data) ─────────────────
function BusinessTech() {
  const techs = [
    { name: "React / Next.js", desc: "Modern frontend frameworks for scalable, interactive UIs." },
    { name: "Node.js / Express", desc: "Robust backend APIs, authentication, and microservices." },
    { name: "MongoDB / SQL", desc: "Flexible NoSQL and relational database architecture." },
    { name: "Three.js / WebGL", desc: "Immersive 3D web experiences and interactive visuals." },
    { name: "Tailwind / CSS", desc: "Pixel-perfect responsive design with modern aesthetics." },
    { name: "Flutter / Dart", desc: "Cross-platform mobile applications from a single codebase." },
  ];
  return (
    <section className="section-container relative">
      <SectionOrbs />
      <SectionLabel label="Technology Stack" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 reveal relative z-10">
        {techs.map((t, i) => (
          <div key={i} className="glass-panel p-8 group hover:border-theme/40 transition-all duration-700 hover:-translate-y-2">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-theme mb-6 group-hover:scale-110 transition-transform">
              <i className="fas fa-code text-xs"></i>
            </div>
            <div className="text-xl font-black mb-2 uppercase tracking-tighter text-ink-900 group-hover:text-theme transition-colors">{t.name}</div>
            <p className="text-sm leading-relaxed" style={{color: 'var(--ink-500)'}}>{t.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Achievements (engineer) ────────────────────────────────────────────────
function Achievements() {
  const items = [
    { icon: 'fas fa-rocket', title: 'Shipped 15+ Production Apps', desc: 'From multi-tenant SaaS to real-time dashboards — deployed and maintained in production.' },
    { icon: 'fas fa-shield-halved', title: 'Zero-Downtime Migrations', desc: 'Refactored legacy ERP modules while keeping business running 24/7.' },
    { icon: 'fas fa-bolt', title: 'Sub-second API Responses', desc: 'Hand-tuned MongoDB aggregations & indexes to hit p95 < 300ms targets.' },
    { icon: 'fas fa-cube', title: 'Design-System Ownership', desc: 'Built reusable component library used across 4 enterprise planning systems.' },
  ];
  return (
    <section className="section-container relative">
      <SectionOrbs />
      <SectionLabel label="Engineering Wins" />
      <div className="grid md:grid-cols-2 gap-6 reveal">
        {items.map((a, i) => (
          <div key={i} className="achievement-card group tilt">
            <div className="flex gap-6 items-start">
              <div className="achievement-icon"><i className={a.icon}></i></div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter mb-3 text-ink-900 group-hover:text-theme transition-colors">{a.title}</h3>
                <p className="leading-relaxed" style={{color: 'var(--ink-500)'}}>{a.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Cursor Logic
window.addEventListener('mousemove', e => {
  const c = document.getElementById('cursor'), f = document.getElementById('cursor-follower');
  if (c && f) { c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px'; setTimeout(() => { f.style.left = e.clientX - 15 + 'px'; f.style.top = e.clientY - 15 + 'px'; }, 100); }
});