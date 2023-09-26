<template>
  <el-row class="article__wrapper">
    <el-col>
      <el-card>
        <div class="card-body d-flex flex-column article">
          <div class="article__item">
            <h1 class="list__title">
              <span v-if="isPerfect" style="color: gold;" title="优选">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                     style="fill: #FFB71B;"><path
                  d="M12 22c3.859 0 7-3.141 7-7s-3.141-7-7-7c-3.86 0-7 3.141-7 7s3.14 7 7 7zm0-12c2.757 0 5 2.243 5 5s-2.243 5-5 5-5-2.243-5-5 2.243-5 5-5zm-1-8H7v5.518a8.957 8.957 0 0 1 4-1.459V2zm6 0h-4v4.059a8.957 8.957 0 0 1 4 1.459V2z"></path><path
                  d="m10.019 15.811-.468 2.726L12 17.25l2.449 1.287-.468-2.726 1.982-1.932-2.738-.398L12 11l-1.225 2.481-2.738.398z"></path></svg>
              </span>
              {{ article.articleTitle }}
            </h1>
            <el-row class="pt-5">
              <el-col :xs="3" :sm="1" :xl="1">
                <el-avatar v-if="article.articleAuthorAvatarUrl" :src="article.articleAuthorAvatarUrl"></el-avatar>
                <el-avatar v-else src="https://static.rymcu.com/article/1578475481946.png"></el-avatar>
              </el-col>
              <el-col :xs="9" :sm="11" :xl="11">
                <div style="margin-left: 1rem;">
                  <el-link :href="'/user/' + article.articleAuthor?.userAccount" class="text-default">
                    {{ article.articleAuthorName }}
                  </el-link>
                  <small class="d-block text-muted">{{ article.timeAgo }}</small>
                </div>
              </el-col>
              <el-col :xs="12" :sm="12" :xl="12" v-if="user" class="text-right">
                <el-link rel="nofollow" :underline="false" title="总浏览数"><i class="el-icon-s-data"></i><span
                  style="color: red;">{{ article.articleViewCount }}</span>
                </el-link>
              </el-col>
              <el-col style="margin: 1rem 0;">
                <el-col :span="12">
                  <el-tag
                    style="margin-right: 0.5rem;"
                    v-for="tag in article.tags"
                    :key="tag.idTag"
                    size="small"
                    effect="plain">
                    # {{ tag.tagTitle }}
                  </el-tag>
                </el-col>
                <client-only>
                  <el-col v-if="user" :span="12" style="text-align: right;">
                    <template v-if="user.idUser !== article.articleAuthorId">
                      <el-button size="mini" v-if="isFollower(article.articleAuthorId)"
                                 @click="cancelFollowUser(article.articleAuthorId)" plain>
                        取消关注
                      </el-button>
                      <el-button size="mini" v-else @click="followUser(article.articleAuthorId)" plain>关注</el-button>
                    </template>
                    <el-button size="mini" v-if="hasPermissions" @click="handleCommand('edit')" plain>编辑文章</el-button>
                    <template v-if="isAdmin">
                      <el-button size="mini" @click="handleCommand('editTag')" plain>编辑标签</el-button>
                      <el-button v-if="isPerfect" size="mini" @click="cancelPreference" plain>取消优选</el-button>
                      <el-button v-else size="mini" @click="setPreference" plain>设为优选</el-button>
                    </template>
                    <template v-else-if="hasPermissions">
                      <el-button size="mini" @click="handleCommand('editTag')" plain>编辑标签</el-button>
                    </template>
                    <el-button size="mini" @click="handleCommand('share')" plain>分享</el-button>
                  </el-col>
                  <el-col v-else :span="12" style="text-align: right;">
                    <el-button size="mini" @click="gotoLogin" plain>关注</el-button>
                    <el-button size="mini" @click="handleCommand('share')" plain>分享</el-button>
                  </el-col>
                </client-only>
              </el-col>
              <el-col v-if="isShare" style="margin-bottom: 1rem;">
                <share-box :url="shareUrl"></share-box>
              </el-col>
              <el-col v-if="article.portfolios && article.portfolios.length > 0">
                <portfolios-widget :portfolios="article.portfolios"></portfolios-widget>
              </el-col>
            </el-row>
            <div class="pt-7 pipe-content__reset vditor-reset" id="articleContent" v-html="article.articleContent"
                 style="overflow: hidden;"></div>
          </div>
          <el-row>
            <el-col v-if="article.portfolios && article.portfolios.length > 0">
              <portfolios-widget :portfolios="article.portfolios"></portfolios-widget>
            </el-col>
            <el-col v-if="loggedIn">
              <el-tooltip class="item" effect="dark" content="酷" placement="top-start">
                <el-button type="text" style="font-size: 1.2rem;" @click="thumbsUp">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                       style="fill: rgba(0, 0, 0, 1);">
                    <path
                      d="M14.683 14.828a4.055 4.055 0 0 1-1.272.858 4.002 4.002 0 0 1-4.875-1.45l-1.658 1.119a6.063 6.063 0 0 0 1.621 1.62 5.963 5.963 0 0 0 2.148.903 6.035 6.035 0 0 0 3.542-.35 6.048 6.048 0 0 0 1.907-1.284c.272-.271.52-.571.734-.889l-1.658-1.119a4.147 4.147 0 0 1-.489.592z"></path>
                    <path
                      d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 2c2.953 0 5.531 1.613 6.918 4H5.082C6.469 5.613 9.047 4 12 4zm0 16c-4.411 0-8-3.589-8-8 0-.691.098-1.359.264-2H5v1a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-1h.736c.166.641.264 1.309.264 2 0 4.411-3.589 8-8 8z"></path>
                  </svg>
                  {{ article.articleThumbsUpCount }}
                </el-button>
              </el-tooltip>
              <el-tooltip v-if="article.canSponsor" class="item" effect="dark" content="赞赏" placement="top-start" :disabled="!$auth.user.bankAccount">
                <el-button v-if="user.idUser === article.articleAuthorId" type="text"
                           style="font-size: 1.2rem;">
                  <svg width="24" height="24">
                    <path :d="buymeacoffee.path"></path>
                  </svg>
                  {{ article.articleSponsorCount }}
                </el-button>
                <el-popconfirm
                  v-else
                  title="赞赏本文作者 20 巴旦木？"
                  @confirm="sponsor"
                >
                  <el-button slot="reference" type="text" style="font-size: 1.2rem;">
                    <svg width="24" height="24">
                      <path :d="buymeacoffee.path"></path>
                    </svg>
                    {{ article.articleSponsorCount }}
                  </el-button>
                </el-popconfirm>
              </el-tooltip>
            </el-col>
            <el-col v-else>
              <el-tooltip class="item" effect="dark" content="酷" placement="top-start">
                <el-button type="text" style="font-size: 1.2rem;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                       style="fill: rgba(0, 0, 0, 1);">
                    <path
                      d="M14.683 14.828a4.055 4.055 0 0 1-1.272.858 4.002 4.002 0 0 1-4.875-1.45l-1.658 1.119a6.063 6.063 0 0 0 1.621 1.62 5.963 5.963 0 0 0 2.148.903 6.035 6.035 0 0 0 3.542-.35 6.048 6.048 0 0 0 1.907-1.284c.272-.271.52-.571.734-.889l-1.658-1.119a4.147 4.147 0 0 1-.489.592z"></path>
                    <path
                      d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 2c2.953 0 5.531 1.613 6.918 4H5.082C6.469 5.613 9.047 4 12 4zm0 16c-4.411 0-8-3.589-8-8 0-.691.098-1.359.264-2H5v1a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-1h.736c.166.641.264 1.309.264 2 0 4.411-3.589 8-8 8z"></path>
                  </svg>
                  {{ article.articleThumbsUpCount }}
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="赞赏" placement="top-start">
                <el-button type="text" style="font-size: 1.2rem;">
                  <svg width="24" height="24">
                    <path :d="buymeacoffee.path"></path>
                  </svg>
                  {{ article.articleSponsorCount }}
                </el-button>
              </el-tooltip>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </el-col>
    <el-col>
      <comment-box :fetching="isFetching" :title="article.articleTitle"
                   :authorId="article.articleAuthorId" @gotoLogin="gotoLogin"></comment-box>
    </el-col>
    <el-col>
      <el-dialog :visible.sync="dialogVisible">
        <edit-tags
          :idArticle="article.idArticle"
          :tags="article.articleTags"
          @closeDialog="closeTagsDialog">
        </edit-tags>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script>
