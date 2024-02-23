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
    }
  },
  props: {
    initValue: {
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
          enable: this.$route.params.article_id ? false : true,
          id: this.$route.params.article_id ? this.$route.params.article_id : '',
        },
        after() {
          _ts.contentEditor.setValue(data.value ? data.value : '');

        },
        typewriterMode: true,
        hint: {
          emoji: Vue.emoji
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
              return false
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
        // placeholder: data.placeholder,
      })
    },
    editValue() {
      console.log('我被执行了')
      let data = this.contentEditor.getValue();
      this.$emit('editValue', data)
    },
    editHtml() {
      let data = this.contentEditor.getHTML();
      this.$emit('editHtml', data)
    }
  },
  mounted() {
    this.contentEditor = this._initEditor({
      id: 'contentEditor',
      mode: 'both',
      height: 480,
      placeholder: '', //this.$t('inputContent', this.$store.state.locale)
      resize: false,
      value: this.initValue
    });
  }
}
</script>

<style scoped>

</style>
