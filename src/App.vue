<template>
  <router-view/>
</template>

<script>
import { ref,reactive, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name:'App',
  setup(){
    /*const store = useStore()
    let beforeUnloadTime = ref(0)
    let gapTime = ref(0)

    const beforeunloadHandler = () => {
      beforeUnloadTime.value = new Date().getTime();
    }

    const unloadHandler = () => {
      gapTime.value = new Date().getTime() - beforeUnloadTime.value;
      //判断是窗口关闭还是刷新
      if (gapTime.value <= 5) {//浏览器关闭
        localStorage.clear()
      }else{
      }
    }

    const clearLocalStorage = onMounted(() => {
      window.addEventListener('beforeunload', () => beforeunloadHandler())

      window.addEventListener('unload', () => unloadHandler())
    })
    /*const clearLocalStorage = onMounted(() => {
      window.addEventListener('unload',()=>{
        localStorage.clear()
      })
    })*/
    return{
      //clearLocalStorage,
    }
  }
}
</script>