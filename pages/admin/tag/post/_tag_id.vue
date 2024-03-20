<template>
  <el-row style="margin-top: 20px;">
    <el-col style="margin-bottom: 1rem;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/admin/tags' }">标签管理</el-breadcrumb-item>
        <el-breadcrumb-item v-if="tag.idTag">编辑</el-breadcrumb-item>
        <el-breadcrumb-item v-else>创建</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col>
      <el-form ref="form" :model="tag" label-width="80px">
        <el-form-item label="标签名">
          <el-input v-model="tag.tagTitle"></el-input>
        </el-form-item>
        <el-form-item label="URI">
          <el-input v-model="tag.tagUri"></el-input>
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
            <img v-if="tagIconPath" class="tag-brand-img" :src="tagIconPath">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-row>
            <el-col :span="24">
              <vue-cropper
                ref="cropper"
                :aspect-ratio="1 / 1"
                :src="tagIconPath"
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
                <el-card>
                  <div class="card-body d-flex flex-column">
                    <el-col :span="4" style="text-align: right;">
                      <div v-if="tagIconPath" class="preview preview-large topic-brand-img"/>
                      <el-image v-else class="topic-brand-img"/>
                    </el-col>
                    <el-col :span="20">
                      <el-col>
                        <el-col>
                          <el-link rel="nofollow" :underline="false">
                            <h4>{{ tag.tagTitle }}</h4>
                          </el-link>
                        </el-col>
                        <el-col>
                          <div class="text-muted article-summary-md">{{ tag.tagDescription }}</div>
                        </el-col>
                      </el-col>
                    </el-col>
                  </div>
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
        <el-form-item label="状态">
          <el-switch
            v-model="tag.tagStatus"
            active-text="正常"
            inactive-text="禁用"
            active-value="0"
            inactive-value="1">
          </el-switch>
        </el-form-item>
        <el-form-item label="系统保留">
          <el-switch
            v-model="tag.tagReservation"
            active-text="是"
            inactive-text="否"
            active-value="1"
            inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="描述">
          <div id="contentEditor"></div>
        </el-form-item>
        <el-form-item class="text-right">
          <el-button @click="updateTag" :loading="loading" plain>提交</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import Vue from "vue";
import {mapState} from 'vuex';
import VueCropper from "vue-cropper";
import apiConfig from '~/config/api.config';

export default {
  name: "PostTag",
  middleware: 'auth',
  components: {
    VueCropper
  },
  validate({params, store}) {
    if (typeof params.tag_id === 'undefined') {
      return true;
    }
    return params.tag_id && !isNaN(Number(params.tag_id))
  },
  asyncData({store, params, error}) {
    return Promise.all([
      store.dispatch('tag/fetchPostDetail', params)
        .catch(err => error({statusCode: 404}))
    ])
  },
  computed: {
    ...mapState({
      uploadHeaders: state => {
        return {'X-Upload-Token': state.uploadHeaders}
      }
    })
  },
  data() {
    return {
      tokenURL: {
        URL: '',
        linkToImageURL: '',
        token: ''
      },
      tagIconPath: '',
      loading: false,
      isEdit: false,
      tag: {},
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
        // 'upload',
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
          enable: this.$route.params.tag_id ? false : true,
          id: this.$route.params.tag_id ? this.$route.params.tag_id : '',
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
          },
          theme: {
            cdn: apiConfig.VDITOR_CSS
          }
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
        let tag = _ts.tag;
        tag.tagIconPath = res.data.url;
        _ts.$set(_ts, 'tag', tag);
        _ts.$set(_ts, 'tagIconPath', res.data.url);
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
        return false;
      }
      if (!isLt2M) {
        this.$message.error('上传图标大小不能超过 2MB!');
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
        _ts.$set(_ts, 'tagIconPath', this.result);
        _ts.$refs.cropper.replace(this.result);
      }
    },
    async updateTag() {
      let _ts = this;
      _ts.$set(_ts, 'loading', true);
      let tag = _ts.tag;
      let id = tag.idTag;
      let tagContent = _ts.contentEditor.getValue();
      let tagContentHtml = await _ts.contentEditor.getHTML();
      tag.tagDescription = tagContent;
      tag.tagDescriptionHtml = tagContentHtml;
      let title = id ? '更新' : '添加';
      _ts.$axios[id ? '$put' : '$post']('/api/admin/tag/post', tag).then(function (res) {
        if (res && res.message) {
          _ts.$message.error(res.message);
          _ts.$set(_ts, 'loading', false);
        } else {
          _ts.$message({
            type: 'success',
            message: title + '成功!'
          });
          _ts.$set(_ts, 'loading', false);
          _ts.$set(_ts, 'notificationFlag', false);
        }
      })
    },
    reset() {
      this.$refs.cropper.reset();
    },
    // get image data for post processing, e.g. upload or setting image src
    cropImage() {
      let _ts = this;
      try {
        _ts.cropImg = _ts.$refs.cropper.getCroppedCanvas().toDataURL();
        let tag = _ts.tag;
        tag.tagIconPath = _ts.cropImg;
        _ts.$set(_ts, 'tag', tag);
        _ts.$set(_ts, 'tagIconPath', _ts.cropImg);
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
    _ts.$axios.$get('/api/upload/simple/token').then(function (res) {
      if (res) {
        _ts.$store.commit('setUploadHeaders', res.uploadToken);
        _ts.$set(_ts, 'tokenURL', {
          token: res.uploadToken || '',
          URL: res.uploadURL || '',
          linkToImageURL: res.linkToImageURL || ''
        })
      }
    });

    let tag = _ts.$store.state.tag.detail.data;
    _ts.$set(_ts, 'tag', JSON.parse(JSON.stringify(tag)));

    Vue.nextTick(() => {
      let tagDescription = '';
      if (_ts.$route.params.tag_id) {
        _ts.$set(_ts, 'isEdit', true);
        tagDescription = _ts.tag.tagDescription
      } else {
        _ts.$set(_ts, 'isEdit', false);
      }

      _ts.contentEditor = _ts._initEditor({
        id: 'contentEditor',
        mode: 'both',
        height: 480,
        placeholder: '', //this.$t('inputContent', this.$store.state.locale)
        resize: false,
        value: tagDescription
      });
    })
  }
}
</script>

<style lang="less">
  @import "~vditor/src/assets/less/index.less";
</style>
