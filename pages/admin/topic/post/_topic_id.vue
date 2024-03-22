<template>
  <el-row style="margin-top: 20px;">
    <el-col style="margin-bottom: 1rem;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/admin/topics' }">专题管理</el-breadcrumb-item>
        <el-breadcrumb-item v-if="topic.idTopic" :to="{ path: '/admin/topic/' + topic.topicUri }">{{
            topic.topicTitle
          }}
        </el-breadcrumb-item>
        <el-breadcrumb-item v-if="topic.idTopic">编辑</el-breadcrumb-item>
        <el-breadcrumb-item v-else>创建</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col>
      <el-form :model="topic" :rules="rules" ref="topic" label-width="100px" class="demo-ruleForm">
        <el-form-item label="主题名称" prop="topicTitle">
          <el-input v-model="topic.topicTitle"></el-input>
        </el-form-item>
        <el-form-item label="URI" prop="topicUri">
          <el-input v-model="topic.topicUri"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-row>
            <el-col :span="24">
              <img @click="cropperVisible = true" :src="topic.topicIconPath" style="width: 80px;height: 80px"/>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="描述">
          <div id="contentEditor"></div>
        </el-form-item>
        <el-form-item label="导航主题">
          <el-switch
            v-model="topic.topicNva"
            active-text="启用"
            inactive-text="禁用"
            active-value="0"
            inactive-value="1">
          </el-switch>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="topic.topicStatus"
            active-text="启用"
            inactive-text="禁用"
            active-value="0"
            inactive-value="1">
          </el-switch>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="topic.topicSort" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="标签数">
          <el-input v-model="topic.topicTagCount" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item class="text-right">
          <el-button @click="updateTopic" :loading="loading" plain>提交</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <ImgCropper @onSubmit="updateTopicIcon" :visible.sync='cropperVisible' :avatarUrl="topicIconPath||''"></ImgCropper>

  </el-row>
</template>

<script>
import Vue from 'vue';
import {mapState} from 'vuex';
import VueCropper from 'vue-cropper';
import apiConfig from '~/config/api.config';
import ImgCropper from "~/components/ImgCropper.vue";

export default {
  name: "adminTopicPost",
  middleware: 'auth',
  components: {
    VueCropper, ImgCropper
  },
  validate({params}) {
    if (typeof params.topic_id === 'undefined') {
      return true;
    }
    return params.topic_id && !isNaN(Number(params.topic_id))
  },
  asyncData({store, params, error}) {
    return Promise.all([
      store.dispatch('topic/fetchPostDetail', params)
        .catch(err => error({statusCode: 404}))
    ])
  },
  computed: {
    ...mapState({
      uploadHeaders: state => {
        return {'X-Upload-Token': state.uploadHeaders}
      },
      topicInfo: state => state.topic.detail.data
    })
  },
  data() {
    return {
      topic: {
        topicTitle: '',
        topicIconPath: '',
        topicDescription: '',
        topicNva: '0',
        topicStatus: '0',
        topicTagCount: 0,
        topicSort: 10
      },
      rules: {
        topicTitle: [
          {required: true, message: '请输入主题名称', trigger: 'blur'}
        ],
        topicUri: [
          {required: true, message: '请输入主题uri', trigger: 'blur'}
        ]
      },
      loading: false,
      tokenURL: {
        URL: '',
        linkToImageURL: '',
        token: ''
      },
      topicIconPath: '',
      isEdit: false,
      autoCrop: true,
      notificationFlag: true,
      cropperVisible: false,
      contentEditor: {}

    }
  },
  methods: {
    updateTopicIcon(data) {
      this.topic.topicIconPath = data
      this.topicIconPath = data
      this.topic.topicImageType = '1'
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
          enable: this.$route.params.topic_id ? false : true,
          id: this.$route.params.topic_id ? this.$route.params.topic_id : '',
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
    async updateTopic() {
      let _ts = this;
      _ts.$set(_ts, 'loading', true);
      let id = _ts.topic.idTopic;
      let topicDescription = _ts.contentEditor.getValue();
      let topicDescriptionHtml = await _ts.contentEditor.getHTML();
      let data = _ts.topic;
      data.topicDescription = topicDescription;
      data.topicDescriptionHtml = topicDescriptionHtml;
      let title = id ? '更新' : '添加';
      _ts.$axios[id ? '$put' : '$post']('/api/admin/topic/post', data).then(function (res) {
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
        })
      }
    });

    Vue.nextTick(() => {
      let topicDescription = '';
      if (_ts.$route.params.topic_id) {
        let topic = _ts.topicInfo
        _ts.$set(_ts, 'topic', JSON.parse(JSON.stringify(topic)));
        _ts.$set(_ts, 'isEdit', true);
        topicDescription = _ts.topic.topicDescription;
      } else {
        _ts.$set(_ts, 'isEdit', false);
      }
      _ts.contentEditor = _ts._initEditor({
        id: 'contentEditor',
        mode: 'both',
        height: 300,
        placeholder: '', //this.$t('inputContent', this.$store.state.locale)
        resize: false,
        value: topicDescription,
      });
    })
  },

}
</script>

<style lang="less">
@import "~vditor/src/assets/less/index.less";

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
  height: 144px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  overflow: hidden;
}
</style>
