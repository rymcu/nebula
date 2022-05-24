<template>
  <el-row class="guides__wrapper">
    <el-col style="text-align: center;font-weight: bold;padding-bottom: 1rem;">
      <span>Markdown 教程</span>
    </el-col>
    <el-col>
      <div id="contentEditor"></div>
    </el-col>
  </el-row>
</template>

<script>
import Vue from 'vue';
import markdownGuide from 'static/guides/markdown.txt';
import apiConfig from '~/config/api.config';

export default {
  name: "markdown",
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
        mode: 'wysiwyg',
        tab: '\t',
        cdn: apiConfig.VDITOR,
        cache: {
          enable: false
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
          },
          theme: {
            cdn: apiConfig.VDITOR_CSS
          }
        },
        height: data.height,
        outline: true,
        counter: 102400,
        resize: {
          enable: data.resize,
        },
        lang: this.$store.state.locale,
        placeholder: data.placeholder,
      })
    }
  },
  mounted() {
    let _ts = this;
    _ts.$store.commit("setActiveMenu", "guides-markdown");

    _ts.contentEditor = _ts._initEditor({
      id: 'contentEditor',
      mode: 'both',
      placeholder: '', //_ts.$t('inputContent', _ts.$store.state.locale)
      resize: false,
      value: markdownGuide
    });
  }
}
</script>

<style lang="less">
@import "~vditor/src/assets/less/index.less";

.guides__wrapper {
  max-width: 1200px;
  margin: 0 auto;
  display: block;
  padding-left: 1rem;
  padding-right: 1rem;
  box-sizing: border-box;
}
</style>
