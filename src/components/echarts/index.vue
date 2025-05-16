<template>
  <div ref="chartRef" :style="{ width: width, height: height }"></div>
</template>

<script setup>
import { ref, onBeforeUnmount, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '400px'
  },
  theme: {
    type: [String, Object],
    default: null
  }
});

const chartRef = ref(null);
let chartInstance = null;

// 初始化图表
const initChart = (options) => {
  if (!chartRef.value) return;

  // 如果已有实例则先销毁
  if (chartInstance) {
    chartInstance.dispose();
  }

  // 初始化新实例
  chartInstance = echarts.init(chartRef.value);
  chartInstance.setOption(options);

  // 添加窗口大小变化监听
  window.addEventListener('resize', handleResize);
};

// 更新图表配置
const updateOptions = (newOptions) => {
  if (chartInstance) {
    chartInstance.setOption(newOptions);
  }
};

// 处理窗口大小变化
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize();
  }
};

// 销毁图表
const disposeChart = () => {
  if (chartInstance) {
    window.removeEventListener('resize', handleResize);
    chartInstance.dispose();
    chartInstance = null;
  }
};

// 暴露方法给父组件
defineExpose({
  init: initChart,
  update: updateOptions,
  dispose: disposeChart,
  getInstance: () => chartInstance
});

// 监听选项变化
watch(() => props.options, (newVal) => {
  updateOptions(newVal);
}, { deep: true });


onBeforeUnmount(() => {
  disposeChart();
});
</script>
