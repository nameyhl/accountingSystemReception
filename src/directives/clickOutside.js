// src/directives/clickOutside.js
export default {
  beforeMount(el, binding) {
    el.clickOutsideEvent = function (event) {
      // 检查点击是否发生在元素内部
      if (!(el === event.target || el.contains(event.target))) {
        // 如果点击发生在外部，则调用绑定的方法
        binding.value(event)
      }
    }
    // 添加事件监听
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    // 移除事件监听
    document.removeEventListener('click', el.clickOutsideEvent)
  },
}
