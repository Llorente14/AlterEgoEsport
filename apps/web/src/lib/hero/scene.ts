// Desktop hero: particles and sakura petals flow right to left and gather into the 3D logo.
// Loaded with a dynamic import only on desktop with motion allowed, so mobile never downloads three.js.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { attraction, logoOpacity, scrollEffect, wrapLeft } from './cycle';

interface HeroOptions {
  modelUrl: string;
  /** The 2D logo the 3D logo replaces; its box decides where the 3D logo sits and how big it is. */
  anchor: HTMLElement;
  /** The hero section, for scroll progress. */
  section: HTMLElement;
}

const FOV = 35;
const CAMERA_Z = 6;
const PARTICLES = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4 ? 3000 : 5000;
const BOUND_SHARE = 0.6;
const RELEASED_SHARE = 0.3;
const PETALS = 80;
const REPEL_RADIUS = 0.45; // ≈120px at 1080p
const PALETTE: [THREE.Color, number][] = [
  [new THREE.Color('#ffffff'), 0.55],
  [new THREE.Color('#ee2b20'), 0.3],
  [new THREE.Color('#9a9a9a'), 0.15],
];

function pickColor(): THREE.Color {
  let r = Math.random();
  for (const [color, share] of PALETTE) {
    if ((r -= share) <= 0) return color;
  }
  return PALETTE[0]![0];
}

function triangleGeometry(): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  const h = Math.sqrt(3) / 2;
  g.setAttribute('position', new THREE.Float32BufferAttribute([0, h * 0.66, 0, -0.5, -h * 0.33, 0, 0.5, -h * 0.33, 0], 3));
  return g;
}

function petalGeometry(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(0, -0.5);
  s.quadraticCurveTo(0.55, -0.1, 0.12, 0.5);
  s.lineTo(0, 0.4); // the notch at the petal tip
  s.lineTo(-0.12, 0.5);
  s.quadraticCurveTo(-0.55, -0.1, 0, -0.5);
  return new THREE.ShapeGeometry(s, 6);
}

/** Total surface area, used to spread samples over the logo's meshes evenly. */
function surfaceArea(geometry: THREE.BufferGeometry): number {
  const pos = geometry.getAttribute('position');
  const index = geometry.getIndex();
  const count = index ? index.count : pos.count;
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const tri = new THREE.Triangle();
  let area = 0;
  for (let i = 0; i < count; i += 3) {
    const [ia, ib, ic] = index ? [index.getX(i), index.getX(i + 1), index.getX(i + 2)] : [i, i + 1, i + 2];
    tri.set(a.fromBufferAttribute(pos, ia), b.fromBufferAttribute(pos, ib), c.fromBufferAttribute(pos, ic));
    area += tri.getArea();
  }
  return area;
}

