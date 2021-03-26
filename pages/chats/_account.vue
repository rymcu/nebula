<template>
  <client-only>
    <el-row class="wrapper" v-if="user">
      <el-col>
        <div id="contentEditor"></div>
      </el-col>
      <el-col style="margin-top: 1rem;padding-right:3rem;text-align: right;">
        <el-button type="primary" :loading="loading" @click="send" plain>发送</el-button>
      </el-col>
      <el-col style="margin-top: 2rem;" id="messagesContent">
        <el-col v-for="message in Array.prototype.reverse.call(messages)" :key="message.dataId">
          <el-col v-if="message.from === user.account">
            <el-col :span="22" style="text-align: right;">
              <div class="from-message">
                <div v-html="message.content"></div>
              </div>
            </el-col>
            <el-col :span="2" style="text-align: right;">
              <el-avatar :src="user.avatarURL"></el-avatar>
            </el-col>
          </el-col>
          <el-col v-else>
            <el-col :span="2">
              <el-avatar :src="to.avatarURL"></el-avatar>
            </el-col>
            <el-col :span="22" style="text-align: left;">
              <div class="to-message">
                <div v-html="message.content"></div>
              </div>
            </el-col>
          </el-col>
        </el-col>
      </el-col>
    </el-row>
  </client-only>
</template>

<script>
import Vue from 'vue';
import {mapState} from 'vuex';
import sockClient from '~/plugins/sockjs';

export default {
  name: "Chat",
  computed: {
    ...mapState({
      user: state => state.userInfo
    })
  },
  data() {
    return {
      contentEditor: null,
      tokenURL: {
        URL: '',
        linkToImageURL: '',
        token: ''
      },
      drawer: false,
      direction: 'btt',
      initEditor: false,
      isShow: true,
      loading: false,
      to: {},
      messages: []
    }
  },
  watch: {
    messages(value) {
      console.log(value);
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
          enable: this.postId ? false : true,
          id: this.postId ? this.postId : '',
        },
        after() {
          _ts.contentEditor.setValue(data.value ? data.value : '');
        },
        preview: {
          markdown: {
            toc: true,
          },
          delay: 500,
          mode: data.mode,
          /*url: `${process.env.Server}/api/console/markdown`,*/
          parse: (element) => {
            if (element.style.display === 'none') {
              return
            }
            // LazyLoadImage();
            // Vue.Vditor.highlightRender({style:'github'}, element, document);
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
    async send() {
      let _ts = this;
      const message = {
        to: _ts.to.account,
        from: _ts.user.account,
        dataType: 1,
        dataId: new Date().getTime(),
        content: await _ts.contentEditor.getHTML()
      }
      _ts.messages.push(message);
      _ts.contentEditor.setValue('')
      sockClient.sendMessage(message)
    }
  },
  async mounted() {
    let _ts = this;
    _ts.$store.commit('setActiveMenu', 'post-article');

    let to = {
      account: _ts.$route.params?.account
    }

    _ts.$set(_ts, 'to', to);

    if (_ts.user) {
      const responseData = await _ts.$axios.$get('/api/upload/token');
      if (responseData) {
        _ts.$set(_ts, 'tokenURL', {
          token: responseData.uploadToken || '',
          URL: responseData.uploadURL || '',
          linkToImageURL: responseData.linkToImageURL || ''
        })
      }
    }

    if (!_ts.initEditor) {
      _ts.$set(_ts, 'initEditor', true);
      setTimeout(function () {
        _ts.contentEditor = _ts._initEditor({
          id: 'contentEditor',
          mode: 'both',
          height: 200,
          placeholder: '', //this.$t('inputContent', this.$store.state.locale)
          resize: false,
          value: ''
        });
      }, 500);
    }
  }
}
</script>

<style lang="scss">
@import "~vditor/src/assets/scss/index.scss";

.from-message {
  float: right;
  width: auto;
  min-height: 40px;
  margin: 10px;
  background-color: skyblue;
  border-bottom-color: skyblue;
  /*为了给after伪元素自动继承*/
  color: #fff;
  font-size: 12px;
  line-height: 18px;
  padding: 5px 12px 5px 12px;
  box-sizing: border-box;
  border-radius: 6px;
  position: relative;
  word-break: break-all;
}

.to-message {
  float: left;
  width: auto;
  min-height: 40px;
  margin: 10px;
  background-color: skyblue;
  border-bottom-color: skyblue;
  /*为了给after伪元素自动继承*/
  color: #fff;
  font-size: 12px;
  line-height: 18px;
  padding: 5px 12px 5px 12px;
  box-sizing: border-box;
  border-radius: 6px;
  position: relative;
  word-break: break-all;
}

.from-message::after {
  content: '';
  position: absolute;
  top: 50%;
  right: -5px;
  width: 10px;
  height: 10px;
  margin-top: -5px;
  background: inherit;
  /*自动继承父元素的背景*/
  transform: rotate(45deg);
}

/** 通过对小正方形旋转45度解决 **/
.to-message::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -5px;
  width: 10px;
  height: 10px;
  margin-top: -5px;
  background: inherit;
  /*自动继承父元素的背景*/
  transform: rotate(45deg);
}
</style>
