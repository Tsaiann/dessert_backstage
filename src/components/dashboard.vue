<template>
  <div class="dashboard">
    <guideLine msg="Dashboard" />
    <div class="content">
      <div class="row horizontal v_center" data-space-bottom="3rem">
        <span data-space-right="0.5rem">日期區間：</span>
        <el-date-picker
          v-model="value"
          type="daterange"
          start-placeholder="開始日期"
          end-placeholder="結束日期"
          :default-value="[new Date(2022, 1, 1), new Date(2022, 2, 1)]"
        >
        </el-date-picker>
        <el-button type="info"  data-space-left="0.5rem">Search</el-button>
      </div>
      <div class="revenue" data-space-bottom="3rem">
        <h2>總營業額:</h2>
        <span></span>
      </div>
      <div class="itemTotal">
        <h2 data-space-bottom="2rem">各項商品銷售總數:</h2>
        <div class="row horizontal">
          <div v-for="item in cakeItem" :key="item" class="row vertical">
            <p data-space-bottom="1rem">{{ item.name }}</p>
            <span>{{ item.count }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import guideLine from '@/components/guideLine.vue'
import { ref, reactive, defineComponent } from 'vue'

export default defineComponent({
  name:'Dashboard',
  components:{
    guideLine
  },
  setup(){
    const value = ref('')
    const cakeItem = reactive([
      {
        name:'戚風蛋糕',
        count:1
      },
      {
        name:'杯子蛋糕',
        count:2
      },
      {
        name:'馬卡龍',
        count:3
      },
      {
        name:'其他',
        count:4
      }
    ])
    return{
      value,
      cakeItem
    }
  }
})
</script>