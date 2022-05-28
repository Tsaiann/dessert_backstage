<template>
  <div class="product page row vertical">
    <guideLine msg="商品管理" />
    <div class="common_content row vertical">
      <div class="common_state" data-space-bottom="2rem">
        <div class="row horizontal v_center">
          <span data-space-left="1rem">商品分類：</span>
          <el-select v-model="searchList.GoodsType" size="small" data-space-left="1rem" width="30">
            <el-option v-for="(item, i) in typeTableData" :key="i" :label="item.Name" :value="item.ID"></el-option>
          </el-select>
          <span data-space-left="1rem">商品名稱：</span>
          <div data-width="40%">
            <el-input v-model="searchList.GoodsName" placeholder="請輸入商品名稱" clearable size="small" />
          </div>
        </div>
        <div class="row horizontal h_end" data-width="30%" data-space-right="1rem">
          <el-button type="info" plain size="small" @click="reset">重置</el-button>
          <el-button type="info" data-space-left="0.5rem" size="small" @click="handleSearch">搜尋</el-button>
        </div>
      </div>
      <div class="common_data">
        <div class="row horizontal v_center" data-space-bottom="1rem">
          <div class="row horizontal v_center">
            <span>每頁筆數：</span>
            <div>
              <el-pagination
                :currentPage="searchList.Page"
                :page-size="searchList.PageLimit"
                layout="sizes, total, prev, pager, next"
                :total="tableDataTotal.length"
                :page-sizes="[5, 10, 15, 20]"
                @size-change="sizeChange"
                @current-change="pageChange"
                width="900"
              />
            </div>
          </div>
          <div class="row horizontal h_end" data-width="15%">
            <el-button type="primary" plain size="small" @click="dialogTypeVisible = true">分類管理</el-button>
            <el-dialog v-model="dialogTypeVisible" title="分類管理" width="500px">
              <hr />
              <el-form :model="goodsTypeForm" data-space-top="1rem">
                <el-form-item label="新增分類：">
                  <el-input size="small" placeholder="請輸入新增分類" v-model="goodsTypeForm.name" />
                  <el-button type="info" data-space-left="0.5rem" size="small" @click="addGoodsType()">新增</el-button>
                </el-form-item>
                <el-table :data="typeTableData">
                  <el-table-column prop="ID" label="id" width="80" />
                  <el-table-column prop="Name" label="分類名稱" width="130" />
                  <el-table-column prop="anotherName" label="別名" width="130" />
                  <el-table-column label="操作" align="center">
                    <template #default="scope">
                      <el-button type="danger" plain size="small" @click="delType(scope.row.ID)">刪除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>
              <hr />
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="dialogTypeVisible = false">取消</el-button>
                  <el-button type="primary" @click="dialogTypeVisible = false">確定</el-button>
                </span>
              </template>
            </el-dialog>
            <el-button type="primary" data-space-left="0.5rem" size="small" @click="addProduct()">新增商品 ＋</el-button>
            <el-dialog v-model="dialogProductVisible" :title="dialogTitle" width="500px" @close="handleClose">
              <hr />
              <el-form :model="addProductForm">
                <el-form-item label="前台顯示：">
                  <el-radio-group v-model="addProductForm.Show">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="新品期間：">
                  <el-date-picker type="date" placeholder="請選擇日期" />
                </el-form-item>
                <el-form-item label="分類：">
                  <el-select v-model="addProductForm.GoodsTypeID" placeholder="請選擇" size="small">
                    <el-option v-for="(item, i) in typeTableData" :key="i" :label="item.Name" :value="item.ID" />
                  </el-select>
                </el-form-item>
                <el-form-item label="名稱：">
                  <el-input v-model="addProductForm.Name" autocomplete="off" size="small" />
                </el-form-item>
                <el-form-item label="商品規格：">
                  <div class="specs">
                    <span data-space-right="1rem">可選</span>
                    <el-input v-model="addSpecsCount[0].Specs" autocomplete="off" size="small" />
                    <span data-space-horizontal="1rem">種</span>
                    <el-button icon="el-icon-circle-plus-outline" size="small" round @click="addSpecs()">新增規格</el-button>
                  </div>
                  <div class="addSpecs row horizontal wrap">
                    <el-input v-for="(item, i) in addSpecsList.list" :key="i" size="small" v-model="item.Specs">
                      <template #append>
                        <el-button size="small" circle icon="el-icon-error" @click="deleteSpecs(i, item.ID)" />
                      </template>
                    </el-input>
                  </div>
                </el-form-item>
                <el-form-item label="金額：">
                  <el-input v-model="addProductForm.UnitPrice" autocomplete="off" size="small" />
                </el-form-item>
                <el-form-item label="圖片上傳：">
                  <div class="upload">
                    <el-input v-model="imgData.ident" type="text" placeholder="圖片別名(Ident)" size="small" />
                    <label class="upload-customize">
                      <span>選擇圖片</span>
                      <i class="el-icon-upload"></i>
                      <input type="file" @change="selectFile($event)" />
                    </label>
                    <el-button type="primary" size="small" @click="handleUpload()">上傳圖片</el-button>
                  </div>
                  <span class="upload-text">{{ imgData.fileName }}</span>
                  <div class="upload-list" v-for="(item, i) in imgList" :key="i">
                    <div class="row horizontal v_center">
                      <img :src="item.img" alt="" />
                      <p data-space-left="1rem">{{ item.fileName }}</p>
                    </div>
                    <el-button icon="el-icon-close" size="small" circle @click="deleteimg(item.ID)" />
                  </div>
                </el-form-item>
                <el-form-item label="商品說明：">
                  <el-input v-model="addProductForm.Description" type="textarea" placeholder="請輸入內容" />
                </el-form-item>
              </el-form>
              <hr />
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="dialogProductVisible = false">取消</el-button>
                  <el-button type="primary" @click="handleSubmit()">確定</el-button>
                </span>
              </template>
            </el-dialog>
          </div>
        </div>
        <div class="table_data">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="ID" label="id" min-width="80" />
            <el-table-column prop="Name" label="商品名稱" min-width="250" />
            <el-table-column prop="GoodsType.Name" label="商品分類" min-width="150" />
            <el-table-column prop="img" label="商品圖片" min-width="250" />
            <el-table-column prop="Show" label="前台顯示" min-width="100" />
            <el-table-column label="操作" width="270" align="center">
              <template #default="scope">
                <div class="row horizontal center">
                  <el-button type="warning" plain size="small" @click="editProduct(scope.row)">查看/修改</el-button>
                  <el-button type="danger" plain size="small" @click="deleteProduct(scope.row.ID)">刪除</el-button>
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
import { ref, reactive, onMounted } from 'vue'
import { addGoodsList, productList, goodsTypeList, addGoodType, delGoodsType, delProduct, updateProduct, delSpecs } from '@/service/api'
import { async } from 'q'

