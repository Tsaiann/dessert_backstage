<template>
  <div class="dashboard">
    <guideLine msg="Dashboard" />
    <div class="content">
      <div class="row horizontal v_center" data-space-bottom="3rem">
        <span data-space-right="0.5rem">日期區間：</span>
        <el-date-picker
          v-model="timeValue"
          type="daterange"
          start-placeholder="開始日期"
          end-placeholder="結束日期"
          :default-value="[new Date(2022, 1, 1), new Date(2022, 2, 1)]"
        >
        </el-date-picker>
        <el-button type="info" data-space-left="0.5rem">搜尋</el-button>
      </div>
      <div data-space-bottom="3rem">
        <h2>總營業額:</h2>
        <span></span>
      </div>
      <div class="total">
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
import { ref, reactive, onMounted } from 'vue'
import { callApi } from '@/utils/callApi'
import { productList } from '@/service/api'
import { useStore } from 'vuex'

export default {
  name: 'Dashboard',
  components: {
    guideLine
  },
  setup() {
    const timeValue = ref('')
    const store = useStore()
    const cakeItem = reactive([
      {
        name: '戚風蛋糕',
        count: 1
      },
      {
        name: '杯子蛋糕',
        count: 2
      },
      {
        name: '馬卡龍',
        count: 3
      },
      {
        name: '其他',
        count: 4
      }
    ])
    // 獲得所有商品資料
    const getGoodsList = onMounted(async () => {
      const data = {}
      await callApi(productList, data, (res) => {
        store.commit('goodsModules/SET_GOODSTATUS', res.data.Data)
      })
    })
    return {
      timeValue,
      cakeItem,
      getGoodsList
    }
  }
}
</script>
