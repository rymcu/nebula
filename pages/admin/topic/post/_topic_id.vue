<template>
  <el-row>
    <el-col style="margin-bottom: 1rem;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
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
          <el-upload
            class="avatar-uploader"
            :action="tokenURL.URL"
            :multiple="true"
            :with-credentials="true"
            :headers="uploadHeaders"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="topicIconPath" class="topic-brand-img" :src="topicIconPath">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
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
        <el-form-item label="描述">
          <div id="contentEditor"></div>
        </el-form-item>
        <el-form-item class="text-right">
          <el-button @click="updateTopic" :loading="loading" plain>提交</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import Vue from 'vue';

export default {
  name: "adminTopicPost",
  computed: {
    uploadHeaders() {
      let token = this.$store.getters.uploadHeaders;
      return {'X-Upload-Token': token}
    }
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
        token: ''
      },
      topicIconPath: '',
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
          enable: this.$route.params.topic_id ? false : true,
          id: this.$route.params.topic_id ? this.$route.params.topic_id : '',
        },
        after() {
          _ts.contentEditor.setValue(data.value ? data.value : '');
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
        let topic = _ts.topic;
        topic.topicIconPath = res.data.url;
        _ts.$set(_ts, 'topic', topic);
        _ts.$set(_ts, 'topicIconPath', res.data.url);
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
        } else {
          _ts.$message({
            type: 'success',
            message: title + '成功!'
          });
          _ts.$set(_ts, 'loading', false);
          _ts.contentEditor.setValue('');
          _ts.$router.push({
            path: `/admin/topic/${data.topicUri}`
          })
        }
      })
    }
  },
  async mounted() {
    let _ts = this;
    _ts.$store.commit("setActiveMenu", "admin-topic-post");
    _ts.$axios.$get('/api/upload/simple/token').then(function (res) {
      if (res) {
        _ts.$store.commit('setUploadHeaders', res.uploadToken);
        _ts.$set(_ts, 'tokenURL', {
          token: res.uploadToken || '',
          URL: res.uploadURL || '',
        })
      }
    });


    if (_ts.$route.params.topic_id) {
      _ts.$set(_ts, 'isEdit', true);
      const responseData = await _ts.$axios.$get('/api/admin/topic/detail/' + _ts.$route.params.topic_id);
      _ts.$set(_ts, 'topic', responseData);
      if (responseData.topicIconPath) {
        _ts.$set(_ts,'topicIconPath',responseData.topicIconPath);
      }
    } else {
      _ts.$set(_ts, 'isEdit', false);
    }

    let articleContent = '';
    if (_ts.topic.topicDescription) {
      articleContent = _ts.topic.topicDescription;
    }
    _ts.contentEditor = _ts._initEditor({
      id: 'contentEditor',
      mode: 'both',
      height: 480,
      placeholder: '', //this.$t('inputContent', this.$store.state.locale)
      resize: false,
      value: articleContent
    });
  }
}
</script>

<style lang="scss">
  @import "~vditor/src/assets/scss/index.scss";
</style>
