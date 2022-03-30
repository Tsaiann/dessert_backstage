<template>
  <div class="user">
    <guideLine msg="會員管理" />
    <div class="content row vertical">
      <div class="userState" data-space-bottom="2rem">
        <div class="row horizontal v_center">
          <span data-space-left="1rem">帳號/信箱：</span>
            <div data-width="40%">
              <el-input v-model="input" placeholder="請輸入帳號/信箱" clearable size="small"/>
            </div>
          <span data-space-left="1rem">姓名：</span>
          <div data-width="40%">
            <el-input v-model="input" clearable size="small"/>
          </div>
          <span data-space-left="1rem">等級</span>
          <el-select v-model="userGrade" placeholder="Select" size="small" data-space-left="1rem" width="30">
            <el-option
              v-for="item in userList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="row horizontal h_end" data-width="30%" data-space-right="1rem">
          <el-button type="info" plain size="small">重置</el-button>
          <el-button type="info"  data-space-left="0.5rem" size="small">搜尋</el-button>
        </div>
      </div>
      <div class="userData">
        <div class="row horizontal v_center" data-space-bottom="1rem">
            <span>每頁筆數：</span>
             <el-select v-model="pagination" size="small">
              <el-option
                v-for="item in userPagination"
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
          <el-table :data="tableData" >
            <el-table-column prop="id" label="id" width="150"/>
            <el-table-column prop="name" label="會員姓名" width="200"/>
            <el-table-column prop="account" label="帳號/信箱" width="300"/>
            <el-table-column prop="grade" label="會員等級" min-width="100"/>
            <el-table-column label="操作" width="200">
              <template #default>
                <div class="row horizontal center">
                  <el-button type="warning" plain size="small" @click="dialogUserVisible = true">查看</el-button>
                  <el-dialog v-model="dialogUserVisible" title="查看會員" width="500px">
                    <el-form :model="UserForm">
                      <el-form-item label="會員姓名：">
                        <p></p>
                      </el-form-item>
                      <el-form-item label="帳號/信箱：">
                        <p></p>
                      </el-form-item>
                      <el-form-item label="會員等級：">
                        <p></p>
                      </el-form-item>
                      <el-form-item label="收藏清單：">
                        <p></p>
                      </el-form-item>
                      <el-pagination
                        :page-size="10"
                        :pager-count="11"
                        layout="prev, pager, next"
                        :total="100"
                      ></el-pagination>
                      <el-table :data="userTableData">
                        <el-table-column prop="id" label="id" width="80"/>
                        <el-table-column prop="name" label="商品名稱" width="200"/>
                        <el-table-column prop="type" label="商品分類" />
                      </el-table>
                    </el-form>
                    <hr/>
                    <template #footer>
                      <span class="dialog-footer">
                        <el-button @click="dialogUserVisible = false">關閉</el-button>
                      </span>
                    </template>
                  </el-dialog>
                  <el-button type="danger" plain size="small" @click="deleteUser" data-space-left="0.5rem">刪除</el-button>
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
import { ref, reactive, defineComponent } from 'vue'

export default defineComponent({
  name:'User',
  components:{
    guideLine
  },
  setup(){
    const userGrade =ref('全部')
    const pagination =ref('20')
    const dialogUserVisible =ref(false)
    const userList = [
      {
        value: 1,
        label: '全部',
      },
      {
        value: 2,
        label: '銅級會員',
      },
      {
        value: 3,
        label: '銀級會員',
      },
      {
        value: 4,
        label: '金級會員',
      }
    ]
    const userPagination = [
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
    const tableData=[
    {
      id:'35345',
      name:'呂＊霖',
      account:'sjfsln394@gmail.com',
      grade:'銅級會員',
    },
    {
      id:'35345',
      name:'呂＊霖',
      account:'sjfsln394@gmail.com',
      grade:'銅級會員',
    }
    ]
    const userForm = reactive({
      name: '',
      account: '',
      level:'',
      collect:''
    })
    const userTableData=[
    {
      id:'2324',
      name:'馬卡龍禮盒',
      type:'馬卡龍'
    }
    ]
    const deleteUser = () => {
      ElMessageBox.confirm(
        '確定要刪除會員資料？',
        '警告',
        {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          ElMessage({
            type: 'success',
            message: '已刪除資料',
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消刪除',
          })
        })
    }
    return{
      userGrade,
      userList,
      tableData,
      pagination,
      userPagination,
      deleteUser,
      dialogUserVisible,
      userForm,
      userTableData
    }
  }
})
</script>