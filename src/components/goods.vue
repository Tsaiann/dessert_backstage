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
                :page-sizes="[10, 15, 20, 50]"
                @size-change="sizeChange"
                @current-change="pageChange"
                width="900"
              />
            </div>
          </div>
          <div class="row horizontal h_end" data-width="15%">
            <el-button type="primary" plain size="small" @click="dialogTypeVisible = true" v-if="permissionsUse.type_edit">分類管理</el-button>
            <el-dialog v-model="dialogTypeVisible" title="分類管理" width="500px" @close="closeGoodType">
              <hr />
              <el-form :model="goodsTypeForm" data-space-top="1rem">
                <el-form-item label="新增分類：">
                  <el-input size="small" placeholder="請輸入新增分類" v-model="goodsTypeForm.name" />
                  <el-button type="info" data-space-left="0.5rem" size="small" @click="addGoodsType()">新增</el-button>
                </el-form-item>
                <el-table :data="typeTableData">
                  <el-table-column prop="ID" label="id" width="80" />
                  <el-table-column prop="Name" label="分類名稱" width="130" />
                  <el-table-column prop="Alias" label="別名" width="130">
                    <template #default="scope">
                      <el-input size="small" data-width="60%" v-model="scope.row.Alias" v-if="scope.row.ID !== 1" />
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center">
                    <template #default="scope">
                      <el-button type="danger" plain size="small" @click="delGoodsType(scope.row.ID)" v-if="scope.row.ID !== 1">刪除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>
              <hr />
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="closeGoodType">取消</el-button>
                  <el-button type="primary" @click="updateGoodsTypeAlias()">確定</el-button>
                </span>
              </template>
            </el-dialog>
            <el-button type="primary" data-space-left="0.5rem" size="small" @click="addGoods()" v-if="permissionsUse.goods_add">新增商品 ＋</el-button>
            <el-dialog v-model="dialogGoodsVisible" :title="dialogTitle" width="500px" @close="handleCloseGoods">
              <hr />
              <el-form :model="addGoodsForm">
                <el-form-item label="前台顯示：">
                  <el-radio-group v-model="addGoodsForm.display">
                    <el-radio label="是">是</el-radio>
                    <el-radio label="否">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="新品期間：">
                  <el-date-picker type="date" placeholder="請選擇日期" />
                </el-form-item>
                <el-form-item label="分類：">
                  <el-select v-model="addGoodsForm.GoodsTypeID" placeholder="請選擇" size="small">
                    <el-option v-for="(item, i) in typeTableData" :key="i" :label="item.Name" :value="item.ID" />
                  </el-select>
                </el-form-item>
                <el-form-item label="名稱：">
                  <el-input v-model="addGoodsForm.Name" autocomplete="off" size="small" />
                </el-form-item>
                <el-form-item label="商品規格：">
                  <div class="specs">
                    <span data-space-right="1rem">可選</span>
                    <el-input v-model="addSpecsCount[0].Specs" autocomplete="off" size="small" />
                    <span data-space-horizontal="1rem">種</span>
                    <el-button icon="el-icon-circle-plus-outline" size="small" round @click="addSpecs()">新增規格</el-button>
                  </div>
                  <div class="row horizontal wrap">
                    <div class="specs-list" v-for="(item, i) in addSpecsList.list" :key="i">
                      <el-button size="small" circle icon="el-icon-error" @click="deleteSpecs(i, item.ID)" />
                      <span>{{ item.Specs }}</span>
                      <el-input v-model="item.Specs" size="small" placeholder="商品規格" />
                    </div>
                  </div>
                </el-form-item>
                <el-form-item label="金額：">
                  <el-input v-model="addGoodsForm.UnitPrice" autocomplete="off" size="small" />
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
                    <el-button icon="el-icon-close" size="small" circle @click="deleteimg(i, item.ID)" />
                  </div>
                </el-form-item>
                <el-form-item label="商品說明：">
                  <el-input v-model="addGoodsForm.Description" type="textarea" placeholder="請輸入內容" />
                </el-form-item>
              </el-form>
              <hr />
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="dialogGoodsVisible = false">取消</el-button>
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
            <el-table-column prop="ImagesIdnet" label="商品圖片" min-width="250" align="center">
              <template #default="scope">
                <img :src="scope.row.ImageUrls[0].Url" alt="a" width="100" />
              </template>
            </el-table-column>
            <el-table-column prop="Show" label="前台顯示" min-width="100" align="center" />
            <el-table-column label="操作" width="270" align="center">
              <template #default="scope">
                <div class="row horizontal center">
                  <el-button type="warning" plain size="small" @click="editGoods(scope.row)" v-if="permissionsUse.goods_edit">查看/修改</el-button>
                  <el-button type="danger" plain size="small" @click="deleteGoods(scope.row)" v-if="permissionsUse.goods_delete">刪除</el-button>
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
import { ElMessage } from 'element-plus'
import { ref, reactive, onMounted, computed, toRef } from 'vue'
import { callApi, deleteMessage } from '@/utils/callApi'
import {
  addGoodsList,
  productList,
  goodsTypeList,
  addGoodType,
  delGoodType,
  delProduct,
  updateProduct,
  delSpecs,
  delImg,
  updateGoodsType,
  getImg
} from '@/service/api'
import { resetForm } from '@/utils/resetForm'

