<template>
  <div class="admin page row vertical">
    <guideLine msg="管理員列表" />
    <div>
      <el-button type="primary" data-space-all="1rem" size="small" v-if="permissionsUse.add" @click="dialogAddVisible = true">新增管理員 ＋</el-button>
    </div>
    <div class="card row horizontal stretch wrap">
      <el-card shadow="always" v-for="(item, i) in state.tableData" :key="i" data-space-right="1rem">
        <div class="card_content">
          <p>管理員ID：{{ item.ID }}</p>
          <p>{{ item.Email }}</p>
          <h2>{{ item.Name }}</h2>
        </div>
        <hr />
        <div class="row horizontal h_end" data-space-top="1rem" v-if="item.ID !== 1">
          <el-button size="small" type="info" plain @click="openPermissions(item)" v-if="permissionsUse.edit">權限管理</el-button>
          <el-button type="danger" plain size="small" @click="deleteMember(item.ID)" v-if="permissionsUse.delete">刪除管理員</el-button>
        </div>
        <p v-else class="exception">Admin不可修改</p>
      </el-card>
    </div>
    <el-dialog v-model="dialogAddVisible" title="新增管理員" width="400px" @close="closeDialog">
      <el-form :model="state.adminForm" :rules="formRules" ref="adminAddForm">
        <el-form-item label="顯示名稱：" prop="name" data-space-top="1rem">
          <el-input v-model="state.adminForm.name" autocomplete="off" size="small" />
        </el-form-item>
        <el-form-item label="管理帳號：" prop="account">
          <el-input v-model="state.adminForm.account" autocomplete="off" size="small" />
        </el-form-item>
        <el-form-item label="管理密碼：" prop="pwd">
          <el-input v-model="state.adminForm.pwd" autocomplete="off" size="small" type="password" />
        </el-form-item>
        <el-form-item label="確認密碼：" prop="confirmPwd">
          <el-input v-model="state.adminForm.confirmPwd" autocomplete="off" size="small" type="password" />
        </el-form-item>
        <el-form-item label="電子信箱：" prop="email">
          <el-input v-model="state.adminForm.email" autocomplete="off" size="small" />
        </el-form-item>
        <el-form-item label="電話：" prop="phone">
          <el-input v-model="state.adminForm.phone" autocomplete="off" size="small" />
        </el-form-item>
      </el-form>
      <hr />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogAddVisible = false">取消</el-button>
          <el-button type="primary" @click="addMember">送出</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogPermissionsVisible" width="570px" title="管理權限設定" @close="closeDialog">
      <el-form label-width="100px" class="permissions-list">
        <el-form-item label="管理帳號:">
          <p>{{ `${state.adminForm.name} ( ID： ${state.adminForm.id} )` }}</p>
        </el-form-item>
        <el-form-item label="權限設定:">
          <div class="row vertical">
            <h2>Dashboard</h2>
            <div class="row horizontal wrap">
              <div v-for="(item, i) in state.permissions.home" :key="i" data-space-right="1rem">
                <el-checkbox v-model="item.value">{{ listName[item.name] }}</el-checkbox>
              </div>
            </div>
            <h2>訂單管理</h2>
            <div class="row horizontal wrap">
              <div v-for="(item, i) in state.permissions.order" :key="i">
                <el-checkbox v-model="item.value">{{ listName[item.name] }}</el-checkbox>
              </div>
            </div>
            <h2>商品管理</h2>
            <div class="row horizontal wrap">
              <div v-for="(item, i) in state.permissions.goods" :key="i">
                <el-checkbox v-model="item.value">{{ listName[item.name] }}</el-checkbox>
              </div>
            </div>
            <h2>會員管理</h2>
            <div class="row horizontal wrap">
              <div v-for="(item, i) in state.permissions.member" :key="i">
                <el-checkbox v-model="item.value">{{ listName[item.name] }}</el-checkbox>
              </div>
            </div>
            <h2>管理員列表</h2>
            <div class="row horizontal wrap">
              <div v-for="(item, i) in state.permissions.admin" :key="i">
                <el-checkbox v-model="item.value">{{ listName[item.name] }}</el-checkbox>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button plain @click="dialogPermissionsVisible = false">取消</el-button>
          <el-button type="primary" class="confirm" @click="updatePermissions">確定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import guideLine from '@/components/guideLine.vue'
