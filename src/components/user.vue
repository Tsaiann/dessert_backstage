<template>
  <div class="user page row vertical">
    <guideLine msg="會員管理" />
    <div class="common_content row vertical">
      <div class="common_state" data-space-bottom="2rem">
        <div class="row horizontal v_center">
          <span data-space-left="1rem">帳號：</span>
          <div data-width="40%">
            <el-input v-model="searchList.Account" placeholder="請輸入帳號" clearable size="small" />
          </div>
          <span data-space-left="1rem">信箱：</span>
          <div data-width="40%">
            <el-input v-model="searchList.Email" clearable size="small" placeholder="請輸入信箱" />
          </div>
          <span data-space-left="1rem">姓名：</span>
          <div data-width="40%">
            <el-input v-model="searchList.Name" clearable size="small" placeholder="請輸入姓名" />
          </div>
        </div>
        <div class="row horizontal h_end" data-width="30%" data-space-right="1rem">
          <el-button type="info" plain size="small" @click="reset">重置</el-button>
          <el-button type="info" data-space-left="0.5rem" size="small" @click="handleSearch">搜尋</el-button>
        </div>
      </div>
      <div class="common_data">
        <div class="row horizontal v_center" data-space-bottom="1rem">
          <span>每頁筆數：</span>
          <div>
            <el-pagination
              :currentPage="searchList.Page"
              :page-size="searchList.PageLimit"
              layout="sizes, total, prev, pager, next"
              :total="state.userTableData.length"
              :page-sizes="[10, 15, 20, 50]"
              @size-change="sizeChange"
              @current-change="pageChange"
              width="900"
            />
          </div>
        </div>
        <div class="table_data">
          <el-table :data="state.userTableData" :default-sort="{ prop: 'ID', order: 'descending' }">
            <el-table-column prop="ID" label="id" width="80" sortable />
            <el-table-column prop="Name" label="會員姓名" width="120" />
            <el-table-column prop="Account" label="帳號" width="120" />
            <el-table-column prop="Email" label="信箱" width="280" />
            <el-table-column prop="level" label="會員等級" />
            <el-table-column prop="Consumption" label="總消費" align="center" />
            <el-table-column label="操作" width="200" align="center">
              <template #default="scope">
                <div class="row horizontal center">
                  <el-button v-if="permissionsUse.detail" type="warning" plain size="small" @click="openMemberDialog(scope.row)">查看</el-button>
                  <el-button v-if="permissionsUse.delete" type="danger" plain size="small" @click="deleteUser(scope.row)" data-space-left="0.5rem"
                    >刪除
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-dialog v-model="dialogUserVisible" title="查看會員" width="500px">
          <el-form>
            <el-form-item label="會員姓名：">
              <p>{{ state.userForm.name }}</p>
            </el-form-item>
            <el-form-item label="帳號/信箱：">
              <p>{{ state.userForm.email }}</p>
            </el-form-item>
            <el-form-item label="會員等級：">
              <p>{{ state.userForm.level }}</p>
            </el-form-item>
            <el-form-item label="收藏清單：">
              <p></p>
            </el-form-item>
            <el-pagination :page-size="10" :pager-count="11" layout="prev, pager, next" :total="state.memberfoversListLength"></el-pagination>
            <el-table :data="state.memberDetailList.Favors">
              <el-table-column prop="GoodsID" label="ID" width="80" />
              <el-table-column prop="Goods.Name" label="商品名稱" width="200" />
              <el-table-column prop="Goods.GoodsType.Name" label="商品分類" />
            </el-table>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogUserVisible = false">關閉</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import guideLine from '@/components/guideLine.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, reactive, computed, onMounted } from 'vue'
import { callApi, deleteMessage } from '@/utils/callApi'
import { memberData, deleteMemberData, memberDetailData } from '@/service/api'

