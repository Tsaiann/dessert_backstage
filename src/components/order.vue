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
          <el-select v-model="state.searchList.OrderStage" placeholder="Select" size="small">
            <el-option v-for="item in orderList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <span data-space-left="1rem">出貨狀態：</span>
          <el-select v-model="state.searchList.DeliveryStage" placeholder="Select" size="small">
            <el-option v-for="item in deliverList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div>
          <el-button type="info" plain data-space-left="2rem" size="small" @click="reset">重置</el-button>
          <el-button type="info" data-space-right="1rem" size="small" @click="handleSearch">搜尋</el-button>
        </div>
      </div>
      <div class="common_data">
        <div class="row horizontal v_center" data-space-bottom="1rem">
          <span>每頁筆數：</span>
          <div>
            <el-pagination
              :currentPage="state.searchList.Page"
              :page-size="state.searchList.PageLimit"
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
            <el-table-column prop="currentTime" label="訂單日期" min-width="130" />
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
              @change="getSpeGoods(state.orderForm.goodsType[j].type, j, item)"
            >
              <el-option v-for="(item, i) in state.goodsTypeList" :key="i" :label="item.Name" :value="item.ID" />
            </el-select>
            <el-select v-model="state.orderForm.goods[j].good" placeholder="請選擇" size="small" @change="changeGoods(state.orderForm.goods[j].good, item)">
              <el-option v-for="(item, i) in state.currentGoods[j]" :key="i" :label="item.Name" :value="item.Name" />
            </el-select>
          </el-form-item>
          <el-form-item label="數量：">
            <el-input v-model="state.currentOrder.OrderItem[j].Specs[0].Num" autocomplete="off" size="small" />
          </el-form-item>
          <el-form-item label="規格：">
            <div class="field-checkbox" v-if="item.type == 3 || item.type == 6">
              <div class="field-checkbox-item" v-for="(item, k) in state.currentOrder.OrderItem[j].allSpecs" :key="k">
                <p>{{ item.Specs }}</p>
              </div>
            </div>
            <div class="field-checkbox" v-else>
              <div class="field-checkbox-item" v-for="(item, k) in state.currentOrder.OrderItem[j].allSpecs" :key="k">
                <p>{{ item.Specs }} :</p>
                <input class="specsCount" type="number" max="99" min="1" v-model="item.Num" />
              </div>
            </div>
          </el-form-item>
        </div>
        <el-form-item label="出貨狀況：" label-width="140">
          <el-select v-model="state.orderForm.deliverState" placeholder="請選擇" size="small">
            <el-option label="未出貨" value="0" />
            <el-option label="已出貨" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="訂單狀況：" label-width="140">
          <el-select v-model="state.orderForm.orderState" placeholder="請選擇" size="small">
            <el-option label="未完成" value="0" />
            <el-option label="已完成" value="1" />
            <el-option label="取消訂單" value="2" />
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
          <el-button type="primary" @click="handleEdit">確定更改</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import guideLine from '@/components/guideLine.vue'
import { ref, reactive, computed, onMounted } from 'vue'
import { callApi } from '@/utils/callApi'
import { deleteMessage, confirmMessage } from '@/utils/message'
import { allOrderList, deleteOrderData, goodsTypeList, updateOrderData, productList, getOrderTotal, getOrderDetail, deleteGoodsSpecs } from '@/service/api'
import moment from 'moment'
import { ElMessage } from 'element-plus'
import { resetForm } from '@/utils/resetForm'

