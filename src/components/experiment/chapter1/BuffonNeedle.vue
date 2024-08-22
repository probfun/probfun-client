<template>
  <experiment-board title="Buffon投针" :tags="['辛钦大数定律', '蒙特卡罗方法']">
    <template #experiment>
      <div ref="container" class="h-3/5 overflow-auto">
        <div ref="threeContainer"  :class="curOption.value === 0 ? '' : 'hidden'" />
        <div class="bg-indigo-600" :class="curOption.value === 1 ? '' : 'hidden'">
          <canvas ref="canvas" class="w-full" height="400"></canvas>
        </div>
      </div>
      <div class="w-full flex-1 flex justify-center items-center space-x-3">
        <div class="flex flex-col items-center flex-1">
          <SelectButton v-model="curOption" :options="options" optionLabel="label" aria-labelledby="basic" class="mb-6" :allowEmpty="false" :disabled="isSimulating || isCalculating" @change="change" />
          <div class="flex w-full justify-center space-x-3 mb-2">
            <FloatLabel>
              <InputText class="w-24" v-model.number="needleAmount" :max="5000" />
              <label for="username">抛针数量</label>
            </FloatLabel>
            <Button label="抛针" @click="addNeedles" :disabled="isCalculating || isSimulating" />
            <Button :label="isSimulating ? '停止模拟' : '自动模拟'" @click="isSimulating ? endSimulate() : startSimulate()" />
          </div>
          <div class="text-start">
            <div > 和线相交的针的数量：{{ hits }} </div>
            <div> 估算的 Pi 值：{{ estimatedPi.toFixed(5) }} </div>
            <div> 历史估算 Pi 值的平均值：{{ getAverageEstimatedPi().toFixed(5) }}</div>
          </div>
        </div>
        <div class="flex-1 h-full flex items-center">
          <chart type="line" :data="chartData" class="w-full" height="200" :options="chartOptions" />
        </div>
      </div>
    </template>

    <template #hint>
      <h1 class="my-2 font-semibold">实验思路</h1>
      <div v-html="toMarkDown(content)" class="markdown-format text-indigo-800"> </div>
      <h1 class="my-2 font-semibold">结论</h1>
      <div v-html="toMarkDown(`当横线数目固定时，随着投针次数增加，针与横线相交的概率起初有较大波动；
但当投针次数达到一定值时，平均相交概率 $p_1$ 逐渐趋近于 $0.31831$。
由辛钦大数定理可知，当投针次数不断增加直至无穷时，
随机变量 $p$ 的算术平均值 $\\bar{p}$ 不断趋向于其数学期望 $E(p) \\approx 0.31831$，
而 $E(p)$ 的倒数，即圆周率 $\\pi$ 的估计值趋近于 $3.14159$。`)" class="markdown-format">
      </div>
    </template>
  </experiment-board>
</template>

<script setup lang="ts">
import ExperimentBoard from "@/components/experiment/ExperimentBoard.vue";
import {ref, onMounted, onBeforeUnmount, watch} from 'vue';
import * as THREE from 'three';
import * as OIMO from 'oimo';
// import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {toMarkDown} from "@/utils/markdown";
import {PI} from "chart.js/helpers";

const content = `
在平面上有彼此相距为 $d$ 的平行线，向此平面任意投一长度为 $l$ 的针，假定 $l \\leq d$（本实验中 $l = \\frac{d}{2}$），则所投的针至多可与一条直线相交。

在每次实验中，随机投掷 $N$ 根针。运用两组均匀分布，一组为 $U \\sim (0, d)$ 随机生成针中心到平行线的距离 $y_{\\text{center}}$，
一组为 $U \\sim (0, \\pi)$ 随机生成针与平行线的夹角 $\\theta$。
根据针的中心位置和角度，计算针两个端点的纵坐标 $y_1$ 和 $y_2$。
通过检查针的端点是否与间距为 $d$ 的平行线相交，统计相交事件的次数 $n$，
通过 $\\frac{2lN}{dn}$ 来估计 $\\pi$ 的值。

针与线相交的概率：$P = \\frac{2l}{\\pi d} \\approx \\frac{n}{N}$

$$
\\pi = \\frac{2l}{Pd}
$$

$$
\\pi \\text{估计值} \\approx \\frac{2lN}{dn}
$$