import { ref, reactive, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { permissionName } from '@/service/permissions'
import { getAdminMembers, addAdminMembers, updateAdminPermissions, removeAdminMembers, getAdminPermissions } from '@/service/api'
import { callApi } from '@/utils/callApi'
import { ElMessage } from 'element-plus'
import { resetForm } from '@/utils/resetForm'
import { deleteMessage } from '@/utils/message'

export default {
  name: 'Admin',
  components: {
    guideLine
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const listName = permissionName
    const dialogAddVisible = ref(false)
    const dialogPermissionsVisible = ref(false)
    const adminAddForm = ref()
    const state = reactive({
      tableData: [],
      adminForm: {
        id: null,
        name: '',
        account: '',
        pwd: '',
        confirmPwd: '',
        email: '',
        phone: ''
      },
      permissions: {
        home: [],
        order: [],
        goods: [],
        member: [],
        admin: []
      }
    })
    const formRules = reactive({
      account: [{ required: true, message: '帳號不可留空', trigger: 'blur' }],
      name: [{ required: true, message: '名稱不可留空', trigger: 'blur' }],
      pwd: [{ required: true, message: '密碼不可留空', trigger: 'blur' }],
      confirmPwd: [{ validator: handleConfirmPwd, trigger: 'blur' }],
      email: [{ required: true, message: '信箱不可留空', trigger: 'blur' }]
    })
    //確認再次輸入密碼與原本相同
    function handleConfirmPwd(rule, value, callback) {
      if (value === '') {
        callback(new Error('此處不可為空'))
      } else if (value !== state.adminForm.pwd) {
        callback(new Error('密碼不一致，請再次輸入密碼'))
      } else if (value === state.adminForm.pwd) {
        adminAddForm.value.validateField('confirmPwd', () => null)
        callback()
      }
    }
    // 取得所有管理員資料
    const getAdminList = onMounted(async () => {
      await callApi(getAdminMembers, {}, (res) => {
        state.tableData = res.data.Data
        console.log(state.tableData)
      })
    })
    // 新增管理員
    const addMember = () => {
      const data = {
        Account: state.adminForm.account,
        Password: state.adminForm.pwd,
        Name: state.adminForm.name,
        Email: state.adminForm.email,
        Phone: state.adminForm.phone,
        Admin: true
      }
      callApi(addAdminMembers, data, () => {
        getAdminList()
        ElMessage({
          type: 'success',
          message: '成功新增管理員!'
        })
        dialogAddVisible.value = false
      }).catch(() => {
        ElMessage({
          type: 'error',
          message: '欄位不可為空'
        })
      })
    }
    // 製作權限設定表方便放入彈窗裡
    const createPermissionsList = async (obj) => {
      const data = { MemberID: obj.ID }
      let currentPermissions = {}
      //戳指定的用戶資料來得到此用戶的權限表
      await callApi(getAdminPermissions, data, (res) => {
        currentPermissions = { ...res.data.Data.Permission }
        console.log(currentPermissions)
      })

      //製作一個Arr分好類讓他去渲染出來
      const arr = []
      //先將原本的物件整理成要的格式丟入陣列裡
      Object.keys(currentPermissions).forEach((item) => {
        arr.push({ name: item, value: currentPermissions[item].Activity })
      })
      const pool = Object.keys(state.permissions)
      for (let i in pool) {
        //每次都要清空一次要不然會一直累加之前的資料
        state.permissions[pool[i]] = []
        const regex = new RegExp(`^${pool[i]}`)
        arr.forEach((item) => {
          if (regex.test(item.name)) {
            state.permissions[pool[i]].push(item)
          }
        })
      }
    }
    // 打開權限設定表
    const openPermissions = async (obj) => {
      console.log('open:', obj.ID)
      await createPermissionsList(obj)
      state.adminForm.id = obj.ID
      state.adminForm.account = obj.Account
      state.adminForm.username = obj.Name
      state.adminForm.email = obj.Email
      state.adminForm.phone = obj.Phone
      dialogPermissionsVisible.value = true
    }
    // 更新管理員權限
    const updatePermissions = async () => {
      const obj = {}
      const pool = Object.keys(state.permissions)
      for (let i in pool) {
        state.permissions[pool[i]].forEach((item) => {
          obj[item.name] = { Activity: item.value }
        })
      }
      const data = {
        MemberID: state.adminForm.id,
        MemberPermission: { ...obj }
      }
      await callApi(updateAdminPermissions, data, (res) => {
        ElMessage({
          type: 'success',
          message: '已成功更新管理權限!'
        })
        dialogPermissionsVisible.value = false
        store.commit('userModules/LOGOUT', '')
        router.push({ name: 'Login' })
      })
    }
    // 刪除管理員
    const deleteMember = (id) => {
      deleteMessage('確定刪除此權限管理員嗎？', '刪除成功', '已取消刪除', () => {
        const data = { ID: id }
        callApi(removeAdminMembers, data, () => {
          getAdminList()
        })
      })
    }
    // 權限表更新
    const permissionsUse = computed(() => {
      const permissions = JSON.parse(localStorage.getItem('userPermissions'))
      return {
        add: permissions.admin_manage_add.Activity,
        edit: permissions.admin_manage_edit.Activity,
        delete: permissions.admin_manage_del.Activity
      }
    })
    // 關閉Dialog時清除資料
    const closeDialog = () => {
      resetForm(state.adminForm)
      resetForm(state.permissions)
      console.log(state.adminForm, state.permissions)
    }
    return {
      dialogAddVisible,
      dialogPermissionsVisible,
      adminAddForm,
      state,
      formRules,
      listName,
      getAdminList,
      permissionsUse,
      addMember,
      closeDialog,
      handleConfirmPwd,
      createPermissionsList,
      openPermissions,
      deleteMember,
      updatePermissions
    }
  }
}
</script>
