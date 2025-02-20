<template>
  <el-row class="pt-5">
    <el-col>
      <el-col style="margin-top: 1rem;" v-if="user">
        <el-col :sm="1" :xl="1" :xs="2">
          <el-avatar :src="avatar"></el-avatar>
        </el-col>
        <el-col :sm="23" :xl="23" :xs="22" style="padding-left: 1rem;">
          <el-input @click.native="showComment" placeholder="请输入回帖内容"></el-input>
        </el-col>
        <el-col>
          <el-drawer
            :direction="direction"
            :visible.sync="drawer"
            size="50%">
            <el-col slot="title">
              <el-col>
                <el-avatar :src="commentAuthorAvatar" v-show="commentAuthorAvatar"></el-avatar>
                <span class="text-default" style="padding-left: 1rem;">{{ commentTitle }}</span>
              </el-col>
            </el-col>
            <el-col>
              <div id="contentEditor"></div>
            </el-col>
            <el-col style="margin-top: 1rem;padding-right:3rem;text-align: right;">
              <el-button :loading="loading" @click="postComment" plain type="primary">发布</el-button>
            </el-col>
          </el-drawer>
        </el-col>
      </el-col>
      <el-col class="text-center" style="margin-top: 1rem;" v-else>
        <el-button @click="gotoLogin" plain size="medium" type="primary">登录</el-button>
        后发布评论
      </el-col>
      <el-col>
        <el-col :key="comment.idComment" v-for="comment in comments.list">
          <el-card :id="'comment-' + comment.idComment" style="margin-top: 1rem;">
            <el-col :sm="1" :xl="1" :xs="3">
              <el-avatar :src="comment.commenter.userAvatarURL" v-show="comment.commenter.userAvatarURL"></el-avatar>
              <el-avatar src="https://static.rymcu.com/article/1578475481946.png"
                         v-show="!comment.commenter.userAvatarURL"></el-avatar>
            </el-col>
            <el-col :sm="23" :xl="23" :xs="21" style="padding-bottom: 10px;" v-if="comment.commentStatus === '0'">
              <el-col style="margin-left: 1rem;">
                <el-col v-show="comment.commentOriginalCommentId">
                  <el-col :span="16">
                    <el-link :underline="false" @click="onRouter('user', comment.commenter.userAccount)"
                             class="text-default"
                             rel="nofollow">{{ comment.commenter.userNickname }}
                    </el-link>
                    <small class="text-default" style="margin: 0 0.2rem">回复了</small><span
                    style="font-weight: bold;"> {{ comment.commentOriginalAuthorNickname }}</span>
                  </el-col>
                  <el-col :span="8" class="text-right" style="padding-right: 1rem;">
                    <el-link :underline="false"
                             @click.native="toggleShowOriginalComment(comment.commentOriginalCommentId)" rel="nofollow"
                             title="查看原评论"><i
                      class="el-icon-reading"></i> 查看原评论
                    </el-link>
                    <el-tag effect="plain" size="mini" style="margin-left: 5px;"
                            v-show="isAuthor(comment.commentAuthorId)">
                      作者
                    </el-tag>
                  </el-col>
                </el-col>
                <el-col v-show="!comment.commentOriginalCommentId">
                  <el-col :span="16">
                    <el-link :underline="false" @click="onRouter('user', comment.commenter.userAccount)"
                             class="text-default"
                             rel="nofollow">{{ comment.commenter.userNickname }}
                    </el-link>
                  </el-col>
                  <el-col :span="8" class="text-right" style="padding-right: 1rem;">
                    <el-tag effect="plain" size="mini" style="margin-left: 5px;"
                            v-show="isAuthor(comment.commentAuthorId)">
                      作者
                    </el-tag>
                  </el-col>
                </el-col>
              </el-col>
              <el-col style="padding: 1rem;">
                <el-col>
                  <div class="vditor-reset comment-content" v-html="comment.commentContent"></div>
                </el-col>
              </el-col>
              <el-col :span="16" style="padding-left: 1rem;">
                <el-link :underline="false" class="text-default" rel="nofollow">{{ comment.timeAgo }}</el-link>
              </el-col>
              <el-col :span="8" class="text-right" style="margin-bottom: 0.5rem;" v-if="user">
                <el-link :underline="false" @click.native="replyComment(comment)" rel="nofollow" title="评论"><i
                  class="el-icon-s-comment"></i> 评论
                </el-link>
              </el-col>
            </el-col>
            <el-col :sm="23" :xl="23" :xs="21" style="padding-bottom: 10px;" v-else>
              <el-col style="margin-left: 1rem;">
                <el-col :span="16">
                  <el-link :underline="false" @click="onRouter('user', comment.commenter.userAccount)"
                           class="text-default"
                           rel="nofollow">{{ comment.commenter.userNickname }}
                  </el-link>
                </el-col>
                <el-col :span="8" class="text-right" style="padding-right: 1rem;">
                  <el-tag effect="plain" size="mini" style="margin-left: 5px;"
                          v-show="isAuthor(comment.commentAuthorId)">
                    作者
                  </el-tag>
                </el-col>
              </el-col>
              <el-col style="padding: 1rem;">
                <el-col>
                  <div class="vditor-reset comment-content">
                    <small>内容不相关已被隐藏！</small>
                  </div>
                </el-col>
              </el-col>
              <el-col :span="16" style="padding-left: 1rem;">
                <el-link :underline="false" class="text-default" rel="nofollow">{{ comment.timeAgo }}</el-link>
              </el-col>
            </el-col>
          </el-card>
          <el-col v-if="comment.commentOriginalCommentId" :id="'original-' + comment.commentOriginalCommentId" style="background-color: #d9d9d9;padding-left: 1.5rem;
            margin-top: 0.3rem;border-radius: 0.5rem;cursor: pointer;display: none;">
            <el-col :span="2" v-show="comment.commentOriginalCommentId">
              <p>
                <span>{{ comment.commentOriginalAuthorNickname }} :</span>
              </p>
            </el-col>
            <el-col :span="20" v-show="comment.commentOriginalCommentId">
              <div class="vditor-reset comment-content" v-html="comment.commentOriginalContent"></div>
            </el-col>
          </el-col>
        </el-col>
        <el-col>
          <div class="vertical-container text-center">
            <el-pagination :hide-on-single-page="true"
                           layout="prev, pager, next"
                           :page-size="comments.pageSize"
                           :current-page="comments.pageNum"
                           :total="comments.total"
                           prev-text="上一页"
                           next-text="下一页"
                           @current-change="currentChange">
            </el-pagination>
          </div>
        </el-col>
      </el-col>
    </el-col>
  </el-row>
