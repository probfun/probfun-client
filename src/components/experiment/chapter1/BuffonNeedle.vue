<template>
  <Splitter class="h-full !border-0 ">
    <SplitterPanel class="pr-1.5">
      <div class="flex-1 p-3.5 border rounded-lg flex flex-col h-full">
        <div class="bg-blue-700 text-white pl-2 rounded-2xl mb-2 w-max">Buffon投针:
          <Tag value="辛钦大数定律" class="h-8 ml-2 my-2" severity="secondary"/>
          <Tag value="蒙特卡罗方法" class="h-8 mx-2 my-2" severity="secondary"/>
        </div>
        <div class="mb-2 font-bold"> 实验区 </div>
        <div ref="container" class="h-full w-full relative flex flex-col">
          <div ref="threeContainer"></div>
          <div class="flex-1 w-full flex flex-col justify-center items-center p-3">
            <div class="flex w-full justify-center space-x-3">
              <Button label="decrease" icon="pi pi-minus" iconPos="top" @click="decreaseNeedle" />
              <div class="flex flex-col justify-center space-y-2">
                <InputNumber v-model.number="needleAmount" :max="5000" />
                <Button label="ROLL" @click="addNeedles" />
              </div>
              <Button label="increase" icon="pi pi-plus" iconPos="top" @click="increaseNeedle" />
            </div>
            <div> 和线相交的针的数量：{{ hits }} </div>
            <div> 估算的 Pi 值：{{ estimatedPi }} </div>
            <div> 历史估算 Pi 值的平均值：{{ getAverageEstimatedPi() }}</div>
            <Button label="复原视角" @click="resetCameraPosition"></Button>
          </div>
        </div>
      </div>
    </SplitterPanel>
    <SplitterPanel class="pr-3 pl-1.5 h-full" :size="25">
      <Panel header="提示区" class="h-full overflow-y-auto">
        <h1 class="my-2 font-semibold">实验思路</h1>
        <div v-html="toMarkDown(content)"> </div>
        <h1 class="my-2 font-semibold">结论</h1>
        <div v-html="toMarkDown(`当横线数目固定时，随着投针次数增加，针与横线相交的概率起初有较大波动；
但当投针次数达到一定值时，平均相交概率 $$p_1$$ 逐渐趋近于 $$0.31831$$。
由辛钦大数定理可知，当投针次数不断增加直至无穷时，
随机变量 $$p$$ 的算术平均值 $$\\bar{p}$$ 不断趋向于其数学期望 $$E(p) \\approx 0.31831$$，
而 $$E(p)$$ 的倒数，即圆周率 $$\\pi$$ 的估计值趋近于 $$3.14159$$。`)">
        </div>
      </Panel>
    </SplitterPanel>
  </Splitter>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import * as OIMO from 'oimo';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {toMarkDown} from "@/utils/markdown";

const content = `
在平面上有彼此相距为 $$d$$ 的平行线，向此平面任意投一长度为 $$l$$ 的针，假定 $$l \\leq d$$（本实验中 $$l = \\frac{d}{2}$$），则所投的针至多可与一条直线相交。

在每次实验中，随机投掷 $$N$$ 根针。运用两组均匀分布，一组为 $$U \\sim (0, d)$$ 随机生成针中心到平行线的距离 $$y_{\\text{center}}$$，
一组为 $$U \\sim (0, \\pi)$$ 随机生成针与平行线的夹角 $$\\theta$$。
根据针的中心位置和角度，计算针两个端点的纵坐标 $$y_1$$ 和 $$y_2$$。
通过检查针的端点是否与间距为 $$d$$ 的平行线相交，统计相交事件的次数 $$n$$，
通过 $$\\frac{2lN}{dn}$$ 来估计 $$\\pi$$ 的值。

针与线相交的概率：$$P = \\frac{2l}{\\pi d} \\approx \\frac{n}{N}$$

$$
\\pi = \\frac{2l}{Pd}
$$

$$
\\pi \\text{估计值} \\approx \\frac{2lN}{dn}
$$

