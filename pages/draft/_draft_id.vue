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
                <el-link rel="nofollow" :underline="false" title="总浏览数"><i class="el-icon-s-data"></i><span style="color: red;">{{ article.articleViewCount }}</span>
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
                <el-col v-if="user && user.idUser === article.articleAuthorId" :span="12" style="text-align: right;">
                  <el-button size="mini" v-if="hasPermissions" @click="handleCommand('edit')" plain>编辑文章</el-button>
                </el-col>
              </el-col>
              <el-col v-if="article.portfolios && article.portfolios.length > 0">
                <el-col>
                  <h4>所属作品集</h4>
                </el-col>
                <el-col style="padding: 1rem">
                  <el-col v-for="portfolio in article.portfolios" :key="portfolio.idPortfolio" :span="8">
                    <el-col :xs="3" :sm="3" :xl="3">
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
            </el-row>
            <div class="pt-7 pipe-content__reset vditor-reset" id="articleContent" v-html="article.articleContent"
                 style="overflow: hidden;"></div>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
  import Vue from 'vue';
  import {mapState} from 'vuex';
  import 'vditor/dist/css/content-theme/light.css';
  import apiConfig from '~/config/api.config'


  export default {
    name: "DraftDetail",
    middleware: 'auth',
    validate({params, store}) {
      return params.draft_id && !isNaN(Number(params.draft_id))
    },
    fetch() {
      let {store, params, error} = this.$nuxt.context
      return Promise.all([
        store
          .dispatch('draft/fetchDetail', params)
          .catch(err => error({statusCode: 404}))
      ])
    },
    computed: {
      ...mapState({
        article: state => state.draft.detail.data,
        isFetching: state => state.draft.detail.fetching,
        user: state => state.auth.user,
        avatar: state => state.auth.user?.avatarURL
      }),
      hasPermissions() {
        let account = this.$store.state.auth.user?.nickname;
        if (account) {
          if (account === this.article?.articleAuthor?.userNickname) {
            return true;
          }
        }
        return this.$auth.hasScope('blog_admin');
      },
      routeArticleId() {
        return Number(this.$route.params.draft_id)
      }
    },
    data() {
      return {
        loading: false
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
      this.$store.commit('setActiveMenu', 'draftDetail');
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
        window.scrollTo(0,0);
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