</template>

<script>
import Vue from 'vue';
import {mapState} from 'vuex';
import apiConfig from '~/config/api.config';

export default {
  name: "Comment",
  props: {
    fetching: {
      type: Boolean,
      default: false
    },
    authorId: {
      type: Number,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  fetch() {
    let {store, params, query} = this.$nuxt.context
    return Promise.all([
      store.dispatch('comment/fetchList', {post_id: params.article_id, page: query.page})
    ])
  },
  computed: {
    ...mapState({
      comments: state => state.comment.list.data,
      isFetchingComment: state => state.comment.list.fetching,
      // isPostingComment: state => state.comment.posting,
      constants: state => state.global.constants,
      language: state => state.global.language,
      user: state => state.auth.user,
      loggedIn: state => state.auth.loggedIn,
      avatar: state => state.auth.user?.avatarUrl
    }),
    isFetching() {
      // 1. 宿主组件还在加载时，列表和 tool 都呈加载状态
      // 2. 宿主组件加载完成，如果自己还在请求，则列表呈加载状态
      // 3. 自己已请求完，宿主组件还在加载，列表和 tool 都呈加载状态
      return this.fetching || this.isFetchingComment
    }
  },
  data() {
    return {
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
      commentOriginalCommentId: 0,
      commentAuthorAvatar: '',
      commentTitle: '',
      postId: 0
    }
  },
  methods: {
    onRouter(name, data) {
      this.$router.push(
        {
          path: '/user/' + data
        }
      )
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
          enable: !this.postId,
          id: this.postId ? this.postId : '',
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
    _loadEditor() {
      let _ts = this;
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
    },
    gotoComment(commentId) {
      console.log(commentId);
    },
    replyComment(comment) {
      let _ts = this;
      _ts.$set(_ts, 'drawer', true);
      _ts.$set(_ts, 'commentTitle', comment.commenter.userNickname);
      _ts.$set(_ts, 'commentAuthorAvatar', comment.commenter.userAvatarURL);
      _ts.$set(_ts, 'commentOriginalCommentId', comment.idComment);
      _ts._loadEditor();
    },
    showComment() {
      let _ts = this;
      _ts.$set(_ts, 'drawer', true);
      _ts.$set(_ts, 'commentTitle', _ts.title);
      _ts.$set(_ts, 'commentAuthorAvatar', '');
      _ts.$set(_ts, 'commentOriginalCommentId', 0);
      _ts._loadEditor();
    },
    async postComment() {
      let _ts = this;
      _ts.$set(_ts, 'loading', true);
      let commentContent = await _ts.contentEditor.getHTML();
      if (!(commentContent)) {
        _ts.$message("回帖内容不能为空！");
        return false;
      }
      let comment = {
        commentArticleId: _ts.postId,
        commentContent: commentContent,
        commentOriginalCommentId: _ts.commentOriginalCommentId,
        commentAuthorId: _ts.user.idUser
      };
      _ts.$axios.$post('/api/comment/post', comment).then(function (res) {
        if (res) {
          if (res.message) {
            _ts.$message(res.message);
            return false;
          }
          _ts.contentEditor.setValue('');
          _ts.$set(_ts, 'drawer', false);
          _ts.$fetch()
        }
        _ts.$set(_ts, 'loading', false);
      })
    },
    gotoLogin() {
      this.$emit('gotoLogin');
    },
    // 取消回复
    cancelCommentReply() {
      this.commentOriginalCommentId = 0
    },
    toggleShowOriginalComment(commentId) {
      let ele = document.getElementById('original-' + commentId);
      if (ele.style.display === 'none') {
        ele.style.display = 'block';
      } else {
        ele.style.display = 'none';
      }
    },
    isAuthor(commentAuthorId) {
      return this.authorId === commentAuthorId;
    },
    currentChange(page) {
      this.$router.push({
        path: `/article/${this.postId}`,
        query: {
          page: page
        }
      })
    }
  },
  async mounted() {
    let _ts = this;
    _ts.$set(_ts, 'postId', _ts.$route.params.article_id);
    _ts.$store.commit('setActiveMenu', 'post-article');
    if (_ts.loggedIn) {
      const responseData = await _ts.$axios.$get('/api/upload/token');
      if (responseData) {
        _ts.$set(_ts, 'tokenURL', {
          token: responseData.uploadToken || '',
          URL: responseData.uploadURL || '',
          linkToImageURL: responseData.linkToImageURL || ''
        })
      }
    }

    Vue.nextTick(function () {
      // 评论渲染
      const previewElements = document.getElementsByClassName("comment-content");
      if (previewElements && previewElements.length > 0) {
        for (let i = 0; i<previewElements.length; i++) {
          const previewElement = previewElements[i];
          Vue.VditorPreview.codeRender(previewElement, 'zh_CN');
          Vue.VditorPreview.highlightRender({
            "enable": true,
            "lineNumber": true,
            "style": "github"
          }, previewElement, apiConfig.VDITOR);
          Vue.VditorPreview.mathRender(previewElement, {
            math: {"engine": "KaTeX", "inlineDigit": false, "macros": {}}, cdn: apiConfig.VDITOR
          });
          Vue.VditorPreview.mermaidRender(previewElement, apiConfig.VDITOR);
          Vue.VditorPreview.graphvizRender(previewElement, apiConfig.VDITOR);
          Vue.VditorPreview.chartRender(previewElement, apiConfig.VDITOR);
          Vue.VditorPreview.mindmapRender(previewElement, apiConfig.VDITOR);
          Vue.VditorPreview.abcRender(previewElement, apiConfig.VDITOR);
          Vue.VditorPreview.mediaRender(previewElement);
          Vue.VditorPreview.lazyLoadImageRender(previewElement);
          //VditorPreview.outlineRender(previewElement, outLineElement);
          previewElement.addEventListener("click", (event) => {
            if (event.target.tagName === "IMG") {
              Vue.VditorPreview.previewImage(event.target);
            }
          });
        }
      }
      // 评论定位
      if (_ts.$route.hash) {
        const element = document.getElementById(_ts.$route.hash.replace('#', ''));
        if (element) {
          let actualTop = element.offsetTop;
          let current = element.offsetParent;
          while (current !== null) {
            actualTop += current.offsetTop;
            current = current.offsetParent;
          }
          window.scroll(0, actualTop);
        }
      }
    })
  },
  watch: {
    isFetching(isFetching) {
      if (isFetching) {
        this.cancelCommentReply()
      }
    },
    '$route'(to, from) {
      if ((to.query.page || 1) !== (from.query.page || 1)) {
        this.$fetch()
      }
    }
  },
  destroyed() {
    this.$store.commit('comment/clearListData')
  }
}
</script>

<style scoped>

</style>
