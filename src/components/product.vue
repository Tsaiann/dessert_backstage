<template>
  <div class="product row vertical">
    <guideLine msg="商品管理" />
    <div class="content row vertical">
      <div class="productState" data-space-bottom="2rem">
        <div class="row horizontal v_center">
          <span data-space-left="1rem">商品分類：</span>
          <el-select v-model="products" placeholder="Select" size="small" data-space-left="1rem" width="30">
            <el-option
              v-for="item in productsList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span data-space-left="1rem">商品名稱：</span>
          <div data-width="40%">
            <el-input v-model="input" placeholder="請輸入商品名稱" clearable size="small"/>
          </div>
        </div>
        <div class="row horizontal h_end" data-width="30%" data-space-right="1rem">
          <el-button type="info" plain size="small">重置</el-button>
          <el-button type="info"  data-space-left="0.5rem" size="small">搜尋</el-button>
        </div>
      </div>
      <div class="productData">
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
            <el-button type="primary" plain size="small">分類管理</el-button>
            <el-button type="primary"  data-space-left="0.5rem" size="small">新增商品 ＋</el-button>
          </div>
        </div>
        <div class="tableData">
          <el-table :data="tableData" >
            <el-table-column prop="id" label="id" width="60"/>
            <el-table-column prop="name" label="商品名稱" width="200"/>
             <el-table-column prop="type" label="商品分類" width="150"/>
            <el-table-column prop="img" label="商品圖片" width="250"/>
            <el-table-column prop="show" label="前台顯示" width="200"/>
            <el-table-column label="操作" width="270">
              <template #default>
                <div class="row horizontal center">
                  <el-button type="warning" plain size="small">查看/修改</el-button>
                  <el-button type="danger" plain size="small">刪除</el-button>
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
import { ref, reactive, defineComponent } from 'vue'

export default defineComponent({
  name:'Product',
  components:{
    guideLine
  },
  setup(){
    const products = ref( '全部' )
    let input= ref('')
    const pagination =ref('20')
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
    return{
      products,
      input,
      productsList,
      productPagination,
      pagination,
      tableData
    }
  }
})
</script>