export default {
  name: 'Goods',
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
    const goodsTypeForm = reactive({ name: '' })
    let oldSearchList = reactive({})
    let dialogGoodsVisible = ref(false)
    let dialogTypeVisible = ref(false)
    let tableData = ref([])
    let typeTableData = ref([])
    let updateAlias = reactive({ List: [] })
    let addSpecsList = reactive({ list: [] })
    let addSpecsCount = reactive([{ Specs: '' }])
    let imgList = ref([])
    let imgData = reactive({
      ID: '',
      img: '',
      ident: '',
      file: '',
      fileName: ''
    })

    const addGoodsForm = reactive({
      Name: '',
      Show: null,
      display: null,
      GoodsTypeID: '',
      GoodsSpecs: [],
      UnitPrice: '',
      ImagesIdnet: '',
      Description: ''
    })
    //獲得所有商品資料
    const getGoodsList = onMounted(async () => {
      const data = {}
      callApi(productList, data, (res) => {
        tableData.value = [...res.data.Data]
        tableDataTotal.value = tableData.value
        tableData.value.forEach((el) => {
          if (el.Show === true) {
            el.Show = '是'
          } else {
            el.Show = '否'
          }
        })
      })
    })
    //獲得所有商品種類資料
    const getGoodsType = onMounted(() => {
      const data = {}
      callApi(goodsTypeList, data, (res) => {
        typeTableData.value = [...res.data.Data]
      })
    })
    //新增商品種類
    const addGoodsType = () => {
      const data = goodsTypeForm
      callApi(addGoodType, data, () => {
        getGoodsType()
        goodsTypeForm.name = ''
      })
    }
    //刪除商品種類
    const delGoodsType = (id) => {
      deleteMessage(() => {
        const data = { ID: id }
        callApi(delGoodType, data, () => {
          getGoodsType()
        })
      })
    }
    //更新商品種類別名
    const updateGoodsTypeAlias = () => {
      updateAlias.List = typeTableData.value.slice(1)
      const data = updateAlias
      console.log(data)
      callApi(updateGoodsType, data, () => {
        getGoodsType()
        dialogTypeVisible.value = false
      })
    }
    //關閉商品類別彈窗
    const closeGoodType = () => {
      updateAlias.List = typeTableData.value.slice(1)
      updateAlias.List.forEach((el) => {
        el.Alias = ''
      })
      dialogTypeVisible.value = false
      getGoodsType()
    }
    //打開新增商品內容欄位
    const addGoods = () => {
      dialogGoodsVisible.value = true
      submitStatus.value = 'add'
      dialogTitle.value = '新增商品'
    }
    //新增商品資料
    const handleAddGoods = () => {
      addGoodsForm.GoodsSpecs = addSpecsCount.concat(addSpecsList.list)
      addGoodsForm.UnitPrice = parseInt(addGoodsForm.UnitPrice)
      if (addGoodsForm.display === '是') {
        addGoodsForm.Show = true
      } else {
        addGoodsForm.Show = false
      }
      const data = addGoodsForm
      callApi(addGoodsList, data, () => {
        getGoodsList()
        dialogGoodsVisible.value = false
      }).catch(() => {
        ElMessage({
          type: 'error',
          message: '請確實填寫商品資料'
        })
      })
    }
    //刪除商品內容
    const deleteGoods = (obj) => {
      deleteMessage(() => {
        const data = { ID: obj.ID }
        callApi(delProduct, data, () => {
          getGoodsList()
          autoDeleteImg(obj.ImageUrls)
        })
      })
    }
    // 刪除商品時一併刪除照片
    const autoDeleteImg = (arr) => {
      const imgIDList = arr.map((el) => Object.values(el)[0])
      for (let i in imgIDList) {
        const data = { id: imgIDList[i] }
        callApi(delImg, data, () => {
          imgList.value = []
        })
      }
    }
    //增加商品規格清單
    const addSpecs = () => {
      addSpecsList.list.push({ Specs: '' })
    }
    //刪除商品規格
    const deleteSpecs = (index, id) => {
      deleteMessage(() => {
        if (submitStatus.value === 'edit') {
          const data = { ID: id }
          callApi(delSpecs, data, () => {
            addSpecsList.list.splice(index, 1)
          })
        } else {
          addSpecsList.list.splice(index, 1)
        }
      })
    }
    //打開修改商品內容欄位
    const editGoods = (obj) => {
      dialogGoodsVisible.value = true
      submitStatus.value = 'edit'
      dialogTitle.value = '修改商品'
      addGoodsForm.Name = obj.Name
      addGoodsForm.display = obj.Show
      addGoodsForm.GoodsTypeID = obj.GoodsTypeID
      addGoodsForm.UnitPrice = obj.UnitPrice
      addGoodsForm.Description = obj.Description
      addGoodsForm.ID = obj.ID
      imgData.ident = obj.ImagesIdnet
      const imgArr = obj.ImageUrls
      for (let i in imgArr) {
        imgData.img = imgArr[i].Url
        imgData.fileName = imgArr[i].Url
        imgData.ID = imgArr[i].ID
        imgList.value.push(JSON.parse(JSON.stringify(imgData)))
        imgData.img = ''
        imgData.fileName = ''
      }
      addSpecsCount[0].Specs = obj.GoodsSpecs[0].Specs
      addSpecsCount[0].ID = obj.GoodsSpecs[0].ID
      addSpecsList.list = obj.GoodsSpecs.slice(1)
    }

    //編輯商品資料
    const handleEditGoods = () => {
      addGoodsForm.ImagesIdnet = imgData.ident
      addGoodsForm.GoodsSpecs = addSpecsCount.concat(addSpecsList.list)
      addGoodsForm.UnitPrice = parseInt(addGoodsForm.UnitPrice)
      if (addGoodsForm.display === '是') {
        addGoodsForm.Show = true
      } else {
        addGoodsForm.Show = false
      }
      const data = addGoodsForm
      callApi(updateProduct, data, () => {
        getGoodsList()
        dialogGoodsVisible.value = false
      })
    }
    //判斷是要新增還是編輯
    const handleSubmit = () => {
      submitStatus.value === 'edit' ? handleEditGoods() : handleAddGoods()
      submitStatus.value = ''
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
        const res = await productList(data)
        tableData.value = [...res.data.Data]
        tableData.value.forEach((el) => {
          if (el.Show === true) {
            el.Show = '是'
          } else {
            el.Show = '否'
          }
        })
        searchList.Page += 1
        searchStatus.value = ''
      } else {
        searchList.Page -= 1
        const data = searchList
        const res = await productList(data)
        if (res.data.Code === 200) {
          tableData.value = [...res.data.Data]
          tableData.value.forEach((el) => {
            if (el.Show === true) {
              el.Show = '是'
            } else {
              el.Show = '否'
            }
          })
          tableDataTotal.value = tableData.value
          searchList.Page += 1
        }
      }
    }

    const handleCloseGoods = () => {
      Object.keys(addGoodsForm).forEach((item) => {
        addGoodsForm[item] = ''
      })
      Object.keys(imgData).forEach((item) => {
        imgData[item] = ''
      })
      addGoodsForm.GoodsSpecs = []
      imgList.value = []
      addSpecsList.list = []
      addSpecsCount[0].Specs = ''
      delete addGoodsForm.ID
      delete addSpecsCount[0].ID
      getGoodsList()
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
      } else {
        console.log(imgData)
      }
    }
    //上傳圖片
    const handleUpload = () => {
      if (imgData.ident === '') {
        ElMessage({
          message: '圖片別名不可為空',
          type: 'error'
        })
      } else if (imgData.file === '') {
        ElMessage({
          message: '請選擇圖片',
          type: 'error'
        })
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
        const baseUrl = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : '/api'
        fetch(baseUrl + '/admin/image/c', options)
          .then((res) => res.json())
          .then((res) => {
            console.log(res)
            imgData.img = res.Data.Url
            imgData.ID = res.Data.ID
            addGoodsForm.ImagesIdnet = imgData.ident
            imgList.value.push(JSON.parse(JSON.stringify(imgData)))
            resetForm(imgData)
            imgData.ident = addGoodsForm.ImagesIdnet
          })
      }
    }
    //刪除圖片
    const deleteimg = (index, id) => {
      deleteMessage(() => {
        const data = { id: id }
        callApi(delImg, data, () => {
          imgList.value.splice(index, 1)
        })
      })
    }
    // 權限表更新
    const permissionsUse = computed(() => {
      const permissions = JSON.parse(localStorage.getItem('userPermissions'))
      return {
        goods_add: permissions.goods_manage_add.Activity,
        goods_edit: permissions.goods_manage_edit_goods.Activity,
        goods_delete: permissions.goods_manage_del.Activity,
        type_edit: permissions.goods_manage_edit_type.Activity
      }
    })
    //重置搜尋列表
    const reset = () => {
      searchList.Page = 1
      searchList.PageLimit = 20
      searchList.GoodsName = ''
      searchList.GoodsType = null
      getGoodsList()
    }
    return {
      dialogGoodsVisible,
      dialogTypeVisible,
      tableDataTotal,
      submitStatus,
      searchStatus,
      dialogTitle,
      addSpecsList,
      addSpecsCount,
      oldSearchList,
      searchList,
      tableData,
      typeTableData,
      goodsTypeForm,
      addGoodsForm,
      imgList,
      imgData,
      getGoodsList,
      getGoodsType,
      permissionsUse,
      updateAlias,
      addGoods,
      editGoods,
      deleteGoods,
      handleAddGoods,
      addGoodsType,
      delGoodsType,
      addSpecs,
      deleteSpecs,
      handleSubmit,
      handleCloseGoods,
      selectFile,
      handleUpload,
      deleteimg,
      pageChange,
      sizeChange,
      handleSearch,
      updateGoodsTypeAlias,
      closeGoodType,
      reset
    }
  }
}
</script>
