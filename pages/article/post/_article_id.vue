<template>
  <el-row class="articles">
    <el-col>
      <el-input
        v-model="articleTitle"
        class="article-title"
        placeholder="请输入标题"
        @change="setLocalstorage('title',articleTitle)">
      </el-input>
    </el-col>
    <el-col>
      <div id="contentEditor"></div>
    </el-col>
    <el-col style="margin-top: 1rem;">
      <el-select
        style="width: 100%;"
        v-model="articleTags"
        multiple
        filterable
        allow-create
        default-first-option
        remote
        :remote-method="remoteMethod"
        placeholder="请选择文章标签"
        :loading="loading"
        @change="setLocalstorage('tags',articleTags)">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-col>
    <el-col v-if="!isEdit" style="margin-top: 1rem;padding-right:3rem;text-align: right;">
      <el-button :loading="doLoading" @click="saveArticle" plain>保存草稿</el-button>
      <el-button type="primary" :loading="doLoading" @click="postArticle" plain>发布</el-button>
    </el-col>
    <el-col v-else style="margin-top: 1rem;padding-right:3rem;text-align: right;">
      <el-button type="danger" :loading="doLoading" @click="deleteArticle" plain>删除</el-button>
      <el-button v-if="articleStatus === '1'" :loading="doLoading" @click="saveArticle" plain>保存草稿</el-button>
      <el-button v-if="articleStatus === '0'" :loading="doLoading" type="primary" @click="postArticle" plain>更新</el-button>
      <el-button v-else type="primary" :loading="doLoading" @click="postArticle" plain>发布</el-button>
    </el-col>
  </el-row>
</template>