export default {
  name: 'User',
  components: {
    guideLine
  },
  setup() {
    const dialogUserVisible = ref(false)
    const searchStatus = ref('')
    let oldSearchList = reactive({})
    const state = reactive({
      userTableData: [],
      memberDetailList: [],
      memberfoversListLength: 0,
      userForm: {
        name: '',
        email: '',
        level: ''
      }
    })
    const searchList = reactive({
      Page: 1,
      PageLimit: 10,
      Account: '',
      Email: '',
      Name: ''
    })
    // 獲得會員資料
    const getMemberData = onMounted(() => {
      const data = {}
      callApi(memberData, data, (res) => {
        state.userTableData = [...res.data.Data]
        levelChange()
      })
    })
    //查看會員資料
    const openMemberDialog = (obj) => {
      dialogUserVisible.value = true
      getmemberDetailData(obj.ID)
      state.userForm.name = obj.Name
      state.userForm.email = obj.Email
      state.userForm.level = obj.level
    }
    //取得會員詳細資料
    const getmemberDetailData = (id) => {
      const data = { ID: id }
      callApi(memberDetailData, data, (res) => {
        state.memberDetailList = res.data.Data
        const goodsList = [...JSON.parse(localStorage.getItem('goodsInfo'))]
        if (state.memberDetailList.Favors !== undefined) {
          console.log(state.memberDetailList)
          state.memberfoversListLength = state.memberDetailList.Favors.length
          for (let i in state.memberDetailList.Favors) {
            for (let j in goodsList) {
              if (state.memberDetailList.Favors[i].GoodsID == goodsList[j].ID) {
                state.memberDetailList.Favors[i].Goods.Name = goodsList[j].Name
                state.memberDetailList.Favors[i].Goods.GoodsType.Name = goodsList[j].GoodsType.Name
              }
            }
          }
        }
      })
    }
    //刪除會員資料
    const deleteUser = (obj) => {
      deleteMessage(() => {
        const data = { ID: obj.ID }
        callApi(deleteMemberData, data, () => {
          getMemberData()
        })
      })
    }
    //改變頁碼
    const pageChange = (val) => {
      searchList.Page = val - 1
      searchStatus.value = 'change'
      handleSearch()
    }
    //改變限制資料數
    const sizeChange = (val) => {
      searchStatus.value = 'change'
      searchList.PageLimit = val
      searchList.Page -= 1
      handleSearch()
    }
    //搜尋指定商品
    const handleSearch = async () => {
      if (searchStatus.value === 'change') {
        oldSearchList = searchList
        const data = oldSearchList
        callApi(memberData, data, (res) => {
          searchList.Page += 1
          searchStatus.value = ''
          state.userTableData = [...res.data.Data]
          state.userTableData.forEach((el) => {
            if (el.Show === true) {
              el.Show = '是'
            } else {
              el.Show = '否'
            }
          })
        })
      } else {
        searchList.Page -= 1
        const data = searchList
        callApi(memberData, data, (res) => {
          state.userTableData = [...res.data.Data]
          state.userTableData.forEach((el) => {
            if (el.Show === true) {
              el.Show = '是'
            } else {
              el.Show = '否'
            }
          })
          searchList.Page += 1
        })
      }
    }
    // 權限表更新
    const permissionsUse = computed(() => {
      const permissions = JSON.parse(localStorage.getItem('userPermissions'))
      return {
        detail: permissions.member_manage_detail.Activity,
        delete: permissions.member_manage_del.Activity
      }
    })
    //根據消費金額確認會員等級
    const levelChange = () => {
      for (let i in state.userTableData) {
        if (state.userTableData[i].Consumption < 5000) {
          state.userTableData[i].level = '銅級會員'
        } else if (state.userTableData[i].Consumption < 10000 && state.userTableData[i].Consumption >= 5000) {
          state.userTableData[i].level = '銀級會員'
        } else if (state.userTableData[i].Consumption < 20000 && state.userTableData[i].Consumption >= 10000) {
          state.userTableData[i].level = '金級會員'
        } else if (state.userTableData[i].Consumption >= 20000) {
          state.userTableData[i].level = '白金會員'
        }
      }
    }
    const reset = () => {
      getMemberData()
      searchList.Account = ''
      searchList.Name = ''
      searchList.Email = ''
      searchList.Page = 1
      searchList.PageLimit = 10
    }
    return {
      levelChange,
      reset,
      deleteUser,
      dialogUserVisible,
      permissionsUse,
      state,
      getMemberData,
      openMemberDialog,
      sizeChange,
      pageChange,
      searchList,
      getmemberDetailData,
      handleSearch
    }
  }
}
</script>
