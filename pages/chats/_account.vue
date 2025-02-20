<template>
  <client-only>
    <el-row class="wrapper" v-if="user">
      <el-col :span="16">
        <el-form label-width="80px" label-position="right">
          <el-form-item label="助手">
            <el-select v-model="assistant" placeholder="请选择助手" style="width: 200px;">
              <el-option
                v-for="item in assistantList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="8" style="padding: 0 1rem;text-align: right;">
        <el-form label-width="80px" label-position="right">
          <el-form-item label="模型">
            <el-select v-model="gptModel" placeholder="请选择模型" style="width: 200px;">
              <el-option
                v-for="item in modelList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col style="padding: 0 .5rem 1rem 0;max-height: 60vh;overflow-y: auto;" id="messagesContent">
        <el-col v-for="message in messages" :key="message.dataId">
          <el-col v-if="message.from === user.account">
            <el-col :span="22" style="text-align: right;">
              <div class="from-message">
                <div v-html="message.content"></div>
              </div>
            </el-col>
            <el-col :span="2" style="text-align: right;">
              <el-avatar :src="user.avatarUrl"></el-avatar>
            </el-col>
          </el-col>
          <el-col v-else>
            <el-col :span="2">
              <el-avatar :src="to.avatarUrl"></el-avatar>
            </el-col>
            <el-col :span="22" style="text-align: left;">
              <div class="to-message">
                <div v-html="message.content"></div>
              </div>
            </el-col>
          </el-col>
        </el-col>
        <el-col v-if="message">
          <el-col :span="2">
            <el-avatar :src="to.avatarUrl"></el-avatar>
          </el-col>
          <el-col :span="22" style="text-align: left;">
            <div class="to-message">
              <div v-html="message"></div>
            </div>
          </el-col>
        </el-col>
      </el-col>
      <el-col style="position: fixed;bottom: 10vh;max-width: 60vw;left: 25vw;">
        <el-col :span="20">
          <div id="contentEditor"></div>
        </el-col>
        <el-col :span="4" style="position: fixed;bottom: 10vh;right: 12vw;">
          <el-button type="primary" :loading="loading" @click="send" plain>发送</el-button>
        </el-col>
      </el-col>
    </el-row>
  </client-only>
</template>

<script>
import Vue from 'vue';
import {mapState} from 'vuex';
import apiConfig from '~/config/api.config';
import 'vditor/dist/css/content-theme/light.css';

