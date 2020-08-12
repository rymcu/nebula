<template>
  <el-row class="pt-5">
    <el-col>
      <el-col v-if="user" style="margin-top: 1rem;">
        <el-col :xs="2" :sm="1" :xl="1">
          <el-avatar :src="avatar"></el-avatar>
        </el-col>
        <el-col :xs="22" :sm="23" :xl="23" style="padding-left: 1rem;">
          <el-input @click.native="showComment" placeholder="请输入回帖内容"></el-input>
        </el-col>
        <el-col>
          <el-drawer
            :visible.sync="drawer"
            :direction="direction"
            size="40%">
            <el-col slot="title">
              <el-col>
                <el-avatar v-show="commentAuthorAvatar" :src="commentAuthorAvatar"></el-avatar>
                <span class="text-default" style="padding-left: 1rem;">{{ commentTitle }}</span>
              </el-col>
            </el-col>
            <el-col>
              <div id="contentEditor"></div>
            </el-col>
            <el-col style="margin-top: 1rem;padding-right:3rem;text-align: right;">
              <el-button type="primary" :loading="loading" @click="postComment">发布</el-button>
            </el-col>
          </el-drawer>
        </el-col>
      </el-col>
      <el-col v-else class="text-center" style="margin-top: 1rem;">
        <el-button type="primary" size="medium" @click="gotoLogin">登录</el-button>
        后发布评论
      </el-col>
      <el-col style="margin-top: 1rem;">
        <el-col v-for="comment in comment.data" :key="comment.idComment">
          <el-card style="margin-bottom: 0.5rem;" :id="'comment-' + comment.idComment">
            <el-col :xs="3" :sm="1" :xl="1">
              <el-avatar v-show="comment.commenter.userAvatarURL" :src="comment.commenter.userAvatarURL"></el-avatar>
              <el-avatar v-show="!comment.commenter.userAvatarURL"
                         src="https://static.rymcu.com/article/1578475481946.png"></el-avatar>
            </el-col>
            <el-col :xs="21" :sm="23" :xl="23">
              <el-col style="margin-left: 1rem;">
                <el-col v-show="comment.commentOriginalCommentId">
                  <el-link rel="nofollow" @click="onRouter('user', comment.commenter.userNickname)" :underline="false"
                           class="text-default">{{ comment.commenter.userNickname }}
                  </el-link>
                  <small class="text-default" style="margin: 0 0.2rem">回复了</small><span style="font-weight: bold;"> {{comment.commentOriginalAuthorNickname}}</span>
                </el-col>
                <el-col v-show="!comment.commentOriginalCommentId">
                  <el-link rel="nofollow" @click="onRouter('user', comment.commenter.userNickname)" :underline="false"
                           class="text-default">{{ comment.commenter.userNickname }}
                  </el-link>
                </el-col>

              </el-col>
              <el-col style="padding: 1rem;">
                <el-col>
                  <span v-html="comment.commentContent"></span>
                </el-col>
              </el-col>
              <el-col :span="22" style="padding-left: 1rem;">
                <el-link rel="nofollow" :underline="false" class="text-default">{{ comment.timeAgo }}</el-link>
              </el-col>
              <el-col :span="2" v-if="user" class="text-right" style="margin-bottom: 0.5rem;">
                <el-link rel="nofollow" :underline="false" title="回复" @click.native="replyComment(comment)"><i
                  class="el-icon-s-comment"></i></el-link>
              </el-col>
            </el-col>
          </el-card>
        </el-col>
      </el-col>
    </el-col>
  </el-row>
</template>

<script>
  import Vue from 'vue';
  import {mapState} from 'vuex';

  export default {
    name: "Comment",
    props: {
      fetching: {
        type: Boolean,
        default: false
      },
      user: {
        type: Object,
        default: false
      },
      avatar: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      },
      postId: {
        type: Number,
        required: true
      }
    },
    computed: {
      ...mapState({
        comment: state => state.comment.data,
        isFetchingComment: state => state.comment.fetching,
        isPostingComment: state => state.comment.posting,
        constants: state => state.global.constants,
        language: state => state.global.language,
        isMobile: state => state.global.isMobile
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
        tokenURL: {},
        drawer: false,
        direction: 'btt',
        initEditor: false,
        isShow: true,
        loading: false,
        commentOriginalCommentId: 0,
        commentAuthorAvatar: '',
        commentTitle: ''
      }
    },
    methods: {
      onRouter(name, data) {
        this.$router.push(
          {
            name: name,
            params: {
              id: data
            }
          }
        )
      },
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
            enable: this.postId ? false : true,
            id: this.postId ? this.postId : '',
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
            url: this.tokenURL?.URL,
            linkToImgUrl: this.tokenURL?.URL,
            token: this.tokenURL?.token,
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
            _ts.getComments();
          }
          _ts.$set(_ts, 'loading', false);
        })
      },
      getComments() {
        // 每次重新获取数据时都需要回到评论框顶部，因为都是新数据
        this.$store.dispatch('comment/fetchList', {
          post_id: this.postId
        })
      },
      gotoLogin() {
        this.$router.push({
          name: 'login'
        })
      },
      // 取消回复
      cancelCommentReply() {
        this.commentOriginalCommentId = 0
      }
    },
    async mounted() {
      let _ts = this;
      _ts.$store.commit('setActiveMenu', 'post-article');
      if (_ts.user) {
        const responseData = await _ts.$axios.$get('/api/upload/token');
        if (responseData) {
          _ts.$set(_ts, 'tokenURL', {
            token: responseData.uploadToken || '',
            URL: responseData.uploadURL || '',
          })
        }
      }

      // 评论定位
      Vue.nextTick(function () {
        if (_ts.$route.hash) {
          const element = document.getElementById(_ts.$route.hash.replace('#', ''));
          if (element) {
            let actualTop = element.offsetTop;
            let current = element.offsetParent;
            while (current !== null){
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
      }
    },
    destroyed() {
      this.$store.commit('comment/clearListData')
    }
  }
</script>

<style scoped>

</style>
