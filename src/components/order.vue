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
          <div>
            <el-pagination
              :currentPage="state.currentPage"
              :page-size="state.currentPageLimit"
              layout="sizes, total, prev, pager, next"
              :total="state.orderTableData.length"
              :page-sizes="[10, 15, 20, 50]"
              @size-change="sizeChange"
              @current-change="pageChange"
              width="900"
            />
          </div>
        </div>
        <div class="table_data">
          <el-table :data="state.orderTableData">
            <el-table-column prop="ID" label="id" min-width="100" />
            <el-table-column prop="name" label="商品名稱" min-width="180" />
            <el-table-column :prop="state.orderTableData.Items" label="數量" min-width="70" />
            <el-table-column prop="Email" label="會員" min-width="250" />
            <el-table-column prop="price" label="金額" min-width="100" />
            <el-table-column prop="OrderStage" label="訂單狀態" min-width="100" />
            <el-table-column prop="DeliveryStage" label="出貨狀態" min-width="100" />
            <el-table-column prop="CheckoutAt" label="訂單日期" min-width="130" />
            <el-table-column id="operate" label="操作" min-width="200" align="center">
              <template #default="scope">
                <div class="row horizontal center">
                  <el-button v-if="permissionsUse.edit" type="warning" plain size="small" @click="dialogVisible = true">查看/修改</el-button>
                  <el-button v-if="permissionsUse.delete" type="danger" plain size="small" @click="deleteOrder(scope.row.ID)" data-space-left="0.5rem"
                    >刪除
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-dialog v-model="dialogVisible" title="查看/修改訂單" width="500px">
      <el-form v-model="state.orderForm">
        <el-form-item label="訂單日期：">
          <p>{{ state.orderForm.date }}</p>
        </el-form-item>
        <el-form-item label="購買會員：">
          <p>{{ state.orderForm.member }}</p>
        </el-form-item>
        <el-form-item label="優惠券：">
          <p>{{ state.orderForm.discount }}</p>
        </el-form-item>
        <el-form-item label="商品名稱：">
          <el-select v-model="state.orderForm.type" placeholder="請選擇" size="small">
            <el-option label="馬卡龍" value="1" />
            <el-option label="戚風蛋糕" value="2" />
            <el-option label="杯子蛋糕" value="3" />
            <el-option label="其他" value="4" />
          </el-select>
          <el-select v-model="state.orderForm.name" placeholder="請選擇" size="small">
            <el-option label="馬卡龍禮盒(8入)" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="數量：">
          <el-input v-model="state.orderForm.count" autocomplete="off" size="small" />
        </el-form-item>
        <el-form-item label="商品規格："> </el-form-item>
        <el-form-item label="出貨狀況：" label-width="140">
          <el-select v-model="state.orderForm.deliverState" placeholder="請選擇" size="small">
            <el-option label="未出貨" value="1" />
            <el-option label="已出貨" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="訂單狀況：" label-width="140">
          <el-select v-model="state.orderForm.orderState" placeholder="請選擇" size="small">
            <el-option label="未完成" value="1" />
            <el-option label="已完成" value="2" />
            <el-option label="取消訂單" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="總金額：">
          <p>{{ state.orderForm.total }}</p>
        </el-form-item>
        <el-form-item label="備註：">
          <p>{{ state.orderForm.remark }}</p>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false">確定更改</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import guideLine from '@/components/guideLine.vue'
import { ref, reactive, computed, onMounted } from 'vue'
import { callApi, deleteMessage } from '@/utils/callApi'
import { allOrderList, deleteOrderData } from '@/service/api'
import moment from 'moment'

export default {
  name: 'Order',
  components: {
    guideLine
  },
  setup() {
    const state = reactive({
      orderTableData: [],
      orderForm: {
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
      },
      searchList: {
        ID: 0,
        After: 0,
        Berfo: 0,
        Page: 0,
        PageLimit: 0,
        Status: 0,
        Delivery: 0
      },
      currentPage: 1,
      currentPageLimit: 10
    })
    const timeValue = ref('')
    const deliver = ref('全部')
    const order = ref('全部')
    const dialogVisible = ref(false)
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
    //取得所有訂單資料
    const getOrderList = onMounted(() => {
      const data = state.searchList
      callApi(allOrderList, data, (res) => {
        state.orderTableData = [...res.data.Data]
        orderStage()
        deliveryStage()
        timeChange()
      })
    })
    //轉換訂單狀態
    const orderStage = () => {
      for (let i in state.orderTableData) {
        if (state.orderTableData[i].OrderStage === 0) {
          state.orderTableData[i].OrderStage = '未完成'
        } else {
          state.orderTableData[i].OrderStage = '已完成'
        }
      }
    }
    //轉換出貨狀態
    const deliveryStage = () => {
      for (let i in state.orderTableData) {
        if (state.orderTableData[i].DeliveryStage === 0) {
          state.orderTableData[i].DeliveryStage = '未出貨'
        } else {
          state.orderTableData[i].DeliveryStage = '已出貨'
        }
      }
    }
    //轉換時間戳
    const timeChange = () => {
      for (let i in state.orderTableData) {
        const timeStamp = state.orderTableData[i].CheckoutAt * 1000
        let time = moment(timeStamp).format('YYYY-MM-DD')
        state.orderTableData[i].CheckoutAt = time
      }
    }
    //刪除訂單
    const deleteOrder = (id) => {
      deleteMessage(() => {
        const data = { ID: id }
        callApi(deleteOrderData, data, () => {
          getOrderList()
        })
      })
    }
    //改變頁碼
    const pageChange = (val) => {
      // state.searchList.Page = val - 1
      // searchStatus.value = 'change'
      // handleSearch()
    }
    //改變限制資料數
    const sizeChange = (val) => {
      // searchStatus.value = 'change'
      // state.searchList.PageLimit = val
      // state.searchList.Page -= 1
      // handleSearch()
    }
    // 權限表更新
    const permissionsUse = computed(() => {
      const permissions = JSON.parse(localStorage.getItem('userPermissions'))
      return {
        edit: permissions.order_manage_edit.Activity,
        delete: permissions.order_manage_del.Activity
      }
    })
    const reset = () => {
      timeValue.value = ''
      deliver.value = '全部'
      order.value = '全部'
    }
    return {
      state,
      timeValue,
      deliver,
      order,
      orderList,
      deliverList,
      dialogVisible,
      permissionsUse,
      deleteOrder,
      reset,
      pageChange,
      sizeChange,
      getOrderList,
      orderStage,
      deliveryStage,
      timeChange
    }
  }
}
</script>
