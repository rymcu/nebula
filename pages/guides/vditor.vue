<template>
  <el-row class="guides__wrapper">
    <el-col style="text-align: center;font-weight: bold;padding-bottom: 1rem;">
      <span>Vditor 教程</span>
    </el-col>
    <el-col>
      <div id="contentEditor"></div>
    </el-col>
  </el-row>
</template>

<script>
import Vue from 'vue';
import apiConfig from '~/config/api.config';

export default {
  name: "vditor",
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
    _ts.$store.commit("setActiveMenu", "guides-vditor");

    _ts.contentEditor = _ts._initEditor({
      id: 'contentEditor',
      mode: 'both',
      height: 480,
      placeholder: '', //_ts.$t('inputContent', _ts.$store.state.locale)
      resize: false,
      value: '正在编辑中'
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
