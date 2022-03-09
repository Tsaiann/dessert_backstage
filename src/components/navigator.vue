<template>
  <div class="navigator row vertical grow">
    <h2>Dessert Admin</h2>
    <div>
      <ul class="row vertical grow">
        <li @click="$router.push({name:'Dashboard'})">Home</li>
        <li @click="$router.push({name:'Order'})">訂單管理</li>
        <li @click="$router.push({name:'Product'})">商品管理</li>
        <li @click="$router.push({name:'User'})">會員管理</li>
        <li @click="$router.push({name:'Manager'})">管理員列表</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'navigator',
  setup(){
    return{
    
    }
  }
}
</script>