<script>
  import Vue from 'vue';
  import {mapState} from 'vuex';

  export default {
    name: "PostArticle",
    validate({params, store}) {
      if (typeof params.article_id === 'undefined') {
        return true;
      }
      return params.article_id && !isNaN(Number(params.article_id))
    },
    fetch({store, params, error}) {
      return Promise.all([
        store.dispatch('article/fetchPostDetail', params)
          .catch(err => error({statusCode: 404}))
      ])
    },
    computed: {
      ...mapState({
        article: state => state.article.detail.data
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
        idArticle: 0,
        articleTitle: '',
        articleContent: '',
        articleType: 0,
        articleTags: [],
        articleStatus: '0',
        options: [],
        list: [],
        loading: false,
        doLoading: false,
        isEdit: false
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
            enable: this.$route.params.article_id ? false : true,
            id: this.$route.params.article_id ? this.$route.params.article_id : '',
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
              // Vue.Vditor.highlightRender({style: 'github'}, element, this.contentEditor);
            }
          },
          upload: {
            max: 10 * 1024 * 1024,
            url: this.tokenURL.URL,
            linkToImgUrl: this.tokenURL.linkToImageURL,
            token: this.tokenURL.token,
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
      setLocalstorage(type) {
        if (typeof arguments[0] === 'object') {
          localStorage.setItem('articleTags', arguments[1]);
          return
        }
        switch (type) {
          case 'title': {
            localStorage.setItem('article-title', arguments[1])
            break;
          }
          case 'tags': {
            localStorage.setItem('article-tags', arguments[1]);
            break;
          }
        }
      },
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.options = this.list.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.options = [];
        }
      },
      deleteArticle() {
        let _ts = this;
        _ts.doLoading = true;
        this.$confirm('确定删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let id = _ts.$route.params.article_id;
          _ts.$axios.$delete('/api/article/delete/' + id).then(function (res) {
            if (res && res.message) {
              _ts.$message(res.message);
              return false;
            }
            localStorage.removeItem('article-title');
            localStorage.removeItem('article-tags');
            _ts.contentEditor.setValue('');
            _ts.$router.push({
              name: 'index'
            })
          })
        }).catch(() => {
          _ts.doLoading = false;
        });

      },
      async postArticle() {
        let _ts = this;
        _ts.doLoading = true;
        let id = _ts.$route.params.article_id;
        let articleContent = _ts.contentEditor.getValue();
        let articleContentHtml = await _ts.contentEditor.getHTML();
        if (!(_ts.articleTitle && articleContent)) {
          _ts.$message("标题/正文不能为空！");
          _ts.doLoading = false;
          return false;
        }
        let article = {
          idArticle: _ts.idArticle,
          articleTitle: _ts.articleTitle,
          articleContent: articleContent,
          articleContentHtml: articleContentHtml,
          articleTags: _ts.articleTags.join(","),
          articleStatus: 0
        };
        _ts.$axios[id ? '$put' : '$post']('/api/article/post', article).then(function (res) {
          if (res) {
            if (res.message) {
              _ts.$message(res.message);
              _ts.doLoading = false;
              return false;
            }
            localStorage.removeItem('article-title');
            localStorage.removeItem('article-tags');
            _ts.contentEditor.setValue('');
            _ts.$router.push({
              path: `/article/${res.id}`
            })
          }
        })

      },
      async saveArticle() {
        let _ts = this;
        _ts.doLoading = true;
        let id = _ts.$route.params.article_id;
        let articleContent = _ts.contentEditor.getValue();
        let articleContentHtml = await _ts.contentEditor.getHTML();
        if (!(_ts.articleTitle && articleContent)) {
          _ts.$message("标题/正文不能为空！");
          _ts.doLoading = false;
          return false;
        }
        let article = {
          idArticle: _ts.idArticle,
          articleTitle: _ts.articleTitle,
          articleContent: articleContent,
          articleContentHtml: articleContentHtml,
          articleTags: _ts.articleTags.join(","),
          articleStatus: 1
        };
        _ts.$axios[id ? '$put' : '$post']('/api/article/post', article).then(function (res) {
          if (res) {
            if (res.message) {
              _ts.$message(res.message);
              _ts.doLoading = false;
              return false;
            }
            localStorage.removeItem('article-title');
            localStorage.removeItem('article-tags');
            _ts.contentEditor.setValue('');
            _ts.$router.push({
              path: `/draft/${res.id}`
            })
          }
        })
      },
      getTags() {
        let _ts = this;
        _ts.$axios.$get('/api/tag/tags').then(function (res) {
          if (res) {
            _ts.$set(_ts, 'list', res);
          }
        })
      }
    },
    async mounted() {
      let _ts = this;
      _ts.$store.commit('setActiveMenu', 'post-article');
      const responseData = await _ts.$axios.$get('/api/upload/token');
      if (responseData) {
        _ts.$set(_ts, 'tokenURL', {
          token: responseData.uploadToken || '',
          URL: responseData.uploadURL || '',
          linkToImageURL: responseData.linkToImageURL || ''
        })
      }

      _ts.getTags();
      Vue.nextTick(() => {
        let articleContent = '';
        if (_ts.$route.params.article_id) {
          _ts.$set(_ts, 'isEdit', true);
          let article = _ts.article;
          _ts.$set(_ts, 'idArticle', article.idArticle);
          _ts.$set(_ts, 'articleTitle', article.articleTitle);
          _ts.$set(_ts, 'articleContent', article.articleContent);
          _ts.$set(_ts, 'articleStatus', article.articleStatus);
          _ts.$set(_ts, 'articleTags', (article.articleTags).split(','));
          localStorage.setItem("article-title", article.articleTitle);
          localStorage.setItem("article-tags", (article.articleTags).split(','));
          articleContent = article.articleContent
        } else {
          _ts.$set(_ts, 'isEdit', false);
        }
        _ts.contentEditor = _ts._initEditor({
          id: 'contentEditor',
          mode: 'both',
          height: 480,
          placeholder: '', //_ts.$t('inputContent', _ts.$store.state.locale)
          resize: false,
          value: articleContent
        });
      })
    }
  }
</script>

<style lang="scss">
  @import "~vditor/src/assets/scss/index.scss";
</style>
