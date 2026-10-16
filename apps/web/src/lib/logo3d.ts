// The 3D logo of the story section (DESIGN.md → Story Scroll). A real model, not an image:
// it flips with its own choreography per move (src/lib/story-scroll.ts) and looks at the cursor.
// Loaded with a dynamic import only on desktop with motion allowed, so mobile never downloads three.js.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { cursorLook, damp, FOLLOW_RATE } from './logo-look';
import type { StoryFrame } from './story-scroll';

const FOV = 35;
const CAMERA_Z = 6;
/** How far toward the camera the logo is lifted at the middle of its somersault (world units; camera is 6 away). */
const LIFT_WORLD = 1.4;
/** Light levels at full brightness. Kept low so the black plate stays black and the red stays red. */
const ENV_INTENSITY = 0.45;
const KEY_INTENSITY = 1.0;
const RIM_INTENSITY = 1.8;
const EXPOSURE = 0.85;

const rad = THREE.MathUtils.degToRad;

export interface View {
  /** Stage width in px: the logo offset is a fraction of it. */
  vw: number;
  /** Height the logo should have on screen at scale 1, in px. */
  logoHeightPx: number;
}

export interface Logo3D {
  setFrame(frame: StoryFrame, view: View): void;
  dispose(): void;
}

export async function mountLogo3D(container: HTMLElement, modelUrl: string): Promise<Logo3D> {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = EXPOSURE;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'display:block;width:100%;height:100%';
  container.append(canvas);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = ENV_INTENSITY;

  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
  camera.position.set(0, 0, CAMERA_Z);

  const key = new THREE.DirectionalLight(0xffffff, KEY_INTENSITY);
  key.position.set(3, 4, 5);
  const rim = new THREE.DirectionalLight(0xff2020, RIM_INTENSITY);
  rim.position.set(-4, -2, -3);
  scene.add(key, rim);

  // Model → upright (the Blender export lies flat: extruded along +Y, artwork in the XZ plane) → fit (scale)
  // → pose (position and rotation, driven by the choreography and the cursor).
  const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(modelUrl);
  const upright = new THREE.Group();
  upright.rotation.x = Math.PI / 2;
  upright.add(gltf.scene);
  upright.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(upright);
  const size = box.getSize(new THREE.Vector3());
  upright.position.sub(box.getCenter(new THREE.Vector3()));
  const fit = new THREE.Group();
  fit.add(upright);
  const pose = new THREE.Group();
  pose.rotation.order = 'YXZ';
  pose.add(fit);
  scene.add(pose);

  // ── Layout ─────────────────────────────────────────────────────────────────────────────────
  let width = 1;
  let height = 1;
  const layout = () => {
    width = Math.max(container.clientWidth, 1);
    height = Math.max(container.clientHeight, 1);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  layout();

  // ── Cursor ─────────────────────────────────────────────────────────────────────────────────
  const pointer = { x: 0, y: 0 }; // −1 … 1 across the stage
  const onPointerMove = (event: PointerEvent) => {
    const rect = container.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
    pointer.y = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1;
  };
  const onPointerLeave = () => {
    pointer.x = 0;
    pointer.y = 0;
  };
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onPointerLeave);

  // ── Frame loop ─────────────────────────────────────────────────────────────────────────────
  let current: { frame: StoryFrame; view: View } | null = null;
  const look = { yaw: 0, pitch: 0, driftX: 0, driftY: 0 };
  let last = performance.now();

  const draw = () => {
    const now = performance.now();
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!current) return;
    const { frame, view } = current;

    // Follow the cursor, eased; the look fades out while the logo is flipping.
    const target = cursorLook(pointer.x, pointer.y, frame.logoMotion);
    look.yaw = damp(look.yaw, target.yaw, FOLLOW_RATE, dt);
    look.pitch = damp(look.pitch, target.pitch, FOLLOW_RATE, dt);
    look.driftX = damp(look.driftX, target.driftX, FOLLOW_RATE, dt);
    look.driftY = damp(look.driftY, target.driftY, FOLLOW_RATE, dt);

    const worldHeight = 2 * CAMERA_Z * Math.tan(rad(FOV / 2));
    const pxToWorld = worldHeight / height;
    const logoWorldHeight = view.logoHeightPx * pxToWorld;
    fit.scale.setScalar((logoWorldHeight / size.y) * frame.logoScale);

    pose.position.set(
      frame.logoX * view.vw * pxToWorld + look.driftX * logoWorldHeight,
      look.driftY * logoWorldHeight,
      frame.logoLift * LIFT_WORLD,
    );
    pose.rotation.set(rad(frame.logoPose.x + look.pitch), rad(frame.logoPose.y + look.yaw), rad(frame.logoPose.z));

    // Dimming (scene C puts the cards in front): scale the lights, not the materials. Transparent layers
    // would show through each other, and the environment light ignores per-material settings.
    const dim = frame.logoOpacity ** 1.4;
    scene.environmentIntensity = ENV_INTENSITY * dim;
    key.intensity = KEY_INTENSITY * dim;
    rim.intensity = RIM_INTENSITY * dim;

    canvas.dataset.yaw = look.yaw.toFixed(2);
    canvas.dataset.pitch = look.pitch.toFixed(2);
    renderer.render(scene, camera);
  };

  // Render only while the story stage is on screen.
  let running = false;
  const setRunning = (on: boolean) => {
    if (on === running) return;
    running = on;
    if (on) last = performance.now();
    renderer.setAnimationLoop(on ? draw : null);
  };
  const visibility = new IntersectionObserver(([entry]) => setRunning(Boolean(entry?.isIntersecting)));
  visibility.observe(container);
  const resize = new ResizeObserver(layout);
  resize.observe(container);

  return {
    setFrame(frame, view) {
      const first = current === null;
      current = { frame, view };
      if (first) draw(); // first picture right away, so the 2D fallback can be hidden without a blank
    },
    dispose() {
      setRunning(false);
      visibility.disconnect();
      resize.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      renderer.dispose();
      pmrem.dispose();
      canvas.remove();
    },
  };
}
