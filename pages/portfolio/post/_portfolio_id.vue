<template>
  <div class="wrapper_portfolio" style="margin: 20px">
    <div v-if="isAuthor">
      <div style="margin-bottom: 1rem;" v-if="isEdit">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/portfolio/manager/' + idPortfolio }">{{ portfolio.portfolioTitle }}
          </el-breadcrumb-item>
          <el-breadcrumb-item>更新作品集</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-row :gutter="20">
        <el-col :span="12" :offset="3">
          <el-card>
            <h1>创建作品集</h1>
            <p>作品集需要有明确的写作方向，如果您在某个领域有深度的研究，欢迎创建自己的作品集分享自己的观点</p>
            <el-form :model="portfolio" label-width="100px" ref="topic">
              <el-form-item label="作品集名称">
                <el-input v-model="portfolio.portfolioTitle"></el-input>
              </el-form-item>
              <br>
              <el-form-item label="作品集介绍">
                <content-editor mode="sv" :cacheId="'portfolio-' + (portfolio.idPortfolio || '')"
                                :initValue="portfolio.portfolioDescription||''" v-if="isLoading"
                                ref="contentEditor"></content-editor>
              </el-form-item>
              <el-form-item class="text-right">
                <el-button :loading="loading" @click="deletePortfolio" v-if="isEdit">删除</el-button>
                <el-button :loading="loading" @click="updatePortfolio" v-if="isEdit">更新</el-button>
                <el-button @click="submitData" v-else>提交</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        <el-col :span="6">
          <client-only>
            <el-card>
              <div style="display: block;">
                <div class="cropperBox">
                  <vue-cropper
                    :autoCrop="autoCrop"
                    :img="headImgUrl"
                    ref="cropper"
                    :fixed="true"
                    @realTime="realTime"
                  />
                </div>
                <div class="cropperBox">
                  <div :style="{height:cropImg.h+'px',width:cropImg.w+'px'}"
                       style="overflow:hidden;margin: 0 auto">
                    <img :src="cropImg.url" :style="cropImg.img">
                  </div>
                </div>

                <h4 class="article-header-md">{{ portfolio.portfolioTitle }}</h4>
                <div class="portfolioDescription">
                  {{ portfolio.portfolioDescription }}
                </div>

                <div class="button_box">

                  <el-upload
                    :before-upload="beforeAvatarUpload"
                    :multiple="true"
                    :show-file-list="false"
                    action=""
                    class="avatar-uploader">
                    <div>
                      <el-button plain round type="primary">上传</el-button>
                    </div>
                  </el-upload>

                  <el-button @click="reset" style="margin-left: 10px" plain round type="primary">重置
                  </el-button>
                </div>
              </div>
            </el-card>
          </client-only>
        </el-col>
      </el-row>
    </div>
    <el-col class="text-center" v-else>
      <el-alert
        :closable="false"
        center
        show-icon
        title="用户无权限"
        type="warning">
      </el-alert>
    </el-col>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import ContentEditor from "@/components/ContentEditor.vue";

export default {
  name: "PortfolioPost",
  validate({params, store}) {
    if (typeof params.portfolio_id === 'undefined') {
      return true;
    }
    return params.portfolio_id && !isNaN(Number(params.portfolio_id))
  },
  asyncData({store, params, error}) {
    return Promise.all([
      store.dispatch('portfolio/fetchPostDetail', params)
        .catch(err => error({statusCode: 404}))
    ])
  },
  components: {
    ContentEditor
  },
  computed: {
    ...mapState({
      portfolioDetail: state => state.portfolio.detail.data,
      uploadHeaders: state => {
        return {'X-Upload-Token': state.uploadHeaders}
      },
      isAuthor() {
        let account = this.$store.state.auth.user?.nickname;
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
      portfolio: {
        idPortfolio: 0,
        portfolioDescription: ''
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
      notificationFlag: true,
      contentValue: {
        portfolioDescription: '',
        portfolioDescriptionHtml: ''
      },
      isLoading: false,
      headImgType: '0'
    }
  },
  methods: {
    realTime(data) {
      this.cropImg = data;
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
        _ts.$set(_ts, 'headImgType', '1');
        // _ts.$refs.cropper?.replace(this.result);
      }
    },
    async handleSubmitData() {
      let _ts = this;
      _ts.$set(_ts, 'loading', true);
      let data = _ts.portfolio;
      data.portfolioDescription = _ts.$refs.contentEditor.contentValue();
      data.portfolioDescriptionHtml = await _ts.$refs.contentEditor.contentHtml();
      data.headImgType = _ts.headImgType;
      data.headImgUrl = _ts.headImgUrl;
      if ((data.portfolioDescription || undefined) === undefined || (data.portfolioDescriptionHtml || undefined) === undefined) {
        this.$message.error('请输入必填信息');
        return false
      }
      return data
    },
    async submitData() {
      let _ts = this
      let data = await this.handleSubmitData()
      let id = _ts.idPortfolio;
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
    async updatePortfolio() {
      let _ts = this
      let data = await this.handleSubmitData()
      let id = _ts.idPortfolio;

      this.$refs.cropper.getCropData(img => {
        data.headImgUrl = img
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
      })
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
            _ts.$set(_ts, 'notificationFlag', false);
            _ts.$router.push({
              path: '/user/' + _ts.$store.state.auth.user?.account
            })
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
      this.headImgUrl = ''
      this.$set(this, 'headImgType', '0');
      // this.$refs.cropper.clearCrop()
    },
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

    let portfolioContent = '';
    if (_ts.idPortfolio) {
      // this.isEdit = true
      _ts.$set(_ts, 'isEdit', true);
      _ts.$set(_ts, 'portfolio', JSON.parse(JSON.stringify(_ts.portfolioDetail)));
      _ts.$set(_ts, 'headImgUrl', _ts.portfolioDetail.headImgUrl);
      if (!this.isEdit) {
        _ts.$refs?.cropper?.replace(_ts.portfolioDetail.headImgUrl);
        portfolioContent = _ts.portfolioDetail.portfolioDescription;
      }
    } else {
      this.isEdit = false
    }
    this.isLoading = true
  }
}
</script>

<style lang="less">

.button_box {
  display: flex;
}

.wrapper_portfolio {
  width: 100%;
  max-width: 100%;
}

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
  height: 380px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  overflow: hidden;
  border: 1px solid red;

  > img {
    display: block;
    margin: 0 auto;
  }
}

.portfolioDescription {
  min-height: 50px;
  font-size: 12px;
  color: #909399;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  word-break: break-all;
}

.cropperBox {
  width: 100%;
  height: 300px;
  margin-bottom: 20px;
  border: 1px solid #F2F6FC;
}
</style>
