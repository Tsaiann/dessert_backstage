<template>
  <div class="order row vertical">
    <guideLine msg="訂單管理" />
    <div class="content row vertical h_center">
      <div class="orderState" data-space-bottom="2rem">
        <span class="demonstration" data-space-right="0.5rem">日期區間：</span>
        <el-date-picker
          v-model="timeValue"
          type="daterange"
          start-placeholder="開始日期"
          end-placeholder="結束日期"
          :default-value="[new Date(2022, 1, 1), new Date(2022, 2, 1)]"
          size="small"
        ></el-date-picker>
        <span data-space-left="1rem">訂單狀態：</span>
        <el-select v-model="order" placeholder="Select" size="small">
          <el-option
            v-for="item in orderList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <span data-space-left="1rem">出貨狀態：</span>
        <el-select v-model="deliver" placeholder="Select" size="small">
          <el-option
            v-for="item in deliverList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button type="info" plain data-space-left="2rem" size="small">重置</el-button>
        <el-button type="info"  data-space-left="0.5rem" size="small">搜尋</el-button>
      </div>
      <div class="orderData">
        <div class="row horizontal v_center" data-space-bottom="1rem">
            <span>每頁筆數：</span>
             <el-select v-model="pagination" placeholder="Select" size="small">
              <el-option
                v-for="item in orderPagination"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-pagination
              :page-size="20"
              :pager-count="11"
              layout="prev, pager, next"
              :total="1000"
              data-space-left="1rem"
            ></el-pagination>
        </div>
        <div class="tableData">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="id" label="id" width="50"/>
            <el-table-column prop="name" label="商品名稱" width="150"/>
            <el-table-column prop="count" label="數量" />
            <el-table-column prop="member" label="會員" width="150" />
            <el-table-column prop="price" label="金額" />
            <el-table-column prop="orderState" label="訂單狀態" />
            <el-table-column prop="deliverState" label="出貨狀態" />
            <el-table-column prop="date" label="訂單日期" width="150"/>
            <el-table-column prop="" label="操作" width="150"/>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import guideLine from '@/components/guideLine.vue'
import { ref, reactive, defineComponent } from 'vue'

export default defineComponent({
  name:'Order',
  components:{
    guideLine
  },
  setup(){
    const timeValue= ref('')
    const deliver = ref( '全部' )
    const order = ref( '全部' )
    const pagination =ref('20')
    const orderList = [
      {
        value: 1,
        label: '全部',
      },
      {
        value: 2,
        label: '未完成',
      },
      {
        value: 3,
        label: '已完成',
      },
      {
        value: 4,
        label: '取消訂單',
      }
    ]
    const deliverList = [
      {
        value: 1,
        label: '全部',
      },
      {
        value: 2,
        label: '未出貨',
      },
      {
        value: 3,
        label: '已出貨',
      }
    ]
    const orderPagination = [
      {
        value: 1,
        label: '5',
      },
      {
        value: 2,
        label: '10',
      },
      {
        value: 3,
        label: '15',
      },
      {
        value: 4,
        label: '20',
      }
    ]
    return{
      timeValue,
      deliver,
      order,
      pagination,
      orderList,
      deliverList,
      orderPagination
    }
  }
})
</script>