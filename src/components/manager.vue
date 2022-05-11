<template>
  <div class="manager page row vertical">
    <guideLine msg="管理員列表" />
    <div class="common_content row vertical">
      <div class="common_state" data-space-bottom="2rem">
        <div class="row horizontal v_center">
          <span data-space-left="1rem">帳號：</span>
            <div data-width="40%">
              <el-input v-model="accountInput" placeholder="請輸入帳號/信箱" clearable size="small"/>
            </div>
        </div>
        <div class="row horizontal h_end" data-width="30%" data-space-right="1rem">
          <el-button type="info" plain size="small" @click="reset">重置</el-button>
          <el-button type="info"  data-space-left="0.5rem" size="small">搜尋</el-button>
        </div>
      </div>
      <div class="common_data">
        <div class="row horizontal v_center" data-space-bottom="1rem">
          <div class="row horizontal v_center">
            <span>每頁筆數：</span>
             <el-select v-model="pagination" size="small">
              <el-option
                v-for="item in managerPagination"
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
              width="900"
            ></el-pagination>
          </div>
          <div class="row horizontal h_end" data-width="15%">
            <el-button type="primary"  data-space-left="0.5rem" size="small" @click="dialogManagerVisible = true">新增管理員 ＋</el-button>
            <el-dialog v-model="dialogManagerVisible" title="新增管理員" width="600px">
              <hr/>
              <el-form :model="mangerAddForm">
                <el-form-item label="管理帳號：">
                  <el-input v-model="mangerAddForm.account" autocomplete="off" size="small"/>
                </el-form-item>
                <el-form-item label="設置密碼：">
                  <el-input v-model="mangerAddForm.pwd" autocomplete="off" size="small"/><br/>
                  <el-input v-model="mangerAddForm.reconfirmPwd" autocomplete="off" size="small"/>
                </el-form-item>
                <el-form-item label="權限設定："  >
                    <el-checkbox label="訂單管理" name="permission" /><br/>
                    <el-checkbox label="修改訂單" name="permission" disabled/>
                    <el-checkbox label="刪除訂單" name="permission" disabled/><br/>
                    <el-checkbox label="商品管理" name="permission" /><br/>
                    <el-checkbox label="分類管理" name="permission" disabled/>
                    <el-checkbox label="新增商品" name="permission" disabled/>
                    <el-checkbox label="修改商品" name="permission" disabled/>
                    <el-checkbox label="刪除商品" name="permission" disabled/><br/>
                    <el-checkbox label="會員管理" name="permission" /><br/>
                    <el-checkbox label="刪除會員" name="permission" disabled/><br/>
                    <el-checkbox label="管理員功能" name="permission" /><br/>
                    <el-checkbox label="新增管理員" name="permission" disabled/>
                    <el-checkbox label="權限設定" name="permission" disabled/>
                    <el-checkbox label="刪除管理員" name="permission" disabled/>
                </el-form-item>
              </el-form>
              <hr/>
                <template #footer>
                  <span class="dialog-footer">
                    <el-button @click="dialogManagerVisible = false">取消</el-button>
                    <el-button type="primary" @click="dialogManagerVisible = false">確定送出</el-button>
                  </span>
                </template>
            </el-dialog>
          </div>
        </div>
        <div class="table_data">
          <el-table :data="tableData" >
            <el-table-column prop="id" label="id" width="120"/>
            <el-table-column prop="name" label="管理員帳號" width="500"/>
            <el-table-column prop="account" label="建立日期" width="300"/>
            <el-table-column label="操作" align="center">
              <template #default>
                <div class="row horizontal center">
                  <el-button type="warning" plain size="small" @click="dialogUserVisible = true">管理設定</el-button>
                  <el-dialog v-model="dialogUserVisible" title="查看會員" width="500px">
                    <hr/>
                    <el-form :model="UserForm">
                      <el-form-item label="管理帳號">
                        <p></p>
                      </el-form-item>
                      <el-form-item label="更改密碼：">
                        <p></p>
                      </el-form-item>
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
import { ref, reactive } from 'vue'

export default {
  name:'Manager',
  components:{
    guideLine
  },
  setup(){
    const accountInput =ref('')
    const pagination =ref('20')
    const dialogManagerVisible = ref(false)
    const managerPagination = [
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
    const mangerAddForm = reactive({
      account:'',
      pwd:'',
      reconfirmPwd:'',
      permission:[]
    })
    const reset = () => {
      accountInput.value = ''
    }
    return{
      accountInput,
      pagination,
      managerPagination,
      dialogManagerVisible,
      mangerAddForm,
      reset
    }
  }
}
</script>