import "./style.css";
import * as dat from "dat.gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import firefliesVertexShader from "./shaders/fireflies/vertex.glsl";
import firefliesFragmentShader from "./shaders/fireflies/fragment.glsl";
import portalVertexShader from "./shaders/portal/vertex.glsl";
import portalFragmentShader from "./shaders/portal/fragment.glsl";

/**
 * Spector JS
 */
const SPECTOR = require("spectorjs");
const spector = new SPECTOR.Spector();
// spector.displayUI();

/**
 * Base
 */
// Debug

const debugObj = {};

const gui = new dat.GUI({
  width: 400,
});

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader();

// Draco loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("draco/");

// GLTF loader
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

/**
 * textures
 */
const bakedTexture = textureLoader.load("baked.png");
bakedTexture.flipY = false;
bakedTexture.encoding = THREE.sRGBEncoding;

const alphaTexture = textureLoader.load("alpha.png");
alphaTexture.flipY = false;

/**
 * Object
 */
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial()
);

// scene.add(cube);

/**
 * Material
 */
// baked material
const bakedMaterial = new THREE.MeshBasicMaterial({
  map: bakedTexture,
  alphaMap: alphaTexture,
  transparent: true,
  side: THREE.DoubleSide,
});

/**
 * light material
 */
const lightMaterial = new THREE.MeshBasicMaterial({
  color: 0xfceea7,
});

debugObj.portalColorStart = "#ffffff";
debugObj.portalColorEnd = "#7898f5";

gui.addColor(debugObj, "portalColorStart").onChange(() => {
  portalMaterial.uniforms.uColorStart.value.set(debugObj.portalColorStart);
});
gui.addColor(debugObj, "portalColorEnd").onChange(() => {
  portalMaterial.uniforms.uColorEnd.value.set(debugObj.portalColorEnd);
});

const portalMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: {
      value: 0,
    },
    uColorStart: { value: new THREE.Color(debugObj.portalColorStart) },
    uColorEnd: { value: new THREE.Color(debugObj.portalColorEnd) },
  },
  vertexShader: portalVertexShader,
  fragmentShader: portalFragmentShader,
});

const paperLightMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffe5,
});

/**
 * Model
 */

gltfLoader.load("scene.glb", (gltf) => {
  gltf.scene.traverse((child) => {
    // console.log(child);
    // child.material = bakedMaterial;
    // child.material.side = THREE.DoubleSide;
    child.position.y = -0.5;
  });

  const bakedMesh = gltf.scene.children.find(
    (child) => child.name === "baked_Geo"
  );

  // lamp lights
  const lampLight001 = gltf.scene.children.find(
    (child) => child.name === "lampGlass_Geo"
  );
  const lampLight002 = gltf.scene.children.find(
    (child) => child.name === "lampGlass001_Geo"
  );
  const lampLight003 = gltf.scene.children.find(
    (child) => child.name === "lampGlass002_Geo"
  );
  const lampLight004 = gltf.scene.children.find(
    (child) => child.name === "lampGlass003_Geo"
  );

  const portalLight = gltf.scene.children.find(
    (child) => child.name === "portal_Geo"
  );

  // paper lights
  const paperLight001 = gltf.scene.children.find(
    (child) => child.name === "paperLight001_Geo"
  );
  const paperLight002 = gltf.scene.children.find(
    (child) => child.name === "paperLight002_Geo"
  );
  const paperLight003 = gltf.scene.children.find(
    (child) => child.name === "paperLight003_Geo"
  );
  const paperLight004 = gltf.scene.children.find(
    (child) => child.name === "paperLight004_Geo"
  );
  const paperLight005 = gltf.scene.children.find(
    (child) => child.name === "paperLight005_Geo"
  );
  const paperLight006 = gltf.scene.children.find(
    (child) => child.name === "paperLight006_Geo"
  );
  const paperLight007 = gltf.scene.children.find(
    (child) => child.name === "paperLight007_Geo"
  );

  // assigning material
  bakedMesh.material = bakedMaterial;

  paperLight001.material = paperLightMaterial;
  paperLight002.material = paperLightMaterial;
  paperLight003.material = paperLightMaterial;
  paperLight004.material = paperLightMaterial;
  paperLight005.material = paperLightMaterial;
  paperLight006.material = paperLightMaterial;
  paperLight007.material = paperLightMaterial;

  lampLight001.material = lightMaterial;
  lampLight002.material = lightMaterial;
  lampLight003.material = lightMaterial;
  lampLight004.material = lightMaterial;

  portalLight.material = portalMaterial;

  scene.add(gltf.scene);
});

/**
 * Fireflies
 */
const fireFliesGeo = new THREE.BufferGeometry();
const fireFliesCount = 60;
const positionArr = new Float32Array(fireFliesCount * 3);
const scaleArr = new Float32Array(fireFliesCount);

for (let i = 0; i < fireFliesCount; i++) {
  positionArr[i * 3 + 0] = (Math.random() - 0.5) * 10;
  positionArr[i * 3 + 1] = Math.random() * 5.5;
  positionArr[i * 3 + 2] = (Math.random() - 0.5) * 10;

  scaleArr[i] = Math.random();
}

fireFliesGeo.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArr, 3)
);
fireFliesGeo.setAttribute("aScale", new THREE.BufferAttribute(scaleArr, 1));

// Material
const fireFliesMat = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uSize: { value: 200 },
  },
  transparent: true,
  vertexShader: firefliesVertexShader,
  fragmentShader: firefliesFragmentShader,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

gui
  .add(fireFliesMat.uniforms.uSize, "value")
  .min(0)
  .max(500)
  .step(1)
  .name("firefliesSize");

// Points
const fireflies = new THREE.Points(fireFliesGeo, fireFliesMat);
scene.add(fireflies);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // update fireflies
  fireFliesMat.uniforms.uPixelRatio.value = Math.min(
    window.devicePixelRatio,
    2
  );
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 9;
camera.position.y = 5;
camera.position.z = 9;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;

debugObj.clearColor = "#0a1425";
renderer.setClearColor(debugObj.clearColor);
gui.addColor(debugObj, "clearColor").onChange(() => {
  renderer.setClearColor(debugObj.clearColor);
});
/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // update material
  fireFliesMat.uniforms.uTime.value = elapsedTime;
  portalMaterial.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