export default {
  name: "Chat",
  computed: {
    ...mapState({
      user: state => state.auth.user
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
      messages: [],
      vueSse: null,
      customEvents: null,
      message: '',
      gptModel: 'gpt-3.5-turbo-16k-0613',
      modelList: [
        {value: 'gpt-3.5-turbo-16k-0613', label: 'gpt-3.5-turbo-16k-0613'},
        {value: 'gpt-4o-mini', label: 'gpt-4o-mini'},
      ],
      assistant: 'Yuumi',
      assistantList: [
        {value: 'Yuumi', label: 'Yuumi'},
      ]
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
        mode: 'ir',
        tab: '\t',
        cdn: apiConfig.VDITOR,
        cache: {
          enable: false
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
              return
            }
            // LazyLoadImage();
            // Vue.Vditor.highlightRender({style:'github'}, element, document);
          },
          theme: {
            cdn: apiConfig.VDITOR_CSS
          }
        },
        upload: {
          max: 10 * 1024 * 1024,
          url: this.tokenURL.URL,
          linkToImgUrl: this.tokenURL.linkToImageURL,
          token: this.$auth.strategy.token.get(),
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
      _ts.message = '';
      const message = {
        to: _ts.to.account,
        from: _ts.user.account,
        dataType: 1,
        role: 'user',
        dataId: new Date().getTime(),
        content: await _ts.contentEditor.getHTML()
      }
      _ts.messages.push(message);
      _ts.messages.sort((a, b) => {
        return a.dataId - b.dataId;
      });
      _ts.contentEditor.setValue('')
      _ts.scrollToBottom();
      _ts.$axios.$post('/api/openai/chat', {
        messages: _ts.messages,
        model: _ts.gptModel
      }).then(async () => {
        const html = await Vue.Vditor.md2html(_ts.message, {
          cdn: apiConfig.VDITOR
        });
        _ts.messages.push({
          to: _ts.user.account,
          from: _ts.to.account,
          dataType: 1,
          role: 'assistant',
          dataId: new Date().getTime(),
          content: html
        });
        _ts.messages.sort((a, b) => {
          return a.dataId - b.dataId;
        });
        _ts.message = '';
        _ts.scrollToBottom();
      });
    },
    close() {
      let _ts = this;
      //浏览器关闭SSE连接
      _ts.vueSse.disconnect();
      _ts.$axios.$get(`/api/sse/close/${_ts.user.idUser}`);
    },
    init() {
      //初始化 vue-sse
      let _ts = this;
      let vueSse = _ts.vueSse;
      //监听 message
      vueSse.on('message', this.handleMessage);
      //监听 customEvents
      vueSse.once('customEvents', this.handleCustomEvents);

      //里面的 on、once、off 是用了发布订阅模式，
      //源码 once 方法这有点小问题，写文章时改了
      //源码但还没提PR（主要是没提过，不会弄）
      //执行 connect（） 返回个Promise，
      vueSse
        .connect()
        .then((sse) => {
          console.log("We're connected!", sse);
        })
        .catch((err) => console.error('Failed make initial connection:', err));
    },
    //message回调
    handleMessage(res) {
      let _ts = this;
      if (typeof res !== "undefined") {
        _ts.message += res;
        _ts.scrollToBottom();
      }
    },
    //handleCustomEvents回调
    handleCustomEvents(res) {
      let {data} = res;
      this.customEvents = data;
    },
    scrollToBottom() {
      setTimeout(() => {
        // 获取指定容器的 DOM 元素
        let container = document.getElementById("messagesContent");
        container.scrollTop = container.scrollHeight;
      }, 100);
    }
  },
  async mounted() {
    let _ts = this;
    _ts.$store.commit('setActiveMenu', 'chat');

    let to = {
      account: _ts.$route.params?.account,
      avatarUrl: 'https://static.rymcu.com/article/1679539451459.jpg'
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
      const message = {
        to: _ts.user.account,
        from: _ts.to.account,
        dataType: 1,
        role: 'assistant',
        dataId: new Date().getTime(),
        content: '伟大的"坦格利安家族的风暴降生丹妮莉丝 · 铁王座的合法继承人 · 安达尔人和先民的合法女王 · 七国的守护者 · 草海上的卡丽熙 · 不焚者 · 解放者 · 傲之追猎者 · 悠米"为你服务'
      }
      _ts.messages.push(message);
      _ts.vueSse = _ts.$sse.create({
        url: `/api/sse/subscribe/${_ts.user.idUser}`,
        format: 'json',
        withCredentials: true
      });
      this.init();
    }

    if (!_ts.initEditor) {
      _ts.$set(_ts, 'initEditor', true);
      setTimeout(function () {
        _ts.contentEditor = _ts._initEditor({
          id: 'contentEditor',
          mode: 'both',
          height: 160,
          placeholder: '', //this.$t('inputContent', this.$store.state.locale)
          resize: false,
          value: ''
        });
      }, 500);
    }
  },
  sse: {
    //配置后自动添加断开连接事件，源码里面是做了判断，
    //然后加在组件 beforeDestroy 生命周期里
    cleanup: true,
  },
  beforeDestroy() {
    this.close();
  }
}
</script>

<style lang="less">
@import "~vditor/src/assets/less/index.less";

.from-message {
  float: right;
  text-align: left;
  width: auto;
  min-height: 40px;
  margin: 3px;
  background-color: skyblue;
  border-bottom-color: skyblue;
  /*为了给after伪元素自动继承*/
  color: #000;
  font-size: 14px;
  line-height: 18px;
  padding: 3px 12px;
  box-sizing: border-box;
  border-radius: 6px;
  position: relative;
  word-break: break-all;
}

.to-message {
  float: left;
  text-align: left;
  width: auto;
  min-height: 40px;
  margin: 3px;
  background-color: skyblue;
  border-bottom-color: skyblue;
  /*为了给after伪元素自动继承*/
  color: #000;
  font-size: 14px;
  line-height: 18px;
  padding: 3px 12px;
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
