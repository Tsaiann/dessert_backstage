<template>
  <router-view />
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'App',
  setup() {
    let beforeUnloadTime = ref(0)
    let gapTime = ref(0)

    const beforeunloadHandler = () => {
      beforeUnloadTime.value = new Date().getTime()
    }
    const unloadHandler = () => {
      gapTime.value = new Date().getTime() - beforeUnloadTime.value
      // 判斷是關閉還是刷新
      if (gapTime.value <= 10) {
        localStorage.clear()
      }
    }

    const clearLocalStorage = onMounted(() => {
      window.addEventListener('beforeunload', () => {
        beforeunloadHandler()
      })
      window.addEventListener('unload', () => {
        unloadHandler()
      })
    })
    return {
      clearLocalStorage
    }
  }
}
</script>
