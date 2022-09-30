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
          <el-select v-model="order" placeholder="Select" size="small" @change="test">
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
              :total="state.orderTableLength"
              :page-sizes="[10, 15, 20, 50]"
              @size-change="sizeChange"
              @current-change="pageChange"
              width="900"
            />
          </div>
        </div>
        <div class="table_data">
          <el-table :data="state.currentOrderList">
            <el-table-column prop="ID" label="id" min-width="100" />
            <el-table-column prop="Email" label="會員" min-width="250" />
            <el-table-column prop="total" label="總金額" min-width="100" />
            <el-table-column prop="OrderStage" label="訂單狀態" min-width="100" />
            <el-table-column prop="DeliveryStage" label="出貨狀態" min-width="100" />
            <el-table-column prop="CheckoutAt" label="訂單日期" min-width="130" />
            <el-table-column id="operate" label="操作" min-width="200" align="center">
              <template #default="scope">
                <div class="row horizontal center">
                  <el-button v-if="permissionsUse.edit" type="warning" plain size="small" @click="editOrder(scope.row)">查看/修改</el-button>
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
    <el-dialog v-model="dialogVisible" title="查看/修改訂單" width="500px" v-if="dialogVisible">
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
        <el-form-item label="商品詳情" class="exception"></el-form-item>
        <div class="order_spces" v-for="(item, j) in state.currentOrder.OrderItem" :key="j">
          <el-form-item label="名稱：">
            <el-select
              v-model="state.orderForm.goodsType[j].type"
              placeholder="請選擇"
              size="small"
              @change="getSpeGoods(state.orderForm.goodsType[j].type, j)"
            >
              <el-option v-for="(item, i) in state.goodsTypeList" :key="i" :label="item.Name" :value="item.ID" />
            </el-select>
            <el-select v-model="state.orderForm.goods[j].good" placeholder="請選擇" size="small">
              <el-option v-for="(item, i) in state.currentGoods[j]" :key="i" :label="item.Name" :value="item.Name" />
            </el-select>
          </el-form-item>
          <el-form-item label="數量：">
            <el-input v-model="state.currentOrder.OrderItem[j].Specs[0].Num" autocomplete="off" size="small" />
          </el-form-item>
          <el-form-item label="規格："> </el-form-item>
        </div>
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
import { allOrderList, deleteOrderData, goodsTypeList, productList } from '@/service/api'
import moment from 'moment'

