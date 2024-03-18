<template>
  <el-row class="products">
    <el-col>
      <el-form ref='formStore' :model='formStore' :rules='rules' label-poionsit='right' label-width='110px'>
        <div style="margin-bottom:20px">
          <img :src="formStore.productImgUrl" style="width: 120px;height: 120px;margin: 0 auto;display: block"
               @click="cropperVisible=true">
        </div>
        <el-form-item label='产品名称' prop='productTitle'>
          <el-input v-model='formStore.productTitle' placeholder='请输入产品名称'/>
        </el-form-item>
        <el-form-item label='产品价格' prop='code'>
          <el-input v-model='formStore.productPrice' placeholder='请输入产品价格'/>
        </el-form-item>
        <el-form-item label='产品描述' prop='type'>
          <div id="contentEditor"></div>
        </el-form-item>
        <el-form-item label='tags' prop='order'>
          <el-input v-model='formStore.tags' placeholder='请输入tags'/>
        </el-form-item>
      </el-form>

      <el-col style="margin-top: 1rem;">
      </el-col>
      <el-col v-if="!isEdit" style="margin-top: 1rem;padding-right:3rem;text-align: right;">
        <el-button :loading="doLoading" plain @click="saveArticle">保存草稿</el-button>
        <el-button :loading="doLoading" plain type="primary" @click="postArticle">发布</el-button>
      </el-col>
      <el-col v-else style="margin-top: 1rem;padding-right:3rem;text-align: right;">
        <el-button :loading="doLoading" plain type="danger" @click="deleteArticle">删除</el-button>
        <el-button v-if="productStatus === '1'" :loading="doLoading" plain @click="saveArticle">保存草稿</el-button>
        <el-button v-if="productStatus === '0'" :loading="doLoading" plain type="primary" @click="postArticle">更新
        </el-button>
        <el-button v-else :loading="doLoading" plain type="primary" @click="postArticle">发布</el-button>
      </el-col>
    </el-col>
    <!--    <el-col v-else class="text-center">-->
    <!--      <el-alert-->
    <!--        title="用户无权限"-->
    <!--        type="warning"-->
    <!--        center-->
    <!--        show-icon-->
    <!--        :closable="false">-->
    <!--      </el-alert>-->
    <!--    </el-col>-->
    <ImgCropper :avatarUrl="formStore.productImgUrl||''" :visible.sync='cropperVisible'
                @onSubmit="updateUser"></ImgCropper>

  </el-row>
</template>

<script>
import Vue from 'vue';
import {mapState} from 'vuex';
import apiConfig from '~/config/api.config';
import ImgCropper from "~/components/ImgCropper.vue";
import VueCropper from "vue-cropper";