import Vue from 'vue';
import {mapState} from 'vuex';
import ShareBox from '~/components/widget/share';
import PortfoliosWidget from '~/components/widget/portfolios';
import EditTags from '~/components/widget/tags';
import 'vditor/dist/css/content-theme/light.css';
import {buymeacoffee} from "simple-icons"
import apiConfig from '~/config/api.config';

export default {
  name: "ArticleDetail",
  components: {
    ShareBox,
    PortfoliosWidget,
    EditTags
  },
  validate({params, store}) {
    return params.article_id && !isNaN(Number(params.article_id))
  },
  fetch() {
    let {store, params, error} = this.$nuxt.context
    return Promise.all([
      store
        .dispatch('article/fetchDetail', params)
        .catch(err => error({statusCode: 404}))
    ])
  },
  computed: {
    ...mapState({
      article: state => state.article.detail.data,
      isFetching: state => state.article.detail.fetching,
      loggedIn: state => state.auth.loggedIn,
      user: state => state.auth.user,
      avatar: state => state.auth.user?.avatarUrl
    }),
    hasPermissions() {
      let account = this.$store.state.auth.user?.nickname;
      if (account) {
        if (account === this.article.articleAuthor?.userNickname) {
          return true;
        }
      }
      return false;
    },
    isAdmin() {
      return this.$auth.hasScope('admin') || this.$auth.hasScope('blog_admin');
    }
  },
  head() {
    return {
      title: this.article.articleTitle || 'RYMCU - 嵌入式知识学习交流平台',
      meta: [
        {
          name: 'keywords',
          content: this.article.articleTags || 'RYMCU'
        },
        {
          name: 'description',
          content: this.article.articlePreviewContent
        },
        {
          name: 'site_name',
          content: 'RYMCU'
        },
        {
          name: 'url',
          content: this.article.articlePermalink
        },
        {
          name: 'og:title',
          content: this.article.articleTitle + ' - RYMCU'
        },
        {
          name: 'og:description',
          content: this.article.articlePreviewContent
        },
        {
          name: 'og:site_name',
          content: 'RYMCU'
        },
        {
          name: 'og:url',
          content: this.article.articlePermalink
        }
      ]
    }
  },
  data() {
    return {
      buymeacoffee,
      loading: false,
      isShare: false,
      dialogVisible: false,
      isPerfect: false,
      shareUrl: ''
    }
  },
  methods: {
    onRouter(name, data) {
      this.$router.push(
        {
          path: `/${name}/${data}`
        }
      )
    },
    handleCommand(item) {
      let _ts = this;
      if (item === 'edit') {
        _ts.$router.push({
          path: `/article/post/${_ts.article.idArticle}`
        })
      } else if (item === 'editTag') {
        _ts.$set(_ts, 'dialogVisible', true);
      } else {
        if (_ts.isShare) {
          _ts.$set(_ts, 'isShare', false);
        } else {
          if (_ts.user) {
            _ts.$axios.$get('/api/article/' + _ts.article.idArticle + '/share').then(function (res) {
              if (res) {
                _ts.$set(_ts, 'shareUrl', res);
                _ts.$set(_ts, 'isShare', true);
              }
            });
          } else {
            _ts.$set(_ts, 'shareUrl', _ts.article.articlePermalink);
            _ts.$set(_ts, 'isShare', true);
          }
        }
      }
    },
    gotoLogin() {
      this.$router.push({
        name: 'login',
        query: {
          historyUrl: window.location.href
        }
      })
    },
    closeTagsDialog() {
      this.$set(this, 'dialogVisible', false);
      this.$store.dispatch('article/fetchDetail', this.$route.params);
    },
    followUser(idUser) {
      let _ts = this;
      if (_ts.user) {
        _ts.$axios.$post('/api/follow', {
          followingId: idUser,
          followingType: 0
        }).then(function (res) {
          _ts.$set(_ts, 'isFollow', res);
          _ts.$store.dispatch('follow/fetchUserFollowingList');
        })
      } else {
        _ts.gotoLogin();
      }
    },
    cancelFollowUser(idUser) {
      let _ts = this;
      if (_ts.user) {
        _ts.$axios.$post('/api/follow/cancel-follow', {
          followingId: idUser,
          followingType: 0
        }).then(function (res) {
          _ts.$set(_ts, 'isFollow', res);
          _ts.$store.dispatch('follow/fetchUserFollowingList');
        })
      } else {
        _ts.gotoLogin();
      }
    },
   setPreference() {
      let _ts = this;
      _ts.$axios.$patch("/api/admin/article/update-perfect", {
        idArticle: _ts.article.idArticle,
        articlePerfect: '1',
      }).then(function (res) {
        if (res) {
          _ts.$set(_ts, 'isPerfect', true);
          _ts.$message.success("设置成功!");
        } else {
          _ts.$message.error("设置失败!");
        }
      })
    },
    cancelPreference() {
      let _ts = this;
      _ts.$axios.$patch("/api/admin/article/update-perfect", {
        idArticle: _ts.article.idArticle,
        articlePerfect: '0',
      }).then(function (res) {
        if (res) {
          _ts.$set(_ts, 'isPerfect', false);
          _ts.$message.success("取消成功!");
        } else {
          _ts.$message.error("设置失败!");
        }
      })
    },
    thumbsUp() {
      let _ts = this;
      _ts.$axios.$post('/api/article/thumbs-up', {
        idArticle: _ts.article.idArticle
      }).then(function (res) {
        if (res) {
          _ts.$message.success("点赞成功");
          _ts.$store.dispatch('article/updateThumbsUpCount', {thumbsUpNumber: res})
        }
      })
    },
    sponsor() {
      let _ts = this;
      _ts.$axios.$post('/api/article/sponsor', {
        dataType: '0',
        dataId: _ts.article.idArticle
      }).then(function (res) {
        if (res) {
          _ts.$message.success('赞赏成功');
          _ts.$store.dispatch('article/updateSponsorCount', {sponsorNumber: 1})
        }
      })
    },
    isFollower(idUser) {
      return this.$store.getters["follow/isFollower"](idUser)
    }
  },
  mounted() {
    let _ts = this;
    _ts.$store.commit('setActiveMenu', 'articleDetail');
    Vue.nextTick(() => {
      const previewElement = document.getElementById("articleContent");
      // //const outLineElement = document.getElementById("articleToC");
      // VditorPreview.setContentTheme('light');
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
      _ts.$set(_ts, 'isPerfect', _ts.article.articlePerfect === '1')
    })
  }

}
</script>

<style lang="less">
@import "~vditor/src/assets/less/index.less";

.article__wrapper {
  max-width: 980px;
  margin: 20px auto;
  display: block;
  padding-left: 1rem;
  padding-right: 1rem;
  box-sizing: border-box;
}
</style>
