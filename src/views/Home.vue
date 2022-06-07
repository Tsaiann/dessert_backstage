<template>
  <div class="home row horizontal">
    <navigator />
    <router-view />
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onBeforeMount, defineComponent } from 'vue'
import navigator from '@/components/navigator.vue'

export default defineComponent({
  name: 'Home',
  components: {
    navigator
  },
  setup() {
    return {}
  }
})
</script>
