<template>
  <div class="home row horizontal">
    <navigator />
    <router-view />
  </div>
</template>

<script>

import { ref, reactive, computed, onMounted, onBeforeMount } from 'vue'
import navigator from '@/components/navigator.vue'

export default {
  name: 'Home',
  components: {
    navigator
  },
  setup(){
    return{

    }
  }
}
</script>
