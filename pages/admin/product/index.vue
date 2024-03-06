<template>
  <div>
    <el-row style="margin-top: 20px;">
      <el-col style="margin-bottom: 1rem;">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>产品管理</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col>
        <el-button type="primary" @click="handleAdd">新增产品</el-button>
      </el-col>
      <el-col>
        <el-table
          :data="products.list"
          style="width: 100%">
          <el-table-column
            label="#"
            width="40"
            prop="idProduct">
          </el-table-column>
          <el-table-column
            label="主图"
            width="60"
            prop="productImgUrl">
            <template slot-scope="scope">
              <el-avatar size="medium" :src="scope.row.productImgUrl"></el-avatar>
            </template>
          </el-table-column>
          <el-table-column
            label="商品名称"
            width="140"
            prop="productTitle">
            <template slot-scope="scope">
              <el-link type="primary" :href="'/product/' + scope.row.idProduct" :underline="false">
                {{ scope.row.productTitle }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            width="180"
            prop="createdTime">
          </el-table-column>
          <el-table-column
            label="状态"
            width="180"
            prop="status">
            <template slot-scope="scope">
              <el-tag type="primary" disable-transitions>
                {{ scope.row.status === '0' ? '正常' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" plain>编辑</el-button>
              <el-button v-if="scope.row.status == 1" size="mini" type="primary"
                         @click="toggleStatus(scope.$index, scope.row)" plain>上架
              </el-button>
              <el-button v-else size="mini" type="danger" @click="toggleStatus(scope.$index, scope.row)" plain>下架
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col>
        <el-pagination
          :hide-on-single-page="true"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="products.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="products.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="products.total">
        </el-pagination>
      </el-col>
    </el-row>
    <!--    <el-dialog :title="`物流公司-${isEdit?'修改':'新增'}项目`" :visible.sync='editVisible'-->
    <!--               center width='880px'>-->
    <!--      <el-form ref='formStore' :model='formStore' :rules='rules' label-poionsit='right' label-width='110px'>-->
    <!--        <div style="margin-bottom:20px">-->
    <!--          <img @click="cropperVisible=true" :src="formStore.productImgUrl"-->
    <!--               style="width: 120px;height: 120px;margin: 0 auto;display: block">-->
    <!--        </div>-->

    <!--        <el-form-item label='产品名称' prop='productTitle'>-->
    <!--          <el-input v-model='formStore.productTitle' placeholder='请输入产品名称'/>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label='产品价格' prop='code'>-->
    <!--          <el-input v-model='formStore.productPrice' placeholder='请输入产品价格'/>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label='产品描述' prop='type'>-->
    <!--          <el-input v-model='formStore.productDescription' placeholder='请输入产品描述'/>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label='tags' prop='order'>-->
    <!--          <el-input v-model='formStore.tags' placeholder='请输入tags'/>-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->
    <!--      <span slot='footer' class='dialog-footer'>-->
    <!--        <el-button @click='cropperVisible = false'>取 消</el-button>-->
    <!--                <el-button type='primary' @click='handelStore'>确 定</el-button>-->
    <!--      </span>-->
    <!--    </el-dialog>-->

  </div>
</template>

<script>
import {mapState} from 'vuex';
// import VueCropper from "vue-cropper";

const rules = {
  productTitle: [
    {required: true, message: '请输入公司名称', trigger: 'blur'},
    {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
  ],
  productDescription: [{required: true, message: '请输入产品描述', trigger: 'blur'}]

}
export default {
  name: "productsList",
  middleware: 'auth',
  fetch() {
    let {store, params, error} = this.$nuxt.context
    return Promise.all([
      store
        .dispatch('admin/fetchProducts', params)
        .catch(err => error({statusCode: 404}))
    ])
  },
  computed: {
    ...mapState({
      products: state => state.admin.products
    })
  },
  data() {
    return {
      order: 'desc',
      editVisible: false,
      formStore: {},
      rules: rules,
      cropperVisible: false,
      isEdit: false
    }
  },
  methods: {
    // onRouter(name, data) {
    //   this.$router.push({
    //     path: `/${name}/${data}`
    //   })
    // },
    toggleStatus(index, product) {
      let _ts = this;
      let title, status;
      if (product.status == 0) {
        title = '下架';
        status = 1;
      } else {
        title = '上架';
        status = 0;
      }
      _ts.$confirm('确定' + title + '产品 ' + product.productTitle + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _ts.$axios.$patch('/api/admin/product/update-status', {
          idProduct: product.idProduct,
          status: status
        }).then(function (res) {
          if (res && res.message) {
            _ts.$message.error(res.message);
          } else {
            _ts.$message({
              type: 'success',
              message: title + '成功!'
            });
            _ts.handleCurrentChange(1);
          }
        });
      }).catch(() => {
        _ts.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    handleSizeChange(pageSize) {
      let _ts = this;
      _ts.$store.dispatch('admin/fetchProducts', {
        page: _ts.products.pageNum,
        rows: pageSize
      })
    },
    handleCurrentChange(page) {
      let _ts = this;
      _ts.$store.dispatch('admin/fetchProducts', {
        page: page,
        rows: _ts.products.pageSize
      })
    },
    handleEdit(index, row) {
      // this.formStore = {...row}
      // this.editVisible = true
      this.$router.push({
        path: `/admin/product/post/${row.idProduct}`,
      })
    },
    handelStore() {
      let _ts = this;
      this.formStore.idProduct = this.formStore.idProduct ? this.formStore.idProduct : 0
      _ts.$axios[this.formStore.idProduct ? '$put' : '$post']('/api/product/post', this.formStore).then(function (res) {
        if (res) {
          console.log('res')
          // _ts.$router.push({
          //   path: `/product/${res}`
          // })
        }
      })
    },
    updateUser(data) {
      let _ts = this;
      if (data) {
        this.formStore.productImgUrl = data
        this.formStore.productImgType = 1
        // this.cropperVisible = false
      } else _ts.$message.error('失败，请重试');
    },
    handleAdd() {
      this.isEdit = false
      this.formStore = {}
      this.editVisible = true
    }
  }
}
</script>

<style scoped>

</style>