export default {
  name: 'Product',
  components: {
    guideLine
  },
  setup() {
    const dialogTitle = ref('')
    const tableDataTotal = ref('')
    const submitStatus = ref('')
    const searchStatus = ref('')
    const searchList = reactive({
      Page: 1,
      PageLimit: 20,
      GoodsName: '',
      GoodsType: null
    })
    let oldSearchList = reactive({})
    let dialogProductVisible = ref(false)
    let dialogTypeVisible = ref(false)
    let tableData = ref([])
    let typeTableData = ref([])
    let addSpecsList = reactive({ list: [] })
    let addSpecsCount = reactive([{ Specs: '' }])
    const goodsTypeForm = reactive({ name: '' })
    let imgList = ref([])
    let imgData = reactive({
      ID: '',
      img: '',
      ident: '',
      file: null,
      fileName: ''
    })

    const addProductForm = reactive({
      Name: '',
      Show: null,
      GoodsTypeID: '',
      GoodsSpecs: [],
      UnitPrice: '',
      ImagesIdnet: '',
      Description: ''
    })
    //改變頁碼
    const pageChange = (val) => {
      searchList.Page = val - 1
      searchStatus.value = 'change'
      handleSearch()
    }
    //改變資料數
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
        const res = await productList(data)
        console.log(res)
        tableData.value = [...res.data.Data]
        searchList.Page += 1
        searchStatus.value = ''
      } else {
        searchList.Page -= 1
        const data = searchList
        const res = await productList(data)
        console.log(res)
        if (res.data.Code === 200) {
          tableData.value = [...res.data.Data]
          tableDataTotal.value = tableData.value
          searchList.Page += 1
        }
      }
    }
    //增加商品內容
    const addProduct = () => {
      dialogProductVisible.value = true
      submitStatus.value = 'add'
      dialogTitle.value = '新增商品'
    }
    //增加商品規格清單
    const addSpecs = () => {
      addSpecsList.list.push({ Specs: '' })
    }
    //刪除商品規格
    const deleteSpecs = (index, id) => {
      ElMessageBox.confirm('確定要刪除資料？', '警告', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          if (submitStatus.value === 'edit') {
            const data = { ID: id }
            const res = await delSpecs(data)
            console.log(res, data)
            addSpecsList.list.splice(index, 1)
            ElMessage({
              type: 'success',
              message: '已刪除資料'
            })
          } else {
            addSpecsList.list.splice(index, 1)
            ElMessage({
              type: 'success',
              message: '已刪除資料'
            })
          }
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消刪除'
          })
        })
    }
    //post 新增商品資料
    const handleAddGoods = async () => {
      addProductForm.GoodsSpecs = addSpecsCount.concat(addSpecsList.list)
      addProductForm.UnitPrice = parseInt(addProductForm.UnitPrice)
      const data = addProductForm
      const res = await addGoodsList(data)
      console.log(res)
      getProdcutList()
      dialogProductVisible.value = false
    }
    //獲得所有商品資料
    const getProdcutList = onMounted(async () => {
      const data = {}
      const res = await productList(data)
      tableData.value = [...res.data.Data]
      tableDataTotal.value = tableData.value
      console.log(tableData)
    })
    //修改商品內容
    const editProduct = (obj) => {
      dialogProductVisible.value = true
      submitStatus.value = 'edit'
      dialogTitle.value = '修改商品'
      addProductForm.Name = obj.Name
      addProductForm.Show = obj.Show
      addProductForm.GoodsTypeID = obj.GoodsTypeID
      addProductForm.UnitPrice = obj.UnitPrice
      addProductForm.Description = obj.Description
      addProductForm.ID = obj.ID
      addSpecsCount[0].Specs = obj.GoodsSpecs[0].Specs
      addSpecsCount[0].ID = obj.GoodsSpecs[0].ID
      addSpecsList.list = obj.GoodsSpecs.slice(1)
    }
    //post 編輯過後的商品資料
    const handleEditGoods = async () => {
      addProductForm.GoodsSpecs = addSpecsCount.concat(addSpecsList.list)
      addProductForm.UnitPrice = parseInt(addProductForm.UnitPrice)
      const data = addProductForm
      const res = await updateProduct(data)
      console.log(res)
      getProdcutList()
      dialogProductVisible.value = false
    }
    //判斷是要新增還是編輯
    const handleSubmit = () => {
      if (submitStatus.value === 'edit') {
        handleEditGoods()
        submitStatus.value = ''
      } else if (submitStatus.value === 'add') {
        handleAddGoods()
        submitStatus.value = ''
      }
    }
    //刪除商品內容
    const deleteProduct = (id) => {
      ElMessageBox.confirm('確定要刪除資料？', '警告', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const data = { ID: id }
          const res = await delProduct(data)
          console.log(res)
          getProdcutList()
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
    //獲得所有商品種類資料
    const getGoodsType = onMounted(async () => {
      const data = {}
      const res = await goodsTypeList(data)
      typeTableData.value = [...res.data.Data]
    })
    //新增商品種類
    const addGoodsType = async () => {
      const data = goodsTypeForm
      const res = await addGoodType(data)
      console.log(res)
      getGoodsType()
      goodsTypeForm.name = ''
    }
    //刪除商品種類
    const delType = (id) => {
      ElMessageBox.confirm('確定要刪除資料？', '警告', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const data = { ID: id }
          const res = await delGoodsType(data)
          console.log(res)
          getGoodsType()
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
    const handleClose = () => {
      Object.keys(addProductForm).forEach((item) => {
        addProductForm[item] = ''
      })
      addProductForm.GoodsSpecs = []
      addSpecsList.list = []
      addSpecsCount[0].Specs = ''
      delete addProductForm.ID
      delete addSpecsCount[0].ID
      console.log(addProductForm)
    }
    //選擇圖片
    const selectFile = (event) => {
      const file = event.target.files[0]
      const fileSize = file.size / 1024
      imgData.file = file
      imgData.fileName = file.name
      if (fileSize > 200) {
        imgData.file = null
        imgData.fileName = ''
        ElMessage({
          message: '檔案不可大於 200KB',
          type: 'error'
        })
        return
      }
    }
    //上傳圖片
    const handleUpload = () => {
      if (imgData.ident === '') {
        ElMessage({
          message: '圖片別名不可為空',
          type: 'error'
        })
        return
      } else {
        const token = localStorage.getItem('token')
        const formData = new FormData()
        formData.append('Ident', imgData.ident)
        formData.append('Img', imgData.file)
        const options = {
          method: 'POST',
          headers: {
            token: token
          },
          body: formData
        }
        fetch('/api' + '/admin/image/c', options)
          .then((res) => res.json())
          .then((res) => {
            console.log(res)
            imgData.img = res.Data.Url
            imgData.ID = res.Data.ID
            imgList.value.push(JSON.parse(JSON.stringify(imgData)))
            Object.keys(imgData).forEach((item) => {
              imgData[item] = ''
            })
            imgData.file = null
          })
      }
    }
    //刪除圖片
    const deleteimg = (id) => {
      ElMessageBox.confirm('確定要刪除資料？', '警告', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const token = localStorage.getItem('token')
          const myHeaders = new Headers()
          myHeaders.append('token', token)
          myHeaders.append('Content-Type', 'application/json')
          const options = {
            method: 'POST',
            headers: myHeaders,
            body: { id: id }
          }
          fetch('/api' + '/admin/image/d', options)
            .then((res) => res.text())
            .then((res) => {
              console.log(res)
            })
            .catch((error) => {
              console.log(error)
            })
          /*.then((res) => {
              console.log(res)
            })
          ElMessage({
            type: 'success',
            message: '已刪除資料'
          })*/
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消刪除'
          })
        })
    }
    //重置搜尋列表
    const reset = () => {
      searchList.Page = 1
      searchList.PageLimit = 20
      searchList.GoodsName = ''
      searchList.GoodsType = null
      getProdcutList()
    }

    return {
      tableDataTotal,
      searchStatus,
      oldSearchList,
      searchList,
      addSpecsList,
      addSpecsCount,
      tableData,
      dialogProductVisible,
      dialogTypeVisible,
      addProductForm,
      submitStatus,
      dialogTitle,
      deleteProduct,
      reset,
      getProdcutList,
      getGoodsType,
      typeTableData,
      goodsTypeForm,
      addGoodsType,
      delType,
      addProduct,
      editProduct,
      addSpecs,
      handleAddGoods,
      handleSubmit,
      handleClose,
      deleteSpecs,
      selectFile,
      imgList,
      imgData,
      handleUpload,
      deleteimg,
      pageChange,
      handleSearch,
      sizeChange
    }
  }
}
</script>