const rules = {
  productTitle: [
    {required: true, message: '请输入公司名称', trigger: 'blur'},
    {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
  ],
  productDescription: [{required: true, message: '请输入产品描述', trigger: 'blur'}]
}
export default {
  name: "PostProducts",
  middleware: 'auth',
  validate({params, store}) {
    if (typeof params.product_id === 'undefined') {
      return true;
    }
    return params.product_id && !isNaN(Number(params.product_id))
  },
  asyncData({store, params, error}) {
    return Promise.all([
      store.dispatch('product/fetchPostDetail', params)
        .catch(err => error({statusCode: 404}))
    ])
  },
  components: {
    VueCropper, ImgCropper
  },
  computed: {
    ...mapState({
      product: state => state.product.detail.data
    }),
    // hasPermissions() {
    //   let account = this.$store.state.auth.user?.nickname;
    //   if (account) {
    //     if (this.$route.params.product_id) {
    //       if (account === this.product.productAuthor.userNickname) {
    //         return true;
    //       }
    //     } else {
    //       return true;
    //     }
    //   }
    //   return this.$auth.hasScope('blog_admin') || this.$auth.hasScope('admin');
    // }
  },
  data() {
    return {
      contentEditor: null,
      tokenURL: {
        URL: '',
        linkToImageURL: '',
        token: ''
      },
      formStore: {
        idArticle: 0,
        productTitle: '',
        productContent: '',
        productType: 0,
        tags: '',
        productStatus: '0',
        productPrice: 0,
        productImgType: 0
      },
      idArticle: 0,
      productTitle: '',
      productContent: '',
      productType: 0,
      productTags: [],
      productStatus: '0',
      options: [],
      list: [],
      loading: false,
      doLoading: false,
      isEdit: false,
      notificationFlag: true,
      cropperVisible: false,
      rules: rules,
    }
  },
  methods: {
    updateUser(data) {
      this.formStore.productImgUrl = data
      this.formStore.productImgType = 1
      this.cropperVisible = false
    },
    _initEditor(data) {
      let _ts = this;

      let toolbar = [
        'emoji',
        'headings',
        'bold',
        'italic',
        'strike',
        'link',
        '|',
        'list',
        'ordered-list',
        'check',
        'outdent',
        'indent',
        '|',
        'quote',
        'line',
        'code',
        'inline-code',
        'insert-before',
        'insert-after',
        '|',
        'upload',
        // 'record',
        'table',
        '|',
        'undo',
        'redo',
        '|',
        'edit-mode',
        {
          name: 'more',
          toolbar: [
            'fullscreen',
            'both',
            'preview',
            'info'
          ],
        }]
      return new Vue.Vditor(data.id, {
        toolbar,
        mode: 'sv',
        tab: '\t',
        cdn: apiConfig.VDITOR,
        cache: {
          enable: !this.$route.params.product_id,
          id: this.$route.params.product_id ? this.$route.params.product_id : '',
        },
        after() {
          _ts.contentEditor.setValue(data.value ? data.value : '');
        },
        hint: {
          emoji: Vue.emoji
        },
        preview: {
          hljs: {
            enable: true,
            lineNumber: true,
            style: 'github'
          },
          markdown: {
            toc: true,
            autoSpace: true
          },
          math: {
            inlineDigit: true
          },
          delay: 500,
          mode: data.mode,
          /*url: `${process.env.Server}/api/console/markdown`,*/
          parse: (element) => {
            if (element.style.display === 'none') {

            }
            // LazyLoadImage();
            // Vue.Vditor.highlightRender({style: 'github'}, element, this.contentEditor);
          },
          theme: {
            cdn: apiConfig.VDITOR_CSS
          }
        },
        upload: {
          max: 10 * 1024 * 1024,
          url: this.tokenURL.URL,
          linkToImgUrl: this.tokenURL.linkToImageURL,
          token: this.tokenURL.token,
          filename: name => name.replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, '').replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, '').replace('/\\s/g', '')
        },
        height: data.height,
        counter: 102400,
        resize: {
          enable: data.resize,
        },
        lang: this.$store.state.locale,
        placeholder: data.placeholder,
      })
    },
    setLocalstorage(type) {
      if (typeof arguments[0] === 'object') {
        localStorage.setItem('productTags', arguments[1]);
        return
      }
      switch (type) {
        case 'title': {
          localStorage.setItem('product-title', arguments[1])
          break;
        }
        case 'tags': {
          localStorage.setItem('product-tags', arguments[1]);
          break;
        }
      }
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options = this.list.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options = [];
      }
    },
    deleteArticle() {
      let _ts = this;
      _ts.doLoading = true;
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let id = _ts.$route.params.product_id;
        _ts.$axios.$delete('/api/product/delete/' + id).then(function (res) {
          if (res && res.message) {
            _ts.$message(res.message);
            return false;
          }
          localStorage.removeItem('product-title');
          localStorage.removeItem('product-tags');
          _ts.contentEditor.setValue('');
          _ts.$set(_ts, 'notificationFlag', false);
          _ts.$router.push({
            name: 'admin-products'
          })
        })
      }).catch(() => {
        _ts.doLoading = false;
      });

    },
    async postArticle() {
      let _ts = this;
      _ts.doLoading = true;
      let productContent = _ts.contentEditor.getValue();
      let productContentHtml = await _ts.contentEditor.getHTML();
      if (!(_ts.formStore.productTitle && productContent)) {
        _ts.$message("标题/正文不能为空！");
        _ts.doLoading = false;
        return false;
      }
      let product = {
        productContent: productContent,
        productContentHtml: productContentHtml,
        productStatus: 0,
        ..._ts.formStore

      };
      _ts.$axios[_ts.formStore.idProduct ? '$put' : '$post']('/api/product/post', product).then(function (res) {
        if (res) {
          if (res.message) {
            _ts.$message(res.message);
            _ts.doLoading = false;
            return false;
          }
          localStorage.removeItem('product-title');
          localStorage.removeItem('product-tags');
          _ts.contentEditor.setValue('');
          _ts.$store.commit('product/clearDetailData')
          _ts.$set(_ts, 'notificationFlag', false);
          _ts.$router.push({
            name: 'admin-products'
          })
        }
      })

    },
    async saveArticle() {
      let _ts = this;
      _ts.doLoading = true;
      let id = _ts.$route.params.product_id;
      let productContent = _ts.contentEditor.getValue();
      let productContentHtml = await _ts.contentEditor.getHTML();
      if (!(_ts.formStore.productTitle && productContent)) {
        _ts.$message("标题/正文不能为空！");
        _ts.doLoading = false;
        return false;
      }

      let product = {
        productContent: productContent,
        productContentHtml: productContentHtml,
        productStatus: 1,
        ..._ts.formStore
      };

      _ts.$axios[_ts.formStore.idProduct ? '$put' : '$post']('/api/product/post', product).then(function (res) {
        if (res) {
          if (res.message) {
            _ts.$message(res.message);
            _ts.doLoading = false;
            return false;
          }
          localStorage.removeItem('product-title');
          localStorage.removeItem('product-tags');
          _ts.contentEditor.setValue('');
          _ts.$set(_ts, 'notificationFlag', false);
          _ts.$router.push({
            name: 'admin-products'
          })
        }
      })
    },
    getTags() {
      let _ts = this;
      _ts.$axios.$get('/api/tag/tags').then(function (res) {
        if (res) {
          _ts.$set(_ts, 'list', res);
        }
      })
    }
  },
  beforeRouteLeave(to, from, next) {
    let _ts = this;
    if (_ts.notificationFlag) {
      _ts.$confirm('系统可能不会保存您所做的更改。', '离开此网站?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        next();
      }).catch(() => {
        return false
      });
      _ts.$store.commit("setActiveMenu", "product-post");
    } else {
      next();
    }
  },
  beforeDestroy() {
    window.onbeforeunload = null;
  },
  async mounted() {
    window.addEventListener('beforeunload', e => {
      e = e || window.event;
      if (e) {
        e.returnValue = '关闭提示';
      }
      return '关闭提示';
    });
    let _ts = this;
    _ts.$store.commit('setActiveMenu', 'product-post');
    const responseData = await _ts.$axios.$get('/api/upload/token');
    if (responseData) {
      _ts.$set(_ts, 'tokenURL', {
        token: responseData.uploadToken || '',
        URL: responseData.uploadURL || '',
        linkToImageURL: responseData.linkToImageURL || ''
      })
    }
    console.log('test')

    _ts.getTags();
    Vue.nextTick(() => {
      console.log('test')

      let productContent = '';
      if (_ts.$route.params.product_id) {
        _ts.$set(_ts, 'isEdit', true);
        let product = _ts.product;
        _ts.formStore = JSON.parse(JSON.stringify(product))
        console.log(product)

        // _ts.$set(_ts, 'idArticle', product.idArticle);
        // _ts.$set(_ts, 'productTitle', product.productTitle);
        // _ts.$set(_ts, 'productContent', product.productContent);
        // _ts.$set(_ts, 'productStatus', product.productStatus);
        // _ts.$set(_ts, 'productTags', (product.tags).split(','));
        // localStorage.setItem("product-title", product.productTitle);
        // localStorage.setItem("product-tags", (product.tags).split(','));
        productContent = product.productContent
      } else {
        _ts.$set(_ts, 'isEdit', false);
      }
      _ts.contentEditor = _ts._initEditor({
        id: 'contentEditor',
        mode: 'both',
        height: 480,
        placeholder: '', //_ts.$t('inputContent', _ts.$store.state.locale)
        resize: false,
        value: productContent
      });
    })
  }
}
</script>

<style lang="less">
@import "~vditor/src/assets/less/index.less";
</style>
