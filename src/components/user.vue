<template>
  <div class="user page row vertical">
    <guideLine msg="會員管理" />
    <div class="common_content row vertical">
      <div class="common_state" data-space-bottom="2rem">
        <div class="row horizontal v_center">
          <span data-space-left="1rem">帳號/信箱：</span>
          <div data-width="40%">
            <el-input v-model="accountInput" placeholder="請輸入帳號/信箱" clearable size="small" />
          </div>
          <span data-space-left="1rem">姓名：</span>
          <div data-width="40%">
            <el-input v-model="nameInput" clearable size="small" />
          </div>
          <span data-space-left="1rem">等級</span>
          <el-select v-model="userGrade" size="small" data-space-left="1rem" width="30">
            <el-option v-for="item in userList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="row horizontal h_end" data-width="30%" data-space-right="1rem">
          <el-button type="info" plain size="small">重置</el-button>
          <el-button type="info" data-space-left="0.5rem" size="small">搜尋</el-button>
        </div>
      </div>
      <div class="common_data">
        <div class="row horizontal v_center" data-space-bottom="1rem">
          <span>每頁筆數：</span>
          <div>
            <el-pagination
              :currentPage="Page"
              :page-size="PageLimit"
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
          <el-table :data="state.userTableData">
            <el-table-column prop="ID" label="id" width="150" />
            <el-table-column prop="Name" label="會員姓名" width="200" />
            <el-table-column prop="Email" label="帳號/信箱" width="300" />
            <el-table-column prop="grade" label="會員等級" min-width="100" />
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
            <el-pagination :page-size="10" :pager-count="11" layout="prev, pager, next" :total="state.memberfoversList.length"></el-pagination>
            <el-table :data="state.memberfoversList">
              <el-table-column prop="ID" label="ID" width="80" />
              <el-table-column prop="Name" label="商品名稱" width="200" />
              <el-table-column prop="GoodsType.Name" label="商品分類" />
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
    const userGrade = ref('全部')
    const accountInput = ref('')
    const nameInput = ref('')
    const dialogUserVisible = ref(false)
    const PageLimit = ref(10)
    const Page = ref(1)
    const state = reactive({
      userTableData: [],
      memberDetailList: [],
      memberfoversList: [],
      userForm: {
        name: '',
        email: '',
        level: ''
      }
    })
    // 獲得會員資料
    const getMemberData = onMounted(() => {
      const data = {
        ID: 0,
        After: 0,
        Berfo: 0,
        Page: 0,
        PageLimit: 0
      }
      callApi(memberData, data, (res) => {
        state.userTableData = [...res.data.Data]
        console.log(state.userTableData)
      })
    })
    //查看會員資料
    const openMemberDialog = (obj) => {
      dialogUserVisible.value = true
      getmemberDetailData(obj.ID)
      state.userForm.name = obj.Name
      state.userForm.email = obj.Email
    }
    //取得會員詳細資料
    const getmemberDetailData = (id) => {
      const data = { ID: id }
      callApi(memberDetailData, data, (res) => {
        state.memberDetailList = res.data.Data
        state.memberfoversList = []
        const goodsList = [...JSON.parse(localStorage.getItem('goodsInfo'))]
        console.log(goodsList)
        console.log(state.memberDetailList.Fovers)
        for (let j = 0; j < goodsList.length; j++) {
          for (let i = 0; i < state.memberDetailList.Fovers.length; i++) {
            if (state.memberDetailList.Fovers[i].GoodsID == goodsList[j].ID) {
              state.memberDetailList.Fovers[i].Goods.ID = goodsList[j].ID
              state.memberDetailList.Fovers[i].Goods.Name = goodsList[j].Name
              state.memberDetailList.Fovers[i].Goods.GoodsType.Name = goodsList[j].GoodsType.Name
              state.memberfoversList.push(state.memberDetailList.Fovers[i].Goods)
              console.log(state.memberfoversList)
            }
          }
        }
        const consumption = state.memberDetailList.Benefits.Consumption
        if (consumption < 5000) {
          state.userForm.level = '銅級會員'
        } else if (consumption >= 5000 && consumption < 10000) {
          state.userForm.level = '銀級會員'
        } else if (consumption >= 10000 && consumption < 20000) {
          state.userForm.level = '金級會員'
        } else {
          state.userForm.level = '白金會員'
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
    const searchList = reactive({
      Page: 1,
      PageLimit: 20,
      GoodsName: '',
      GoodsType: null
    })
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
    // 權限表更新
    const permissionsUse = computed(() => {
      const permissions = JSON.parse(localStorage.getItem('userPermissions'))
      return {
        detail: permissions.member_manage_detail.Activity,
        delete: permissions.member_manage_del.Activity
      }
    })
    const userList = ref([])
    return {
      userGrade,
      userList,
      deleteUser,
      dialogUserVisible,
      accountInput,
      nameInput,
      permissionsUse,
      state,
      getMemberData,
      openMemberDialog,
      PageLimit,
      Page,
      sizeChange,
      pageChange,
      searchList,
      getmemberDetailData
    }
  }
}
</script>