export async function mountHero(layer: HTMLElement, options: HeroOptions): Promise<() => void> {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  renderer.domElement.style.display = 'block';
  layer.append(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
  camera.position.set(0, 0, CAMERA_Z);

  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(3, 4, 5);
  const rim = new THREE.DirectionalLight(0xff2020, 2.5);
  rim.position.set(-4, -2, -3);
  scene.add(key, rim);

  // --- Logo -----------------------------------------------------------------------------------
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const gltf = await loader.loadAsync(options.modelUrl);
  // The Blender export lies flat (extrusion along +Y, artwork in the XZ plane, top at -Z).
  // Stand it up so the face points at the camera.
  const logo = new THREE.Group();
  logo.rotation.x = Math.PI / 2;
  logo.add(gltf.scene);
  const box = new THREE.Box3().setFromObject(logo);
  const size = box.getSize(new THREE.Vector3());
  logo.position.sub(box.getCenter(new THREE.Vector3()));
  const fit = new THREE.Group(); // scaled to the anchor height
  fit.add(logo);
  const pivot = new THREE.Group(); // positioned at the anchor, floats and turns
  pivot.add(fit);
  scene.add(pivot);

  const materials: THREE.Material[] = [];
  const meshes: THREE.Mesh[] = [];
  logo.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      meshes.push(obj);
      for (const m of Array.isArray(obj.material) ? obj.material : [obj.material]) {
        m.transparent = true;
        m.opacity = 0;
        materials.push(m);
      }
    }
  });

  // Target points on the logo surface, in `fit` space, so they follow its scale, float and turn.
  const boundCount = Math.floor(PARTICLES * BOUND_SHARE);
  const targets = new Float32Array(boundCount * 3);
  {
    pivot.updateMatrixWorld(true);
    const fitInverse = fit.matrixWorld.clone().invert();
    const areas = meshes.map((m) => surfaceArea(m.geometry));
    const totalArea = areas.reduce((s, a) => s + a, 0) || 1;
    const point = new THREE.Vector3();
    let written = 0;
    meshes.forEach((mesh, i) => {
      const share = i === meshes.length - 1 ? boundCount - written : Math.round((areas[i]! / totalArea) * boundCount);
      if (share <= 0) return;
      const sampler = new MeshSurfaceSampler(mesh).build();
      const toFit = fitInverse.clone().multiply(mesh.matrixWorld);
      for (let k = 0; k < share && written < boundCount; k++, written++) {
        sampler.sample(point);
        point.applyMatrix4(toFit);
        targets.set([point.x, point.y, point.z], written * 3);
      }
    });
  }

  // Released particles: the 30% of bound particles furthest to the right of the logo.
  const released = new Uint8Array(PARTICLES);
  {
    const order = Array.from({ length: boundCount }, (_, i) => i).sort((a, b) => targets[b * 3]! - targets[a * 3]!);
    for (const i of order.slice(0, Math.floor(boundCount * RELEASED_SHARE))) released[i] = 1;
  }

  // --- Layout ---------------------------------------------------------------------------------
  const bounds = { minX: -5, maxX: 5, minY: -2, maxY: 2 };
  let logoBaseY = 0;
  let logoHeight = 1;

  const toWorld = (clientX: number, clientY: number, rect: DOMRect, out: THREE.Vector3) => {
    const ndc = new THREE.Vector3(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1, 0.5);
    ndc.unproject(camera).sub(camera.position).normalize();
    return out.copy(camera.position).addScaledVector(ndc, -camera.position.z / ndc.z);
  };

  const layout = () => {
    const rect = layer.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / Math.max(rect.height, 1);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld(); // unproject() below needs it before the first render

    const height = 2 * CAMERA_Z * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const width = height * camera.aspect;
    Object.assign(bounds, { minX: -width / 2 - 0.3, maxX: width / 2 + 0.3, minY: -height / 2 - 0.2, maxY: height / 2 + 0.2 });

    const a = options.anchor.getBoundingClientRect();
    const center = toWorld(a.left + a.width / 2, a.top + a.height / 2, rect, new THREE.Vector3());
    const top = toWorld(a.left + a.width / 2, a.top, rect, new THREE.Vector3());
    logoHeight = Math.max((top.y - center.y) * 2, 0.5);
    fit.scale.setScalar(logoHeight / size.y);
    pivot.position.x = center.x;
    logoBaseY = center.y;
  };

  // --- Particles and petals -------------------------------------------------------------------
  const particleMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, toneMapped: false });
  const particles = new THREE.InstancedMesh(triangleGeometry(), particleMaterial, PARTICLES);
  const petalMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, toneMapped: false });
  const petals = new THREE.InstancedMesh(petalGeometry(), petalMaterial, PETALS);
  scene.add(particles, petals);

  layout();

  const total = PARTICLES + PETALS;
  const free = new Float32Array(total * 3);
  const speed = new Float32Array(total);
  const slope = new Float32Array(total);
  const scale = new Float32Array(total);
  const phase = new Float32Array(total);
  const prevAttraction = new Float32Array(PARTICLES);

  for (let i = 0; i < total; i++) {
    const petal = i >= PARTICLES;
    free[i * 3] = THREE.MathUtils.lerp(bounds.minX, bounds.maxX, Math.random());
    free[i * 3 + 1] = THREE.MathUtils.lerp(bounds.minY, bounds.maxY, Math.random());
    free[i * 3 + 2] = THREE.MathUtils.lerp(-1.5, 1, Math.random());
    speed[i] = THREE.MathUtils.lerp(0.4, 1.2, Math.random()) * (petal ? 0.6 : 1);
    slope[i] = Math.tan(THREE.MathUtils.degToRad(THREE.MathUtils.lerp(-8, 8, Math.random())));
    scale[i] = petal ? THREE.MathUtils.lerp(0.035, 0.07, Math.random()) : THREE.MathUtils.lerp(0.008, 0.025, Math.random());
    phase[i] = Math.random() * Math.PI * 2;
    if (petal) petals.setColorAt(i - PARTICLES, Math.random() < 0.6 ? PALETTE[1]![0] : PALETTE[0]![0]);
    else particles.setColorAt(i, pickColor());
  }

  // --- Input ----------------------------------------------------------------------------------
  const pointer = new THREE.Vector3();
  let pointerActive = false;
  const onPointerMove = (e: PointerEvent) => {
    const rect = layer.getBoundingClientRect();
    pointerActive = e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (pointerActive) toWorld(e.clientX, e.clientY, rect, pointer);
  };
  const onPointerLeave = () => (pointerActive = false);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('pointerleave', onPointerLeave);

  let scrollProgress = 0;
  const onScroll = () => {
    const r = options.section.getBoundingClientRect();
    scrollProgress = Math.min(Math.max(-r.top / Math.max(r.height, 1), 0), 1);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // --- Frame loop -----------------------------------------------------------------------------
  let last = performance.now();
  const dummy = new THREE.Object3D();
  const target = new THREE.Vector3();
  let elapsed = 0;

  const frame = () => {
    const now = performance.now();
    // Clamp long gaps (background tab, slow frame) so particles never jump across the screen.
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    elapsed += dt;
    const { flowScale, logoTurn } = scrollEffect(scrollProgress);

    pivot.position.y = logoBaseY + Math.sin(elapsed * 1.2) * 0.05 + scrollProgress * logoHeight * 0.3;
    pivot.rotation.y = Math.sin(elapsed * 0.5) * 0.15 + logoTurn;
    pivot.updateMatrixWorld(true);
    const opacity = logoOpacity(elapsed);
    for (const m of materials) m.opacity = opacity;

    for (let i = 0; i < total; i++) {
      const o = i * 3;
      const petal = i >= PARTICLES;

      // Wind: right to left with a slight slope and a gentle wave.
      free[o] = wrapLeft(free[o]! - speed[i]! * flowScale * dt, bounds.minX, bounds.maxX);
      let y = free[o + 1]! - speed[i]! * slope[i]! * flowScale * dt + Math.sin(phase[i]! + elapsed * 0.6) * 0.06 * dt;
      if (y < bounds.minY) y = bounds.maxY;
      if (y > bounds.maxY) y = bounds.minY;
      free[o + 1] = y;

      let x = free[o]!;
      let z = free[o + 2]!;
      y = free[o + 1]!;

      if (!petal && i < boundCount) {
        const a = attraction(elapsed, released[i] === 1);
        target.fromArray(targets, o).applyMatrix4(fit.matrixWorld);
        // A released particle leaves from where it sat on the logo, not from its old wind position.
        if (released[i] && prevAttraction[i]! >= 0.999 && a < 0.999) {
          free[o] = target.x;
          free[o + 1] = target.y;
          free[o + 2] = target.z;
          x = target.x;
          y = target.y;
          z = target.z;
        }
        prevAttraction[i] = a;
        const jitter = Math.sin(phase[i]! + elapsed * 2) * 0.006 * a;
        x = THREE.MathUtils.lerp(x, target.x, a) + jitter;
        y = THREE.MathUtils.lerp(y, target.y, a) + jitter;
        z = THREE.MathUtils.lerp(z, target.z, a);
      }

      if (pointerActive) {
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const d = Math.hypot(dx, dy);
        if (d < REPEL_RADIUS && d > 1e-4) {
          const push = ((REPEL_RADIUS - d) / REPEL_RADIUS) * 0.35;
          x += (dx / d) * push;
          y += (dy / d) * push;
        }
      }

      dummy.position.set(x, y, z);
      if (petal) dummy.rotation.set(elapsed * 0.7 + phase[i]!, elapsed * 0.5 + phase[i]!, elapsed * 0.3);
      else dummy.rotation.set(0, 0, phase[i]! + elapsed * 0.4);
      dummy.scale.setScalar(scale[i]!);
      dummy.updateMatrix();
      if (petal) petals.setMatrixAt(i - PARTICLES, dummy.matrix);
      else particles.setMatrixAt(i, dummy.matrix);
    }
    particles.instanceMatrix.needsUpdate = true;
    petals.instanceMatrix.needsUpdate = true;
    renderer.render(scene, camera);
  };

  // Render only while the hero is on screen.
  let running = false;
  const setRunning = (on: boolean) => {
    if (on === running) return;
    running = on;
    if (on) last = performance.now();
    renderer.setAnimationLoop(on ? frame : null);
  };
  const visibility = new IntersectionObserver(([entry]) => setRunning(Boolean(entry?.isIntersecting)));
  visibility.observe(layer);
  const resize = new ResizeObserver(() => layout());
  resize.observe(layer);

  frame();

  return () => {
    setRunning(false);
    visibility.disconnect();
    resize.disconnect();
    window.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerleave', onPointerLeave);
    window.removeEventListener('scroll', onScroll);
    renderer.dispose();
    pmrem.dispose();
    renderer.domElement.remove();
  };
}
