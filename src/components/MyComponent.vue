<template>
  <div class="container">
    <div class="header">
      <Breadcrumb :home="home" :model="items" />
    </div>
    <div class="content">
      <div class="visualization" :style="{ width: leftWidth + 'px' }">
        图形化结果展示区域
      </div>
      <ResizableDivider @drag="onDragHorizontalDivider" />
      <div class="controls" :style="{ flex: '1 1 calc(100% - ' + leftWidth + 'px)' }">
        <div class="input-section" :style="{ height: inputHeight + 'px' }">
          数据输入区
          <div>
            选择一个数值：
            <div class="radio-button">
              <RadioButton v-model="selectedValue" inputId="10" value="10" />
              <label for="10" class="ml-2">10</label>
            </div>
            <div class="radio-button">
              <RadioButton v-model="selectedValue" inputId="100" value="100" />
              <label for="100" class="ml-2">100</label>
            </div>
            <div class="radio-button">
              <RadioButton v-model="selectedValue" inputId="1000" value="1000" />
              <label for="1000" class="ml-2">1000</label>
            </div>
            <div class="radio-button">
              <RadioButton v-model="selectedValue" inputId="10000" value="10000" />
              <label for="10000" class="ml-2">10000</label>
            </div>
          </div>
        </div>
        <ResizableVerticalDivider @drag="onDragVerticalDivider" />
        <div class="summary" :style="{ height: 'calc(100% - ' + inputHeight + 'px)' }">
          结论展示区
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RadioButton from "primevue/radiobutton";
import ResizableDivider from "./ResizableDivider.vue";
import ResizableVerticalDivider from "./ResizableVerticalDivider.vue";
import Breadcrumb from "primevue/breadcrumb";


export default {
  components: {
    RadioButton,
    ResizableDivider,
    ResizableVerticalDivider,
    Breadcrumb,
  },
  data() {
    return {
      selectedValue: null,
      leftWidth: 700, // 初始宽度
      inputHeight: 400, // 初始高度
      home: {
        icon: 'pi pi-home',
        to: '',
      },
      items: [
        { label: "第一章" },
        { label: "古典模型" },
        { label: "Buffon投针" },
      ],
    };
  },
  methods: {
    onDragHorizontalDivider(dx) {
      this.leftWidth += dx;
    },
    onDragVerticalDivider(dy) {
      this.inputHeight += dy;
    },
  },
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  height: 98vh;
  border: 1px solid black;
}

.header {
  border-bottom: 1px solid black;
  padding: 10px;
}

.content {
  display: flex;
  flex: 1;
}

.visualization {
  border-right: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
}

.controls {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.input-section {
  border-bottom: 1px solid black;
  padding: 10px;
}

.input-section>div {
  margin-bottom: 10px;
}

.radio-button {
  margin: 10px 0;
  /* 调整单选按钮之间的间距 */
}

.summary {
  padding: 10px;
}
</style>