`;

const container = ref<HTMLDivElement | null>(null);
const threeContainer = ref<HTMLElement | null>(null);
const width = ref(window.innerWidth);
const height = ref(Math.min(window.innerHeight, 800));
let composer: EffectComposer;
let body: OIMO.RigidBody;
let isRotating = false;
let needles: { model: THREE.Object3D; body: OIMO.RigidBody }[] = [];
let needleAmount = ref(1000);
let accumulator = 0;
let lastTime = 0;

const fixedTimeStep = 1 / 120; // 120 Hz
const defaultCameraPosition = new THREE.Vector3(0, 60, 0);

const needleLength = 2;  // 针的长度
const floorLineSpacing = 5;  // 地板线之间的间隔
let hits = 0;
const estimatedPi = ref(0);
const historyEstimatedPi = ref<number[]>([]);

const world = new OIMO.World({
  timestep: 1 / 60,
  iterations: 8,
  broadphase: 2,
  worldscale: 1,
  random: true,
  info: false,
  gravity: [0, -9.8 * 3, 0],
});

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.setSize(width.value, height.value);
renderer.setClearColor(0xffffff);
renderer.setPixelRatio(window.devicePixelRatio || 1);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, width.value / height.value, 0.1, 1000);
const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 60, 0);
orbit.minPolarAngle = 0;
orbit.maxPolarAngle = (Math.PI / 2) - 0.1;
orbit.enableDamping = true;
orbit.dampingFactor = 0.05;
orbit.rotateSpeed = 0.5;
orbit.enablePan = false;
orbit.enableZoom = false;
orbit.update();

const planeGeometry = new THREE.PlaneGeometry(200, 200);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

for (let i = -40; i <= 40; i += floorLineSpacing) {
  const lineGeometry = new THREE.PlaneGeometry(200, 0.1);
  const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  const line = new THREE.Mesh(lineGeometry, lineMaterial);
  line.rotation.x = -0.5 * Math.PI;
  line.position.set(0, 0.01, i); // slightly above the plane
  scene.add(line);
}

const ambientLight = new THREE.AmbientLight(0xfaf9eb, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xfaf9eb, 2.5);
scene.add(directionalLight);

const lightTarget = new THREE.Object3D();
scene.add(lightTarget);
lightTarget.position.set(0, 0, 0);

directionalLight.position.set(-30, 50, -30);
directionalLight.target = lightTarget;
directionalLight.castShadow = true;

directionalLight.shadow.camera.left = -20;
directionalLight.shadow.camera.right = 20;
directionalLight.shadow.camera.top = 20;
directionalLight.shadow.camera.bottom = -20;

directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.bias = -0.0005;

function getAverageEstimatedPi() {
  if (historyEstimatedPi.value.length === 0) return 0; // 防止数组为空时出现除以零的情况
  const sum = historyEstimatedPi.value.reduce((acc, curr) => acc + curr, 0); // 使用 reduce 计算数组元素总和
  return sum / historyEstimatedPi.value.length;
}

function createNeedle(x: number, y: number, z: number): Promise<{ model: THREE.Object3D; body: OIMO.RigidBody }> {
  return new Promise((resolve, reject) => {
    const assetLoader = new GLTFLoader();
    assetLoader.load(
      '/Chopstick.glb',
      // "https://dl.dropboxusercontent.com/scl/fi/n0ogooke4kstdcwo7lryy/needle_highres_red.glb?rlkey=i15sotl674m294bporeumu5d3&st=fss6qosg",
      (gltf) => {
        const model = gltf.scene;
        scene.add(model);
        model.position.set(0, 5, 0);
        model.castShadow = true;
        model.scale.set(10, 10, 10);

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            (child as THREE.Mesh).castShadow = true;
          }
        });

        const body = world.add({
          type: 'box',
          size: [0.01, 2, 0.01],
          pos: [x, y, z],
          rot: [Math.floor(Math.random() * 360), Math.floor(Math.random() * 360), Math.floor(Math.random() * 360)],
          move: true,
          density: 2,
          friction: 0.5,
          restitution: 0.9,
          belongsTo: 1,
          collidesWith: 0xfffffffe,
        });

        resolve({ model, body });
      },
      undefined,
      (err) => {
        console.error(err);
        reject(err);
      }
    );
  });
}

function removeNeedles() {
  needles.forEach((needle) => {
    scene.remove(needle.model);
    world.clear();
  });
  needles = [];
}

function getRandomPosition() {
  return {
    x: Math.random() * 50 - 25,
    y: 10,
    z: Math.random() * 50 - 25,
  };
}

function checkIntersection(needle: { model: THREE.Object3D; body: OIMO.RigidBody }) {
  const position = needle.body.getPosition();
  const direction = new THREE.Vector3();
  needle.model.getWorldDirection(direction);
  const directionXZ = new THREE.Vector2(direction.x, direction.z).normalize();

  const cosTheta = Math.abs(directionXZ.x);
  const x1 = position.z - (needleLength / 2) * cosTheta;
  const x2 = position.z + (needleLength / 2) * cosTheta;

  if (Math.floor(x1 / floorLineSpacing) !== Math.floor(x2 / floorLineSpacing)) {
    hits++;
  }
}

async function addNeedles() {
  removeNeedles();
  world.add({
    type: 'box',
    size: [100, 1, 100],
    pos: [0, -0.5, 0],
    rot: [0, 0, 0],
    move: false,
    density: 1,
    belongsTo: 2,
  });
  hits = 0;

  const needleCount = needleAmount.value;
  const needlePromises = [];
  for (let i = 0; i < needleCount; i++) {
    const position = getRandomPosition();
    needlePromises.push(createNeedle(position.x, position.y, position.z));
  }

  Promise.all(needlePromises).then((newNeedles) => {
    needles = newNeedles;
  });

  setTimeout(() => {
    needles.forEach(checkIntersection);
    estimatedPi.value = (2 * needleLength * needleAmount.value) / (hits * floorLineSpacing);
    historyEstimatedPi.value.push(estimatedPi.value);
  }, 3000);

}

function animate(time: number) {
  if (lastTime) {
    const deltaTime = (time - lastTime) / 1000;
    accumulator += deltaTime;
    while (accumulator >= fixedTimeStep) {
      world.step(fixedTimeStep);
      accumulator -= fixedTimeStep;
    }

    needles.forEach((needle) => {
      const position = needle.body.getPosition();
      const quaternion = needle.body.getQuaternion();
      needle.model.position.set(position.x, position.y, position.z);
      needle.model.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
    });
  }

  lastTime = time;

  orbit.update();
  composer.render();
}

function resizeUpdate() {
  if (container.value) {
    width.value = container.value.clientWidth;
    height.value = 800;
    camera.updateProjectionMatrix();
    camera.aspect = width.value / height.value;
    renderer.setSize(width.value, height.value);
  }
}

function resetCameraPosition() {
  if (!isRotating) {
    isRotating = true;
    gsap.to(camera.position, {
      x: defaultCameraPosition.x,
      y: defaultCameraPosition.y,
      z: defaultCameraPosition.z,
      duration: 0.5,
      ease: 'power2.inOut',
      onUpdate: function () {
        camera.lookAt(scene.position);
      },
      onComplete: function () {
        isRotating = false;
      },
    });
  }
}

function initPostProcessing() {
  composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const bloomPass = new UnrealBloomPass(new THREE.Vector2(width.value, height.value), 0.2, 0.2, 0.85);
  composer.addPass(bloomPass);
}

onMounted(() => {
  if (threeContainer.value) {
    threeContainer.value.appendChild(renderer.domElement);
    initPostProcessing();
    addNeedles();
    renderer.setAnimationLoop(animate);
    resizeUpdate();
  }

  const observer = new ResizeObserver(resizeUpdate);
  observer.observe(container.value as HTMLElement);
});

onBeforeUnmount(() => {
  if (container.value) {
    const observer = new ResizeObserver(resizeUpdate);
    observer.unobserve(container.value);
  }
});

function decreaseNeedle() {
  needleAmount.value = Math.max(--needleAmount.value, 1);
}

function increaseNeedle() {
  needleAmount.value = Math.min(++needleAmount.value, 1000);
}
</script>

<style scoped></style>
