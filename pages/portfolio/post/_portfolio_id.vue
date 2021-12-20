<template>
  <el-row class="wrapper">
    <el-col v-if="isAuthor">
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
          <el-form-item>
            <el-row>
              <el-col :span="24">
                <vue-cropper
                  ref="cropper"
                  :aspect-ratio="1 / 1"
                  :src="headImgUrl"
                  :checkCrossOrigin="false"
                  :checkOrientation="false"
                  :imgStyle="{width: '480px', height: '480px'}"
                  :autoCropArea="1"
                  :autoCrop="autoCrop"
                  preview=".preview"
                />
              </el-col>
              <el-col :span="24" style="margin-top: 2rem;">
                <el-col :span="8">
                  <el-card :body-style="{ padding: '0px' }">
                    <el-col>
                      <div class="preview preview-large"/>
                    </el-col>
                    <el-col style="padding: 0 10px;">
                      <h4 class="article-header-md">{{ portfolio.portfolioTitle }}</h4>
                    </el-col>
                    <el-col class="text-muted article-summary-md" style="padding: 0 10px;">
                      {{ portfolio.portfolioDescription }}
                    </el-col>
                  </el-card>
                </el-col>
              </el-col>
              <el-col :span="24" style="margin-top: 2rem;">
                <el-upload
                  class="avatar-uploader"
                  action=""
                  :multiple="true"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <div>
                    <el-button type="primary" round plain>上传</el-button>
                  </div>
                </el-upload>
                <el-button style="margin-top: 1rem;" type="primary" round plain @click.prevent="reset">重置</el-button>
                <el-button type="primary" round plain @click.prevent="cropImage">裁剪</el-button>
                <el-col>
                  <span style="color: red;padding-right: 5px;">*</span>
                  <span>上传图片调整至最佳效果后,请点击裁剪按钮截取</span>
                </el-col>
              </el-col>
            </el-row>
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
    </el-col>
    <el-col v-else class="text-center">
      <el-alert
        title="用户无权限"
        type="warning"
        center
        show-icon
        :closable="false">
      </el-alert>
    </el-col>
  </el-row>
</template>

<script>
import Vue from 'vue';
import {mapState} from 'vuex';
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

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
  components: {
    VueCropper
  },
  computed: {
    ...mapState({
      portfolioDetail: state => state.portfolio.detail.data,
      uploadHeaders: state => {
        return {'X-Upload-Token': state.uploadHeaders}
      },
      isAuthor() {
        let account = this.$store.state.userInfo?.nickname;
        if (account) {
          if (this.$route.params.portfolio_id) {
            if (account === this.portfolioDetail.portfolioAuthorName) {
              return true;
            }
          } else {
            return true;
          }
        }
        return false;
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
        linkToImageURL: '',
        token: ''
      },
      headImgUrl: '',
      cropImg: '',
      isEdit: false,
      autoCrop: true,
      notificationFlag: true
    }
  },
  methods: {
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
    handleAvatarSuccess(res) {
      let _ts = this;
      if (res && res.data && res.data.url) {
        let portfolio = _ts.portfolio;
        portfolio.headImgUrl = res.data.url;
        portfolio.headImgType = '0';
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
        this.$message.error('上传图片只能是 JPG 或者 PNG 格式!');
        return false;
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
        return false;
      }
      this.fileToBase64(file);
      return false;
    },
    fileToBase64(file) {
      let _ts = this;
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        _ts.$set(_ts, 'headImgUrl', this.result);
        _ts.$refs.cropper.replace(this.result);
      }
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
          _ts.$message({
            type: 'success',
            message: title + '成功!'
          });
          _ts.$set(_ts, 'notificationFlag', false);
          _ts.$router.push({
            path: '/portfolio/' + res.idPortfolio
          })
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
              _ts.$set(_ts, 'notificationFlag', false);
              _ts.$router.push({
                path: '/user/' + _ts.$store.state.userInfo?.account
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
    },
    reset() {
      this.$refs.cropper.reset();
    },
    // get image data for post processing, e.g. upload or setting image src
    cropImage() {
      let _ts = this;
      try {
        _ts.cropImg = _ts.$refs.cropper.getCroppedCanvas().toDataURL();
        let portfolio = _ts.portfolio;
        portfolio.headImgUrl = _ts.cropImg;
        portfolio.headImgType = '0';
        _ts.$set(_ts, 'portfolio', portfolio);
        _ts.$set(_ts, 'headImgUrl', _ts.cropImg);
        _ts.$message.success('已裁剪 !');
      } catch (e) {
        _ts.$message.error('图片获取失败 !');
        return;
      }
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
        _ts.$store.commit("setActiveMenu", "portfolio-post");
        return false
      });
    } else {
      next();
    }
  },
  beforeDestroy() {
    window.onbeforeunload = null;
  },
  mounted() {
    if (!this.isAuthor) {
      return
    }
    window.addEventListener('beforeunload', e => {
      e = e || window.event;

      // 兼容IE8和Firefox 4之前的版本
      if (e) {
        e.returnValue = '关闭提示';
      }

      // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
      return '关闭提示';
    });
    let _ts = this;
    _ts.$store.commit("setActiveMenu", "portfolio-post");
    this.$axios.$get('/api/upload/simple/token').then(function (res) {
      if (res) {
        _ts.$store.commit('setUploadHeaders', res.uploadToken);
        _ts.$set(_ts, 'tokenURL', {
          token: res.uploadToken || '',
          URL: res.uploadURL || '',
          linkToImageURL: res.linkToImageURL || ''
        })
      }
    });

    let portfolioContent = '';
    if (_ts.idPortfolio) {
      _ts.$set(_ts, 'isEdit', true);
      _ts.$set(_ts, 'portfolio', JSON.parse(JSON.stringify(_ts.portfolioDetail)));
      _ts.$set(_ts, 'headImgUrl', _ts.portfolioDetail.headImgUrl);
      _ts.$refs.cropper.replace(_ts.portfolioDetail.headImgUrl);
      portfolioContent = _ts.portfolioDetail.portfolioDescription;
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

.preview-area {
  width: 16rem;
}

.preview-area p {
  font-size: 1.25rem;
}

.preview-area p:last-of-type {
  margin-top: 1rem;
}

.crop-placeholder {
  width: 36px;
  height: 36px;
  background: #ccc;
}

.cropped-image img {
  max-width: 100%;
}

.img-cropper {
  width: 480px;
  min-height: 480px;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC);
}

.preview-large {
  width: 100%;
  height: 480px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  overflow: hidden;
}
</style>
