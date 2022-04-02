<template>
  <div class="product page row vertical">
    <guideLine msg="商品管理" />
    <div class="commonContent row vertical">
      <div class="commonState" data-space-bottom="2rem">
        <div class="row horizontal v_center">
          <span data-space-left="1rem">商品分類：</span>
          <el-select v-model="products" size="small" data-space-left="1rem" width="30">
            <el-option
              v-for="item in productsList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span data-space-left="1rem">商品名稱：</span>
          <div data-width="40%">
            <el-input v-model="nameInput" placeholder="請輸入商品名稱" clearable size="small"/>
          </div>
        </div>
        <div class="row horizontal h_end" data-width="30%" data-space-right="1rem">
          <el-button type="info" plain size="small" @click="reset">重置</el-button>
          <el-button type="info"  data-space-left="0.5rem" size="small">搜尋</el-button>
        </div>
      </div>
      <div class="commonData">
        <div class="row horizontal v_center" data-space-bottom="1rem">
          <div class="row horizontal v_center">
            <span>每頁筆數：</span>
             <el-select v-model="pagination" size="small">
              <el-option
                v-for="item in productPagination"
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
            <el-button type="primary" plain size="small" @click="dialogTypeVisible = true">分類管理</el-button>
            <el-dialog v-model="dialogTypeVisible" title="分類管理" width="500px">
              <hr/>
              <el-form :model="productTypeForm" data-space-top="1rem">
                <el-form-item label="新增分類：">
                  <el-input size="small" placeholder="請輸入新增分類"/>
                  <el-button type="info"  data-space-left="0.5rem" size="small">新增</el-button>
                </el-form-item>
                <el-table :data="typeTableData">
                  <el-table-column prop="id" label="id" width="80"/>
                  <el-table-column prop="name" label="分類名稱" width="200"/>
                  <el-table-column label="操作">
                    <template #default>
                      <el-button type="danger" plain size="small">刪除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>
              <hr/>
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="dialogTypeVisible = false">取消</el-button>
                  <el-button type="primary" @click="dialogTypeVisible = false"
                    >確定</el-button>
                </span>
              </template>
            </el-dialog>
            <el-button type="primary"  data-space-left="0.5rem" size="small" @click="dialogProductVisible = true">新增商品 ＋</el-button>
            <el-dialog v-model="dialogProductVisible" title="新增商品" width="500px">
              <hr/>
              <el-form :model="productAddForm">
                <el-form-item label="前台顯示：">
                  <el-radio v-model="checked" label="1">是</el-radio>
                  <el-radio v-model="checked" label="2">否</el-radio>
                </el-form-item>
                <el-form-item label="分類：">
                  <el-select v-model="productAddForm.deliverState" placeholder="請選擇" size="small">
                    <el-option label="杯子蛋糕" value="1" />
                    <el-option label="戚風蛋糕" value="2" />
                    <el-option label="馬卡龍" value="3" />
                    <el-option label="其他" value="4" />
                  </el-select>
                </el-form-item>
                <el-form-item label="名稱：">
                  <el-input v-model="productAddForm.name" autocomplete="off" size="small"/>
                </el-form-item>
                <el-form-item label="商品規格：">
                  
                </el-form-item>
                <el-form-item label="金額：">
                  <el-input v-model="productAddForm.price" autocomplete="off" size="small"/>
                </el-form-item>
                <el-form-item label="圖片上傳：">
                  <el-upload class="upload-demo">
                    <el-button type="primary" size="small">上傳圖片</el-button>
                  </el-upload>
                </el-form-item>
                <el-form-item label="商品說明：">
                  <el-input
                    v-model="textarea"
                    type="textarea"
                    placeholder="請輸入內容"
                  />
                </el-form-item>
              </el-form>
              <hr/>
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="dialogProductVisible = false">取消</el-button>
                  <el-button type="primary" @click="dialogProductVisible = false"
                    >確定新增</el-button>
                </span>
              </template>
            </el-dialog>
          </div>
        </div>
        <div class="tableData">
          <el-table :data="tableData" >
            <el-table-column prop="id" label="id" min-width="80"/>
            <el-table-column prop="name" label="商品名稱" min-width="250"/>
            <el-table-column prop="type" label="商品分類" min-width="150"/>
            <el-table-column prop="img" label="商品圖片" min-width="250"/>
            <el-table-column prop="show" label="前台顯示" min-width="100"/>
            <el-table-column label="操作" width="270" align="center">
              <template #default>
                <div class="row horizontal center">
                  <el-button type="warning" plain size="small" @click="dialogProductVisible = true">查看/修改</el-button>
                  <el-button type="danger" plain size="small" @click="deleteProduct">刪除</el-button>
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
import { ref, reactive} from 'vue'

export default {
  name:'Product',
  components:{
    guideLine
  },
  setup(){
    const products = ref( '全部' )
    const nameInput= ref('')
    const pagination =ref('20')
    const dialogProductVisible=ref(false)
    const dialogTypeVisible=ref(false)
    const checked = ref('1')
    const textarea= ref('')
    const productsList = [
      {
        value: 1,
        label: '全部',
      },
      {
        value: 2,
        label: '馬卡龍',
      },
      {
        value: 3,
        label: '戚風蛋糕',
      },
      {
        value: 4,
        label: '杯子蛋糕',
      },
      {
        value: 5,
        label: '其他',
      }
    ]
    const productPagination = [
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
      id:'1',
      name:'草莓戚風蛋糕',
      type:'戚風蛋糕',
      img:'',
      show:'是',
    },
    {
      id:'2',
      name:'伯爵香蕉戚風蛋糕',
      type:'戚風蛋糕',
      img:'',
      show:'是',
    },
    ]
    const productAddForm = reactive({
      display: '',
      type: [],
      name: '',
      price:'',
      img: '',
      productDescribe: '',
    })
    const deleteProduct = () => {
      ElMessageBox.confirm(
        '確定要刪除資料？',
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
    const reset = () => {
      products.value = '全部' 
      nameInput.value =''
    }
    return{
      products,
      nameInput,
      productsList,
      productPagination,
      pagination,
      tableData,
      dialogProductVisible,
      dialogTypeVisible,
      checked,
      productAddForm,
      textarea,
      deleteProduct,
      reset
    }
  }
}
</script>