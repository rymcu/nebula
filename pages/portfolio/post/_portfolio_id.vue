<template>
  <el-row class="wrapper">
    <el-col v-if="isEdit" style="margin-bottom: 1rem;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/portfolio/manager/' + idPortfolio }">{{ portfolio.portfolioTitle }}
        </el-breadcrumb-item>
        <el-breadcrumb-item>更新作品集</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col>
      <h1>创建作品集</h1>
    </el-col>
    <el-col style="margin-bottom: 1rem;">
      作品集需要有明确的写作方向，如果您在某个领域有深度的研究，欢迎创建自己的作品集分享自己的观点
    </el-col>
    <el-col>
      <el-form :model="portfolio" :rules="rules" ref="topic" label-width="100px">
        <el-form-item label="作品集名称" prop="portfolioTitle">
          <el-input v-model="portfolio.portfolioTitle"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-upload
            class="avatar-uploader"
            :action="tokenURL.URL"
            :multiple="true"
            :with-credentials="true"
            :headers="uploadHeaders"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="headImgUrl" class="topic-brand-img" :src="headImgUrl">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="作品集介绍" prop="portfolioDescription">
          <div id="contentEditor"></div>
        </el-form-item>
        <el-form-item class="text-right">
          <el-button v-if="isEdit" @click="deletePortfolio" :loading="loading">删除</el-button>
          <el-button v-if="isEdit" @click="updatePortfolio" :loading="loading">更新</el-button>
          <el-button v-else @click="updatePortfolio" :loading="loading">提交</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
  import Vue from 'vue';
  import {mapState} from 'vuex';

  export default {
    name: "PortfolioPost",
    validate({params, store}) {
      if (typeof params.portfolio_id === 'undefined') {
        return true;
      }
      return params.portfolio_id && !isNaN(Number(params.portfolio_id))
    },
    fetch({store, params, error}) {
      return Promise.all([
        store.dispatch('portfolio/fetchPostDetail', params)
          .catch(err => error({statusCode: 404}))
      ])
    },
    computed: {
      ...mapState({
        portfolioDetail: state => state.portfolio.detail.data,
        uploadHeaders: state => {
          return {'X-Upload-Token': state.uploadHeaders}
        }
      }),
      idPortfolio() {
        return this.$route.params.portfolio_id ? this.$route.params.portfolio_id : 0
      }
    },
    data() {
      return {
        contentEditor: null,
        portfolio: {
          idPortfolio: 0,
          portfolioDescription: ''
        },
        rules: {
          portfolioTitle: [
            {required: true, message: '请输入作品集名称', trigger: 'blur'}
          ],
          portfolioDescription: [
            {required: true, message: '请输入作品集介绍', trigger: 'blur'}
          ]
        },
        loading: false,
        tokenURL: {
          URL: '',
          token: ''
        },
        headImgUrl: '',
        isEdit: false
      }
    },
    methods: {
      _initEditor(data) {
        let _ts = this;
        let toolbar;
        if (window.innerWidth < 768) {
          toolbar = [
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
            'record',
            'table',
            '|',
            'undo',
            'redo',
            '|',
            'edit-mode',
            'content-theme',
            'code-theme',
            {
              name: 'more',
              toolbar: [
                'fullscreen',
                'both',
                'format',
                'preview',
                'info',
                'help',
              ],
            }]
        }
        return new Vue.Vditor(data.id, {
          toolbar,
          mode: 'sv',
          tab: '\t',
          cache: {
            enable: this.$route.params.article_id ? false : true,
            id: this.$route.params.article_id ? this.$route.params.article_id : '',
          },
          after() {
            _ts.contentEditor.setValue(data.value ? data.value : '');
          },
          preview: {
            markdown: {
              toc: true,
            },
            math: {
              inlineDigit: true
            },
            delay: 500,
            mode: data.mode,
            /*url: `${process.env.Server}/api/console/markdown`,*/
            parse: (element) => {
              if (element.style.display === 'none') {
                return
              }
              // LazyLoadImage();
              // Vue.Vditor.highlightRender({style: 'github'}, element, this.contentEditor);
            }
          },
          upload: {
            max: 10 * 1024 * 1024,
            url: this.tokenURL.URL,
            linkToImgUrl: this.tokenURL.URL,
            token: this.tokenURL.token,
            filename: name => name.replace(/\?|\\|\/|:|\||<|>|\*|\[|\]|\s+/g, '-')
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
      handleAvatarSuccess(res) {
        let _ts = this;
        if (res && res.data && res.data.url) {
          let portfolio = _ts.portfolio;
          portfolio.headImgUrl = res.data.url;
          _ts.$set(_ts, 'portfolio', portfolio);
          _ts.$set(_ts, 'headImgUrl', res.data.url);
        } else {
          _ts.$message.error('上传失败!');
        }
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!(isJPG || isPNG)) {
          this.$message.error('上传图标只能是 JPG 或者 PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图标大小不能超过 2MB!');
        }
        return (isJPG || isPNG) && isLt2M;
      },
      async updatePortfolio() {
        let _ts = this;
        _ts.$set(_ts, 'loading', true);
        let id = _ts.idPortfolio;
        let portfolioDescription = _ts.contentEditor.getValue();
        let portfolioDescriptionHtml = await _ts.contentEditor.getHTML();
        let data = _ts.portfolio;
        data.portfolioDescription = portfolioDescription;
        data.portfolioDescriptionHtml = portfolioDescriptionHtml;
        let title = id ? '更新' : '添加';
        _ts.$axios[id ? '$put' : '$post']('/api/portfolio/post', data).then(function (res) {
          if (res && res.message) {
            _ts.$message.error(res.message);
          } else {
            _ts.contentEditor.setValue(res.portfolioDescription);
            _ts.$message({
              type: 'success',
              message: title + '成功!'
            });
            _ts.$router.push({
              path: '/portfolio/' + res.idPortfolio
            });
          }
          _ts.$set(_ts, 'loading', false)
        }).catch(error => _ts.$set(_ts, 'loading', false))
      },
      deletePortfolio() {
        let _ts = this;
        _ts.$confirm('确定删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _ts.$axios.$delete('/api/portfolio/delete', {
            params: {
              idPortfolio: _ts.idPortfolio
            }
          }).then(function (res) {
            if (res) {
              if (res.message) {
                _ts.$message(res.message);
              } else {
                _ts.$router.push({
                  path: '/user/' + _ts.$store.state.userInfo?.nickname
                })
              }
            }
          })
        }).catch(() => {
          _ts.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }
    },
    mounted() {
      let _ts = this;
      _ts.$store.commit("setActiveMenu", "portfolio-post");
      this.$axios.$get('/api/upload/simple/token').then(function (res) {
        if (res) {
          _ts.$store.commit('setUploadHeaders', res.uploadToken);
          _ts.$set(_ts, 'tokenURL', {
            token: res.uploadToken || '',
            URL: res.uploadURL || '',
          })
        }
      });

      let portfolioContent = '';
      if (_ts.idPortfolio) {
        _ts.$set(_ts, 'isEdit', true);
        _ts.$set(_ts, 'portfolio', _ts.portfolioDetail);
        _ts.$set(_ts, 'headImgUrl', _ts.portfolioDetail.headImgUrl);
        portfolioContent = _ts.portfolioDetail.portfolioDescription
      } else {
        _ts.$set(_ts, 'isEdit', false);
      }

      this.contentEditor = this._initEditor({
        id: 'contentEditor',
        mode: 'both',
        height: 480,
        placeholder: '', //this.$t('inputContent', this.$store.state.locale)
        resize: false,
        value: portfolioContent
      });
    }
  }
</script>

<style lang="scss">
  @import "~vditor/src/assets/scss/index.scss";
</style>
