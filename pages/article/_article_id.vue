<template>
  <el-row class="article__wrapper">
    <el-col>
      <el-card>
        <div class="card-body d-flex flex-column article">
          <div class="article__item">
            <h1 class="list__title" v-html="article.articleTitle"></h1>
            <el-row class="pt-5">
              <el-col :xs="3" :sm="1" :xl="1">
                <el-avatar v-if="article.articleAuthorAvatarUrl" :src="article.articleAuthorAvatarUrl"></el-avatar>
                <el-avatar v-else src="https://static.rymcu.com/article/1578475481946.png"></el-avatar>
              </el-col>
              <el-col :xs="9" :sm="11" :xl="11">
                <div style="margin-left: 1rem;">
                  <el-link rel="nofollow" @click="onRouter('user', article.articleAuthorName)" :underline="false"
                           class="text-default">{{ article.articleAuthorName }}
                  </el-link>
                  <small class="d-block text-muted">{{ article.timeAgo }}</small>
                </div>
              </el-col>
              <el-col :xs="12" :sm="12" :xl="12" v-if="user" class="text-right">
                <el-dropdown trigger="click" @command="handleCommand">
                  <el-link rel="nofollow" :underline="false"><i class="el-icon-more"></i></el-link>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="edit" v-if="hasPermissions">编辑</el-dropdown-item>
                    <el-dropdown-item command="share">分享</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
              <el-col class="text-right">
                <el-link rel="nofollow" :underline="false" title="总浏览数"><i class="el-icon-s-data"></i><span style="color: red;">{{ article.articleViewCount }}</span>
                </el-link>
              </el-col>
              <el-col style="margin: 1rem 0;">
                <el-tag
                  style="margin-right: 0.5rem;"
                  v-for="tag in article.tags"
                  :key="tag.idTag"
                  size="small"
                  effect="plain">
                  {{ tag.tagTitle }}
                </el-tag>
              </el-col>
              <el-col v-if="article.portfolios && article.portfolios.length > 0">
                <el-col>
                  <h4>所属作品集</h4>
                </el-col>
                <el-col style="padding: 1rem">
                  <el-col v-for="portfolio in article.portfolios" :key="portfolio.idPortfolio" :xs="16" :xl="8">
                    <el-col :xs="4" :sm="4" :xl="4">
                      <el-avatar :size="24" :src="portfolio.headImgUrl"></el-avatar>
                    </el-col>
                    <el-col :xs="20" :sm="20" :xl="20">
                      <el-link rel="nofollow" @click="onRouter('portfolio', portfolio.idPortfolio)" :underline="false"
                               class="text-default">{{ portfolio.portfolioTitle }}
                      </el-link>
                    </el-col>
                  </el-col>
                </el-col>
              </el-col>
              <el-col v-if="isShare" style="margin-bottom: 1rem;">
                <share-box :url="shareData.shareUrl"></share-box>
              </el-col>
            </el-row>
            <div class="pt-7 pipe-content__reset vditor-reset" id="articleContent" v-html="article.articleContent"
                 style="overflow: hidden;"></div>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col>
      <comment-box :fetching="isFetching" :user="user" :avatar="avatar" :title="article.articleTitle"
                   :post-id="routeArticleId"></comment-box>
    </el-col>
  </el-row>
</template>

<script>
  import Vue from 'vue';
  import {mapState} from 'vuex';
  import ShareBox from '~/components/widget/share';

  export default {
    name: "ArticleDetail",
    components: {
      ShareBox
    },
    validate({params, store}) {
      return params.article_id && !isNaN(Number(params.article_id))
    },
    fetch({store, params, error}) {
      return Promise.all([
        store
          .dispatch('article/fetchDetail', params)
          .catch(err => error({statusCode: 404})),
        store.dispatch('comment/fetchList', {post_id: params.article_id})
      ])
    },
    computed: {
      ...mapState({
        article: state => state.article.detail.data,
        isFetching: state => state.article.detail.fetching,
        isMobile: state => state.global.isMobile,
        user: state => state.oauth,
        avatar: state => state.userInfo?.avatarURL
      }),
      hasPermissions() {
        let account = this.$store.state.userInfo?.nickname;
        if (account) {
          if (account === this.article.articleAuthor.userNickname) {
            return true;
          }
        }
        return this.$store.getters.hasPermissions('blog_admin');
      },
      routeArticleId() {
        return Number(this.$route.params.article_id)
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
        loading: false,
        isShare: false,
        shareData: {},
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
        } else {
          _ts.$axios.$get('/api/article/' + _ts.article.idArticle + '/share').then(function (res) {
            if (res) {
              _ts.$set(_ts, 'shareData', res);
              _ts.$set(_ts, 'isShare', true);
            }
          });
        }
      },
      gotoLogin() {
        this.$router.push({
          name: 'login'
        })
      }
    },
    mounted() {
      this.$store.commit('setActiveMenu', 'articleDetail');
      Vue.nextTick(() => {
        const previewElement = document.getElementById("articleContent");
        // //const outLineElement = document.getElementById("articleToC");
        // VditorPreview.setContentTheme('light');
        Vue.VditorPreview.codeRender(previewElement, 'zh_CN');
        Vue.VditorPreview.highlightRender({"enable": true, "lineNumber": true, "style": "github"}, previewElement);
        Vue.VditorPreview.mathRender(previewElement, {
          math: {"engine": "KaTeX", "inlineDigit": false, "macros": {}},
        });
        Vue.VditorPreview.mermaidRender(previewElement, ".language-mermaid");
        Vue.VditorPreview.graphvizRender(previewElement);
        Vue.VditorPreview.chartRender(previewElement);
        Vue.VditorPreview.mindmapRender(previewElement);
        Vue.VditorPreview.abcRender(previewElement);
        Vue.VditorPreview.mediaRender(previewElement);
        Vue.VditorPreview.lazyLoadImageRender(previewElement);
        //VditorPreview.outlineRender(previewElement, outLineElement);
        window.scrollTo(0, 0);
      })
    }

  }
</script>

<style lang="scss">
  @import "~vditor/src/assets/scss/index.scss";

  .article__wrapper {
    max-width: 980px;
    margin: 0 auto;
    display: block;
    padding-left: 1rem;
    padding-right: 1rem;
    box-sizing: border-box;
  }
</style>
