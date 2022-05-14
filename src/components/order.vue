<template>
  <div class="order page row vertical">
    <guideLine msg="訂單管理" />
    <div class="common_content row vertical">
      <div class="common_state" data-space-bottom="2rem">
        <div>
          <span data-space-left="1rem">日期區間：</span>
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
            <el-option v-for="item in orderList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <span data-space-left="1rem">出貨狀態：</span>
          <el-select v-model="deliver" placeholder="Select" size="small">
            <el-option v-for="item in deliverList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div>
          <el-button type="info" plain data-space-left="2rem" size="small" @click="reset">重置</el-button>
          <el-button type="info" data-space-right="1rem" size="small">搜尋</el-button>
        </div>
      </div>
      <div class="common_data">
        <div class="row horizontal v_center" data-space-bottom="1rem">
          <span>每頁筆數：</span>
          <el-select v-model="pagination" size="small">
            <el-option v-for="item in orderPagination" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-pagination :page-size="20" :pager-count="11" layout="prev, pager, next" :total="1000" data-space-left="1rem"></el-pagination>
        </div>
        <div class="table_data">
          <el-table :data="tableData">
            <el-table-column prop="id" label="id" min-width="100" />
            <el-table-column prop="name" label="商品名稱" min-width="180" />
            <el-table-column prop="count" label="數量" min-width="70" />
            <el-table-column prop="member" label="會員" min-width="250" />
            <el-table-column prop="price" label="金額" min-width="100" />
            <el-table-column prop="orderState" label="訂單狀態" min-width="100" />
            <el-table-column prop="deliverState" label="出貨狀態" min-width="100" />
            <el-table-column prop="date" label="訂單日期" min-width="130" />
            <el-table-column id="operate" label="操作" min-width="200" align="center">
              <template #default>
                <div class="row horizontal center">
                  <el-button type="warning" plain size="small" @click="dialogVisible = true">查看/修改</el-button>
                  <el-dialog v-model="dialogVisible" title="查看/修改訂單" width="500px">
                    <hr />
                    <el-form :model="orderForm">
                      <el-form-item label="訂單日期：">
                        <p>{{ orderForm.date }}</p>
                      </el-form-item>
                      <el-form-item label="購買會員：">
                        <p>{{ orderForm.member }}</p>
                      </el-form-item>
                      <el-form-item label="優惠券：">
                        <p>{{ orderForm.discount }}</p>
                      </el-form-item>
                      <el-form-item label="商品名稱：">
                        <el-select v-model="orderForm.type" placeholder="請選擇" size="small">
                          <el-option label="馬卡龍" value="1" />
                          <el-option label="戚風蛋糕" value="2" />
                          <el-option label="杯子蛋糕" value="3" />
                          <el-option label="其他" value="4" />
                        </el-select>
                        <el-select v-model="orderForm.name" placeholder="請選擇" size="small">
                          <el-option label="馬卡龍禮盒(8入)" value="1" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="數量：">
                        <el-input v-model="orderForm.count" autocomplete="off" size="small" />
                      </el-form-item>
                      <el-form-item label="商品規格："> </el-form-item>
                      <el-form-item label="出貨狀況：" label-width="140">
                        <el-select v-model="orderForm.deliverState" placeholder="請選擇" size="small">
                          <el-option label="未出貨" value="1" />
                          <el-option label="已出貨" value="2" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="訂單狀況：" label-width="140">
                        <el-select v-model="orderForm.orderState" placeholder="請選擇" size="small">
                          <el-option label="未完成" value="1" />
                          <el-option label="已完成" value="2" />
                          <el-option label="取消訂單" value="3" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="總金額：">
                        <p>{{ orderForm.total }}</p>
                      </el-form-item>
                      <el-form-item label="備註：">
                        <p>{{ orderForm.remark }}</p>
                      </el-form-item>
                    </el-form>
                    <hr />
                    <template #footer>
                      <span class="dialog-footer">
                        <el-button @click="dialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="dialogVisible = false">確定更改</el-button>
                      </span>
                    </template>
                  </el-dialog>
                  <el-button type="danger" plain size="small" @click="deleteOrder" data-space-left="0.5rem">刪除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import guideLine from '@/components/guideLine.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Order',
  components: {
    guideLine
  },
  setup() {
    const timeValue = ref('')
    const deliver = ref('全部')
    const order = ref('全部')
    const pagination = ref('20')
    const dialogVisible = ref(false)
    const store = useStore()
    const backstageApi = store.state.backstageApi
    const orderList = [
      {
        value: 1,
        label: '全部'
      },
      {
        value: 2,
        label: '未完成'
      },
      {
        value: 3,
        label: '已完成'
      },
      {
        value: 4,
        label: '取消訂單'
      }
    ]
    const deliverList = [
      {
        value: 1,
        label: '全部'
      },
      {
        value: 2,
        label: '未出貨'
      },
      {
        value: 3,
        label: '已出貨'
      }
    ]
    const orderPagination = [
      {
        value: 1,
        label: '5'
      },
      {
        value: 2,
        label: '10'
      },
      {
        value: 3,
        label: '15'
      },
      {
        value: 4,
        label: '20'
      }
    ]
    const tableData = [
      {
        id: '2324',
        name: '馬卡龍禮盒',
        count: '1',
        member: 'adfasf4@gmail.com',
        price: '560',
        orderState: '已完成',
        deliverState: '已出貨',
        date: '2022-01-25'
      },
      {
        id: '4534',
        name: '馬卡龍禮盒',
        count: '2',
        member: 'adfasf4@gmail.com',
        price: '1120',
        orderState: '已完成',
        deliverState: '已出貨',
        date: '2022-01-21'
      }
    ]
    const orderForm = reactive({
      date: '',
      member: '',
      discount: '',
      name: '',
      count: '',
      type: [],
      deliverState: '',
      orderState: '',
      total: '',
      remark: ''
    })
    const deleteOrder = () => {
      ElMessageBox.confirm('確定要刪除資料？', '警告', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          ElMessage({
            type: 'success',
            message: '已刪除資料'
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消刪除'
          })
        })
    }
    const reset = () => {
      timeValue.value = ''
      deliver.value = '全部'
      order.value = '全部'
    }
    return {
      timeValue,
      deliver,
      order,
      pagination,
      orderList,
      deliverList,
      orderPagination,
      tableData,
      dialogVisible,
      orderForm,
      deleteOrder,
      reset
    }
  }
}
</script>
