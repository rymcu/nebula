<template>
  <div>
    <div id="contentEditor"></div>
  </div>
</template>

<script>
import Vue from "vue";
import apiConfig from "@/config/api.config";

export default {
  name: "contentEditor",
  data() {
    return {
      contentEditor: null,
      tokenURL: {}
    }
  },
  props: {
    initValue: {
      type: String,
      required: true
    },
    cacheId: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      required: true
    }
  },
  methods: {
    _initEditor(data) {
      //初始化
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
        mode: _ts.mode,
        tab: '\t',
        cdn: apiConfig.VDITOR,
        cache: {
          enable: !_ts.cacheId,
          id: _ts.cacheId,
        },
        after() {
          _ts.contentEditor.setValue(data.value ? data.value : '');
        },
        typewriterMode: true,
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
              return false
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
          url: _ts.tokenURL.URL,
          linkToImgUrl: _ts.tokenURL.linkToImageURL,
          token: _ts.tokenURL.token,
          filename: name => name.replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, '').
          replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, '').
          replace('/\\s/g', '')
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
    contentValue() {
      return this.contentEditor.getValue();
    },
    async contentHtml() {
      return await this.contentEditor.getHTML()
    }
  },
  async mounted() {
    let _ts = this;
    const responseData = await _ts.$axios.$get('/api/upload/token');
    if (responseData) {
      _ts.$store.commit('setUploadHeaders', responseData.uploadToken);
      _ts.$set(_ts, 'tokenURL', {
        token: responseData.uploadToken || '',
        URL: responseData.uploadURL || '',
        linkToImageURL: responseData.linkToImageURL || ''
      })
    }
    _ts.contentEditor = _ts._initEditor({
      id: 'contentEditor',
      mode: 'both',
      height: 480,
      placeholder: '', //this.$t('inputContent', this.$store.state.locale)
      resize: false,
      value: _ts.initValue
    });
  }
}
</script>

<style lang="less">
@import "~vditor/src/assets/less/index.less";

</style>
