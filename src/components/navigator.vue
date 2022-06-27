<template>
  <div class="navigator row vertical grow">
    <h2>Dessert Admin</h2>
    <div>
      <ul>
        <li v-for="(item, i) in state.routes" :key="i" @click="routerChange(item.name)">{{ item.meta.name }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Navigator',
  setup() {
    const router = useRouter()
    const state = reactive({
      routes: []
    })
    const currentRoutes = computed(() => router.options.routes)
    //從權限表得知哪些是被允許的
    const pool = onMounted(() => {
      const route = currentRoutes.value.find((item) => item.name === 'Home').children
      const permissions = JSON.parse(localStorage.getItem('userPermissions'))
      const list = Object.keys(permissions).filter((el) => permissions[el].Activity === true)
      state.routes = route.filter((item) => list.includes(item.meta.permissionId))
      console.log(state.routes)
    })
    const routerChange = (path) => {
      router.push({ name: path })
    }
    return {
      state,
      routerChange,
      currentRoutes,
      pool
    }
  }
}
</script>