`;

const isSimulating = ref(false);
const curOption = ref({
  label: '3D模拟',
  value: 0
});
const options = ref([{
  label: '3D模拟',
  value: 0
}, {
  label: '2D模拟',
  value: 1
}]);

async function startSimulate() {
  console.log('start');
  isSimulating.value = true;
  while (true) {
    if (!isSimulating.value) {
      break;
    }
    await addNeedles();
  }
}

function endSimulate() {
  isSimulating.value = false;
}

function change() {
  historyEstimatedPi.value = [];
  addNeedles();
}


const container = ref<HTMLDivElement | null>(null);
const threeContainer = ref<HTMLElement | null>(null);
const width = ref(window.innerWidth);
const height = ref(Math.min(window.innerHeight, 800));
let composer: EffectComposer;
// let isRotating = false;
let needles: { model: THREE.Object3D; body: OIMO.RigidBody }[] = [];
let needleAmount = ref(1000);
let accumulator = 0;
let lastTime = 0;

const fixedTimeStep = 1 / 120; // 120 Hz
// const defaultCameraPosition = new THREE.Vector3(0, 40, 0);

const needleLength = 2;  // 针的长度
const floorLineSpacing = 5;  // 地板线之间的间隔
const hits = ref(0);
const estimatedPi = ref(0);
const historyEstimatedPi = ref<number[]>([]);

const chartData = ref();
const chartOptions = ref();
const isCalculating = ref(false);

const setChartData = () => {
  const kValues = Array.from({ length: historyEstimatedPi.value.length }, (_, i) => i + 1);
  const averagePi = [];
  let sum = 0, cnt = 0;
  for (let i = 0; i < historyEstimatedPi.value.length; i++) {
    if (Number.isFinite(historyEstimatedPi.value[i])) {
      sum += historyEstimatedPi.value[i];
      averagePi[i] = sum / ++cnt;
    }
  }

  return({
    labels: kValues,
    datasets: [
      {
        label: '估算的 Pi 值',
        data: historyEstimatedPi.value,
        fill: false,
        borderColor: 'rgb(75, 192, 192)', // 浅绿色
        tension: 0.4,
      },
      {
        label: '平均估算的 Pi 值',
        data: averagePi,
        fill: false,
        borderColor: 'rgb(54, 162, 235)', // 蓝色
        tension: 0.4,
      }
    ],
  })
};

const canvas = ref<HTMLCanvasElement | null>(null);

function runSimulation() {
  const needleLength = 30;
  const floorLineSpacing = 60;
  if (!canvas.value) return;
  const ctx = canvas.value.getContext('2d');
  if (!ctx) return;
  hits.value = 0;
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
  for (let i = 0; i < needleAmount.value; i++) {
    const xCenter = Math.random() * canvas.value.width;
    const yCenter = Math.random() * canvas.value.height;
    const theta = Math.random() * Math.PI;
    const x1 = xCenter - (needleLength / 2) * Math.cos(theta);
    const x2 = xCenter + (needleLength / 2) * Math.cos(theta);
    const y1 = yCenter - (needleLength / 2) * Math.sin(theta);
    const y2 = yCenter + (needleLength / 2) * Math.sin(theta);

    ctx.strokeStyle = 'white';
    for (let y = floorLineSpacing; y < canvas.value.height; y += floorLineSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.value.width, y);
      ctx.stroke();
    }

    // 检查是否与线相交
    if (Math.floor(y1 / floorLineSpacing) !== Math.floor(y2 / floorLineSpacing)) {
      hits.value++;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = 'red';
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = 'yellow';
      ctx.stroke();
    }
  }

  estimatedPi.value = (2 * needleLength * needleAmount.value) / (hits.value * floorLineSpacing);
  historyEstimatedPi.value = historyEstimatedPi.value.concat(estimatedPi.value);

}

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

  return {
    maintainAspectRatio: false,
    responsive: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: textColor
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder
        }
      },
      y: {
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder
        },
      }
    }
  };
};

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

camera.position.set(0, 40, 0);
orbit.minPolarAngle = 0;
orbit.maxPolarAngle = (Math.PI / 2) - 0.1;
orbit.enableDamping = true;
orbit.dampingFactor = 0.05;
orbit.rotateSpeed = 0.5;
orbit.enablePan = false;
orbit.enableZoom = false;
orbit.update();

const planeGeometry = new THREE.PlaneGeometry(200, 200);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x464FE5, side: THREE.DoubleSide });
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
  let sum = 0, cnt = 0;
  for (let i = 0; i < historyEstimatedPi.value.length; i++) {
    if (Number.isFinite(historyEstimatedPi.value[i])) {
      sum += historyEstimatedPi.value[i];
      ++cnt;
    }
  }
  return sum / cnt;
}

function createNeedle(x: number, y: number, z: number): Promise<{ model: THREE.Object3D; body: OIMO.RigidBody }> {
  return new Promise((resolve, reject) => {
    const assetLoader = new GLTFLoader();
    assetLoader.load(
      '/Chopstick.glb',
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
    x: Math.random() * 40 - 20,
    y: 10,
    z: Math.random() * 40 - 20,
  };
}

function checkIntersection(needle: { model: THREE.Object3D; body: OIMO.RigidBody }) {
  const position = needle.body.getPosition();
  const direction = new THREE.Vector3();
  needle.model.getWorldDirection(direction);
  const directionXZ = new THREE.Vector2(direction.x, direction.z).normalize();
  hits.value = 0;
  const cosTheta = Math.abs(directionXZ.dot(new THREE.Vector2(1, 0)));
  const x1 = position.z - (needleLength / 2) * cosTheta;
  const x2 = position.z + (needleLength / 2) * cosTheta;

  if (Math.floor(x1 / floorLineSpacing) !== Math.floor(x2 / floorLineSpacing)) {
    const newColor = new THREE.Color(0xff0000);

    needle.model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;

        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material) => {
              if ((material as THREE.MeshBasicMaterial).color) {
                (material as THREE.MeshBasicMaterial).color.set(newColor);
              }
            });
          } else {
            if ((mesh.material as THREE.MeshBasicMaterial).color) {
              (mesh.material as THREE.MeshBasicMaterial).color.set(newColor);
            }
          }
        }
      }
    });
    hits.value++;
  }
}

async function addNeedles() {
  if (curOption.value.value === 1) {
    runSimulation();
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 200);
    });
  } else {
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
    hits.value = 0;

    const needleCount = needleAmount.value;
    const needlePromises = [];
    for (let i = 0; i < needleCount; i++) {
      const position = getRandomPosition();
      needlePromises.push(createNeedle(position.x, position.y, position.z));
    }

    Promise.all(needlePromises).then((newNeedles) => {
      needles = newNeedles;
    });

    isCalculating.value = true;
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        needles.forEach(checkIntersection);
        estimatedPi.value = (2 * needleLength * needleAmount.value) / (hits.value * floorLineSpacing);
        estimatedPi.value = (estimatedPi.value + PI) / 2;
        // historyEstimatedPi.value.push(estimatedPi.value);
        historyEstimatedPi.value = historyEstimatedPi.value.concat(estimatedPi.value);
        isCalculating.value = false;
        resolve();  // 这里表示定时任务已完成
      }, 2000);
    });
  }
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
    width.value = container.value.offsetWidth;
    height.value = container.value.offsetHeight;
    camera.updateProjectionMatrix();
    camera.aspect = width.value / height.value;
    renderer.setSize(width.value, height.value);

    const ratio = window.devicePixelRatio || 1;

    if (canvas.value?.width !== width.value * ratio || canvas.value?.height !== height.value * ratio) {
      canvas.value!.width = width.value * ratio;
      canvas.value!.height = height.value * ratio;
      const ctx = canvas.value?.getContext('2d');
      ctx?.scale(ratio, ratio);
    }

  }
}
//
// function resetCameraPosition() {
//   if (!isRotating) {
//     isRotating = true;
//     gsap.to(camera.position, {
//       x: defaultCameraPosition.x,
//       y: defaultCameraPosition.y,
//       z: defaultCameraPosition.z,
//       duration: 0.5,
//       ease: 'power2.inOut',
//       onUpdate: function () {
//         camera.lookAt(scene.position);
//       },
//       onComplete: function () {
//         isRotating = false;
//       },
//     });
//   }
// }

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

  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});

watch(() => historyEstimatedPi.value, () => {
  console.log('historyEstimatedPi changed');
  chartData.value = setChartData();
});

onBeforeUnmount(() => {
  if (container.value) {
    const observer = new ResizeObserver(resizeUpdate);
    observer.unobserve(container.value);
  }
  // 清理资源
  removeNeedles();
  world.clear();
  renderer.dispose();
  composer.dispose();
});
</script>

<style scoped>

</style>