export default {
  name: 'Order',
  components: {
    guideLine
  },
  setup() {
    const goodsList = reactive([...JSON.parse(localStorage.getItem('goodsInfo'))])
    const orderState = ref('')
    const state = reactive({
      orderTotal: [],
      allOrder: [],
      currentOrderList: [], //頁面中的訂單資料
      currentOrder: {}, // 選中某比特定訂單的資料
      currentGoods: [], // 選中的商品種類中的所有商品
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
        OrderStage: '',
        DeliveryStage: '',
        Berfo: 0,
        After: 0
      }
    })
    const searchStatus = ref('')
    const timeValue = ref([])
    const deliver = ref(null)
    const order = ref(null)
    const dialogVisible = ref(false)
    const orderList = [
      {
        value: '0',
        label: '未完成'
      },
      {
        value: '1',
        label: '已完成'
      },
      {
        value: '2',
        label: '已取消'
      }
    ]
    const deliverList = [
      {
        value: '0',
        label: '未出貨'
      },
      {
        value: '1',
        label: '已出貨'
      }
    ]
    //取得所有訂單資料
    const getOrderList = onMounted(() => {
      const params = {}
      callApi(allOrderList, params, (res) => {
        state.allOrder = JSON.parse(JSON.stringify(res.data.Data)).reverse()
        let obj = res.data.Data.reverse()
        state.currentOrderList = [...obj.slice(0, 10)]
        orderStage('init')
        deliveryStage('init')
        timeChange('timestamp')
        orderTotal()
        getOrderLength()
      })
    })
    // 獲得訂單所有筆數
    const getOrderLength = () => {
      const data = {}
      callApi(getOrderTotal, data, (res) => {
        state.orderTableLength = res.data.Data.OrderTotalCount
      })
    }
    //取得商品種類資料
    const getGoodsType = onMounted(() => {
      const data = {}
      callApi(goodsTypeList, data, (res) => {
        state.goodsTypeList = [...res.data.Data]
      })
    })
    //轉換訂單狀態
    const orderStage = (type) => {
      const caseObj = {
        init: () => {
          for (let i in state.currentOrderList) {
            if (state.currentOrderList[i].OrderStage == '1') {
              state.currentOrderList[i].OrderStage = '已完成'
            } else if (state.currentOrderList[i].OrderStage == '2') {
              state.currentOrderList[i].OrderStage = '已取消'
            } else {
              state.currentOrderList[i].OrderStage = '未完成'
            }
          }
        },
        final: () => {
          if (state.currentOrder.OrderStage === '未完成') {
            state.currentOrder.OrderStage = '0'
          } else if (state.currentOrder.OrderStage === '已完成') {
            state.currentOrder.OrderStage = '1'
          } else if (state.currentOrder.OrderStage === '取消訂單') {
            state.currentOrder.OrderStage = '2'
          }
        }
      }
      caseObj[type]()
    }
    //轉換出貨狀態
    const deliveryStage = (type) => {
      const caseObj = {
        init: () => {
          for (let i in state.currentOrderList) {
            if (state.currentOrderList[i].DeliveryStage === '1') {
              state.currentOrderList[i].DeliveryStage = '已出貨'
            } else {
              state.currentOrderList[i].DeliveryStage = '未出貨'
            }
          }
        },
        final: () => {
          if (state.currentOrder.DeliveryStage === '未出貨') {
            state.currentOrder.DeliveryStage = '0'
          } else if (state.currentOrder.DeliveryStage === '已出貨') {
            state.currentOrder.DeliveryStage = '1'
          }
        }
      }
      caseObj[type]()
    }
    //轉換時間戳/時間
    const timeChange = (method) => {
      const caseObj = {
        timestamp: () => {
          for (let i in state.currentOrderList) {
            const timeStamp = state.currentOrderList[i].CheckoutAt * 1000
            let time = moment(timeStamp).format('YYYY-MM-DD')
            state.currentOrderList[i].currentTime = time
          }
        },
        after: () => {
          const afterTime = timeValue.value[0]
          let aftTime = moment(afterTime).valueOf() / 1000
          state.searchList.After = aftTime
        },
        before: () => {
          const befoTime = timeValue.value[1]
          let befTime = moment(befoTime).valueOf() / 1000
          state.searchList.Berfo = befTime
        }
      }
      caseObj[method]()
    }
    //刪除訂單
    const deleteOrder = (id) => {
      deleteMessage('確定刪除訂單嗎？', '刪除成功', '已取消刪除', () => {
        const data = { ID: id }
        callApi(deleteOrderData, data, () => {
          getOrderList()
        })
      })
    }
    //打開編輯dialog
    const editOrder = (obj) => {
      const data = { ID: obj.ID }
      callApi(getOrderDetail, data, (res) => {
        state.currentOrder = JSON.parse(JSON.stringify(res.data.Data))
        if (state.currentOrder.Discounts.length === 0) {
          state.orderForm.discount = '無'
        }
        state.orderForm.goodsType = []
        state.orderForm.goods = []
        state.currentGoods = []
        getGoodsDetail('open')
        state.orderForm.date = obj.currentTime
        state.orderForm.member = state.currentOrder.Email
        state.orderForm.deliverState = obj.DeliveryStage
        state.orderForm.orderState = obj.OrderStage
        state.orderForm.total = obj.total
        state.orderForm.remark = state.currentOrder.OrderRemark
        dialogVisible.value = true
      })
    }
    //獲得訂單內商品的詳細資料
    const getGoodsDetail = (method) => {
      const caseObj = {
        open: () => {
          for (let i in state.currentOrder.OrderItem) {
            state.orderForm.goodsType.push({ type: '' })
            state.orderForm.goods.push({ good: '' })
            handleGoods(state.currentOrder.OrderItem[i], i)
          }
        },
        edit: () => {
          for (let i in state.currentOrder.OrderItem) {
            deleteAdded(state.currentOrder.OrderItem[i])
            orderState.value = ''
          }
        }
      }
      caseObj[method]()
    }
    const handleGoods = async (orderItem, index) => {
      for (let j in goodsList) {
        await selectGoods(goodsList[j], orderItem, index)
        await selectSpecs(goodsList[j], orderItem)
      }
    }
    //綁定訂單中每筆商品的規格
    const selectSpecs = (goodsList, orderItem) => {
      if (orderItem.GoodsID == goodsList.ID) {
        if (orderItem.type == 3 || orderItem.type == 6) {
          orderItem.allSpecs = [{ Specs: goodsList.GoodsSpecs[1].Specs }]
          orderItem.allSpecs[0].Num = orderItem.Specs[0].Num
          delete orderItem.limit
        } else {
          orderItem.allSpecs = JSON.parse(JSON.stringify(goodsList.GoodsSpecs.slice(1)))
          orderItem.limit = goodsList.GoodsSpecs[0].Specs
          for (let i in orderItem.Specs) {
            for (let j in orderItem.allSpecs) {
              if (orderItem.Specs[i].SpecID == orderItem.allSpecs[j].ID) {
                orderItem.allSpecs[j].Num = orderItem.Specs[i].Num
              }
            }
          }
        }
      }
    }
    //綁定訂單中每筆商品的名稱與種類
    const selectGoods = async (goodsList, orderItem, index) => {
      if (orderItem.GoodsID === goodsList.ID) {
        orderItem.type = goodsList.GoodsType.ID
        state.orderForm.goodsType[index].type = goodsList.GoodsType.ID
        state.orderForm.goods[index].good = goodsList.Name
        await getSpeGoods(orderItem.type, null)
      }
    }
    //指定商品種類後叫出對應的商品
    const getSpeGoods = async (id, index, item) => {
      const data = { GoodsType: id }
      if (index === null) {
        await callApi(productList, data, (res) => {
          state.currentGoods.push(res.data.Data)
          console.log(state.currentGoods)
        })
      } else {
        await callApi(productList, data, (res) => {
          state.currentGoods.splice(index, 1, [...res.data.Data])
          state.orderForm.goods[index].good = ''
          item.allSpecs = []
        })
      }
    }
    // 更改原訂單中商品項目
    const changeGoods = (name, orderItem) => {
      for (let i in goodsList) {
        if (name === goodsList[i].Name) {
          orderItem.GoodsID = goodsList[i].ID
          orderItem.type = goodsList[i].GoodsTypeID
          orderItem.TimestampPice = goodsList[i].UnitPrice
          selectSpecs(goodsList[i], orderItem)
        }
      }
    }
    //刪除後來添加的規格
    const deleteAdded = async (orderItem) => {
      await deleteSpecs(orderItem)
      orderItem.Specs.splice(1)
      await verifySpecs(orderItem)
      if (orderState.value != 'error') {
        orderItem.Specs[0].Num = orderItem.Specs[0].Num * 1
        delete orderItem.allSpecs
        delete orderItem.type
        delete orderItem.limit
      }
    }
    //刪除原本的規格
    const deleteSpecs = (orderItem) => {
      if (orderItem.Specs.length > 1) {
        let newArr = JSON.parse(JSON.stringify(orderItem.Specs))
        let newSpecs = newArr.splice(1)
        for (let i in newSpecs) {
          if (newSpecs[i].ID == undefined) {
            return
          } else {
            const data = { ID: newSpecs[i].ID }
            callApi(deleteGoodsSpecs, data, () => {})
          }
        }
      }
    }
    //驗證所輸入的規格是否符合限制（不可以超過原本限定的數量）
    const verifySpecs = (orderItem) => {
      let specsTotal = 0
      for (let i in orderItem.allSpecs) {
        if (orderItem.allSpecs[i].hasOwnProperty('Num') !== false && orderItem.allSpecs[i].Num != '') {
          specsTotal += orderItem.allSpecs[i].Num
          if (specsTotal > orderItem.limit * 1) {
            orderState.value = 'error'
            confirmMessage(() => {})
            return
          } else {
            orderItem.Specs.push({
              SpecID: orderItem.allSpecs[i].ID,
              Num: orderItem.allSpecs[i].Num
            })
          }
        }
      }
      if (specsTotal < orderItem.limit * 1) {
        orderState.value = 'error'
        confirmMessage(() => {})
        return
      }
    }
    //更新指定訂單內容
    const handleEdit = async () => {
      state.currentOrder.DeliveryStage = state.orderForm.deliverState
      state.currentOrder.OrderStage = state.orderForm.orderState
      await orderStage('final')
      await deliveryStage('final')
      await getGoodsDetail('edit')
      if (orderState.value != 'error') {
        delete state.currentOrder.currentTime
        delete state.currentOrder.total
        const data = state.currentOrder
        await callApi(updateOrderData, data, () => {
          ElMessage({
            type: 'success',
            message: '已成功修改資料！'
          })
          getOrderList()
          dialogVisible.value = false
        })
      }
    }
    //改變頁碼
    const pageChange = (val) => {
      state.searchList.Page = val
      searchStatus.value = 'change'
      handleSearch(val, state.searchList.PageLimit)
    }
    //改變限制資料數
    const sizeChange = (val) => {
      searchStatus.value = 'change'
      state.searchList.PageLimit = val
      handleSearch(state.searchList.Page, val)
    }
    //搜尋指定商品
    const handleSearch = async (page, size) => {
      if (searchStatus.value === 'change') {
        console.log(state.allOrder)
        let newOrderList = state.allOrder.slice((page - 1) * 10, (page - 1) * 10 + size)
        state.currentOrderList = [...newOrderList]
        orderStage('init')
        deliveryStage('init')
        timeChange('timestamp')
        orderTotal()
        searchStatus.value = ''
      } else {
        state.searchList.Page = 1
        if (timeValue.value[0] !== undefined) {
          timeChange('after')
        }
        if (timeValue.value[1] !== undefined) {
          timeChange('before')
        }
        const data = {
          OrderStage: state.searchList.OrderStage,
          DeliveryStage: state.searchList.DeliveryStage,
          After: state.searchList.After,
          Berfo: state.searchList.Berfo
        }
        callApi(allOrderList, data, (res) => {
          let obj = res.data.Data.reverse()
          state.currentOrderList = [...obj.slice(0, state.searchList.PageLimit)]
          state.orderTableLength = state.currentOrderList.length
          orderStage('init')
          deliveryStage('init')
          timeChange('timestamp')
          orderTotal()
        })
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
    const reset = () => {
      timeValue.value = []
      resetForm(state.searchList)
      state.searchList.Page = 1
      state.searchList.PageLimit = 10
      getOrderList()
    }
    return {
      state,
      orderState,
      timeValue,
      deliver,
      order,
      orderList,
      deliverList,
      dialogVisible,
      permissionsUse,
      getOrderList,
      searchStatus,
      getGoodsType,
      getOrderLength,
      deleteOrder,
      reset,
      pageChange,
      sizeChange,
      orderTotal,
      handleEdit,
      orderStage,
      deliveryStage,
      timeChange,
      editOrder,
      handleSearch,
      getSpeGoods,
      changeGoods
    }
  }
}
</script>