export default {
  name: 'Order',
  components: {
    guideLine
  },
  setup() {
    const state = reactive({
      orderTotal: [],
      currentOrderList: [], //頁面中的訂單資料
      currentOrder: {}, // 選中某比特定訂單的資料
      currentGoods: [], // 選中的商品種類中的商品
      orderTableLength: 0,
      goodsTypeList: [], // 所有商品種類
      orderForm: {
        date: '',
        member: '',
        discount: '',
        name: '',
        count: '',
        goodsType: [],
        goods: [],
        deliverState: '',
        orderState: '',
        total: '',
        remark: ''
      },
      oldSearchList: {},
      searchList: {
        Page: 1,
        PageLimit: 10,
        Status: 0,
        Delivery: 0
      }
    })
    const searchStatus = ref('')
    const timeValue = ref('')
    const deliver = ref(null)
    const order = ref(null)
    const dialogVisible = ref(false)
    const orderList = [
      {
        value: 0,
        label: '未完成'
      },
      {
        value: 1,
        label: '已完成'
      },
      {
        value: 2,
        label: '已取消'
      }
    ]
    const deliverList = [
      {
        value: 0,
        label: '未出貨'
      },
      {
        value: 1,
        label: '已出貨'
      }
    ]
    //取得所有訂單資料
    const getOrderList = onMounted(() => {
      const data = {}
      const params = { PageLimit: 10 }
      callApi(allOrderList, data, (res) => {
        state.orderTableLength = res.data.Data.length
      })
      callApi(allOrderList, params, (res) => {
        state.currentOrderList = [...res.data.Data]
        orderStage()
        deliveryStage()
        timeChange()
        orderTotal()
      })
    })
    //取得商品種類資料
    const getGoodsType = onMounted(() => {
      const data = {}
      callApi(goodsTypeList, data, (res) => {
        state.goodsTypeList = [...res.data.Data]
      })
    })
    //轉換訂單狀態
    const orderStage = () => {
      for (let i in state.currentOrderList) {
        if (state.currentOrderList[i].OrderStage === 0) {
          state.currentOrderList[i].OrderStage = '未完成'
        } else {
          state.currentOrderList[i].OrderStage = '已完成'
        }
      }
    }
    //轉換出貨狀態
    const deliveryStage = () => {
      for (let i in state.currentOrderList) {
        if (state.currentOrderList[i].DeliveryStage === 0) {
          state.currentOrderList[i].DeliveryStage = '未出貨'
        } else {
          state.currentOrderList[i].DeliveryStage = '已出貨'
        }
      }
    }
    //轉換時間戳
    const timeChange = () => {
      for (let i in state.currentOrderList) {
        const timeStamp = state.currentOrderList[i].CheckoutAt * 1000
        let time = moment(timeStamp).format('YYYY-MM-DD')
        state.currentOrderList[i].CheckoutAt = time
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
    //打開編輯dialog
    const editOrder = async (obj) => {
      state.orderForm.goodsType = []
      state.orderForm.goods = []
      state.currentGoods = []
      state.currentOrder = { ...obj }
      const goodsList = [...JSON.parse(localStorage.getItem('goodsInfo'))]
      if (obj.Discounts.length === 0) {
        state.orderForm.discount = '無'
      }
      for (let i in obj.OrderItem) {
        state.orderForm.goodsType.push({ type: '' })
        state.orderForm.goods.push({ good: '' })
        for (let j in goodsList) {
          if (obj.OrderItem[i].GoodsID == goodsList[j].ID) {
            state.currentOrder.OrderItem[i].type = goodsList[j].GoodsType.ID
            state.orderForm.goodsType[i].type = goodsList[j].GoodsType.ID
            state.orderForm.goods[i].good = goodsList[j].Name
            await getSpeGoods(state.currentOrder.OrderItem[i].type, null)
          }
        }
      }
      state.orderForm.date = obj.CheckoutAt
      state.orderForm.member = obj.Email
      state.orderForm.deliverState = obj.DeliveryStage
      state.orderForm.orderState = obj.OrderStage
      state.orderForm.total = obj.total
      state.orderForm.remark = obj.OrderRemark
      //console.log(state.orderForm)
      dialogVisible.value = true
    }
    //
    const handleEdit = () => {
      dddd
    }
    //指定商品種類後叫出對應的商品
    const getSpeGoods = (id, index) => {
      const data = { GoodsType: id }
      if (index === null) {
        callApi(productList, data, (res) => {
          state.currentGoods.push(res.data.Data)
        })
      } else {
        callApi(productList, data, (res) => {
          state.currentGoods.splice(index, 1, [...res.data.Data])
          state.orderForm.goods[index].good = ''
        })
      }
    }
    //改變頁碼
    const pageChange = (val) => {
      state.searchList.Page = val - 1
      searchStatus.value = 'change'
      handleSearch()
    }
    //改變限制資料數
    const sizeChange = (val) => {
      searchStatus.value = 'change'
      state.searchList.PageLimit = val
      state.searchList.Page -= 1
      handleSearch()
    }
    //搜尋指定商品
    const handleSearch = async () => {
      if (searchStatus.value === 'change') {
        state.oldSearchList = state.searchList
        const data = state.oldSearchList
        callApi(allOrderList, data, (res) => {
          state.currentOrderList = [...res.data.Data]
          orderStage()
          deliveryStage()
          timeChange()
          orderTotal()
        })
        state.searchList.Page += 1
        searchStatus.value = ''
      } else {
        searchList.Page -= 1
        // const data = searchList
        // const res = await productList(data)
        // if (res.data.Code === 200) {
        //   tableData.value = [...res.data.Data]
        //   tableDataTotal.value = tableData.value
        //   searchList.Page += 1
        // }
      }
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
    // 計算總金額
    const orderTotal = () => {
      for (let i in state.currentOrderList) {
        let total = 0
        for (let j in state.currentOrderList[i].OrderItem) {
          total += state.currentOrderList[i].OrderItem[j].Specs[0].Num * state.currentOrderList[i].OrderItem[j].TimestampPice
          state.currentOrderList[i].total = total
        }
      }
    }
    const test = (type) => {
      console.log(order.value)
    }
    return {
      test,
      orderTotal,
      handleEdit,
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
      timeChange,
      searchStatus,
      editOrder,
      handleSearch,
      getGoodsType,
      getSpeGoods
    }
  }
}
</script>
