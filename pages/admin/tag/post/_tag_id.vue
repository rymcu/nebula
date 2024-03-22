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
          <el-row>
            <el-col :span="24">
              <img @click="cropperVisible=true" :src="tag.tagIconPath" style="width: 80px;height: 80px"/>
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
    <ImgCropper @onSubmit="updateTagIcon" :visible.sync='cropperVisible' :avatarUrl="tagIconPath || ''"></ImgCropper>
  </el-row>
</template>

<script>
import Vue from "vue";
import {mapState} from 'vuex';
import VueCropper from "vue-cropper";
import apiConfig from '~/config/api.config';
import ImgCropper from "~/components/ImgCropper.vue";

export default {
  name: "PostTag",
  middleware: 'auth',
  components: {
    VueCropper, ImgCropper
  },
  validate({params}) {
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
      },
      tagInfo: state => state.tag.detail.data
    })
  },
  data() {
    return {
      tokenURL: {
        URL: '',
        linkToImageURL: '',
        token: ''
      },
      tag: {},
      tagIconPath: '',
      loading: false,
      isEdit: false,
      autoCrop: true,
      cropperVisible: false,
      notificationFlag: true
    }
  },
  methods: {
    updateTagIcon(data) {
      this.tag.tagIconPath = data
      this.tagIconPath = data
      this.tag.tagImageType = '1'
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
    async updateTag() {
      let _ts = this;
      _ts.$set(_ts, 'loading', true);
      let tag = _ts.tag;
      let id = tag.idTag;
      let tagDescription = _ts.contentEditor.getValue();
      let tagDescriptionHtml = await _ts.contentEditor.getHTML();
      tag.tagDescription = tagDescription;
      tag.tagDescriptionHtml = tagDescriptionHtml;
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
  async mounted() {
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
    const responseData = await _ts.$axios.$get('/api/upload/simple/token');
    if (responseData) {
      _ts.$store.commit('setUploadHeaders', responseData.uploadToken);
      _ts.$set(_ts, 'tokenURL', {
        token: responseData.uploadToken || '',
        URL: responseData.uploadURL || '',
        linkToImageURL: responseData.linkToImageURL || ''
      })
    }

    Vue.nextTick(() => {
      let tagDescription = '';
      if (_ts.$route.params.tag_id) {
        let tag = _ts.tagInfo
        _ts.$set(_ts, 'tag', JSON.parse(JSON.stringify(tag)));
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
