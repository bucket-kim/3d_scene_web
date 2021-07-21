import "./style.css";
import * as dat from "dat.gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

/**
 * Spector JS
 */
const SPECTOR = require("spectorjs");
const spector = new SPECTOR.Spector();
spector.displayUI();

/**
 * Base
 */
// Debug
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
});

/**
 * light material
 */
const lightMaterial = new THREE.MeshBasicMaterial({
  color: 0xfceea7,
});

const portalMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
});

const paperLightMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffe5,
});

/**
 * Model
 */

gltfLoader.load("scene.glb", (gltf) => {
  // gltf.scene.traverse((child) => {
  //   // console.log(child);
  //   child.material = bakedMaterial;
  //   child.material.side = THREE.DoubleSide;
  //   child.position.y = -0.5;
  // });

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
/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
