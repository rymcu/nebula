<template>
  <el-row class="article__wrapper">
    <el-col v-if="isShow">
      <el-col>
        <el-card>
          <div class="card-body d-flex flex-column article">
            <div class="article__item">
              <h1 class="list__title" v-html="article.articleTitle"></h1>
              <el-row class="pt-5">
                <el-col :xs="3" :sm="1" :xl="1">
                  <el-avatar v-if="article.articleAuthorAvatarUrl" :src="article.articleAuthorAvatarUrl"></el-avatar>
                  <el-avatar v-else src="https://rymcu.com/vertical/article/1578475481946.png"></el-avatar>
                </el-col>
                <el-col :xs="9" :sm="11" :xl="11">
                  <div style="margin-left: 1rem;">
                    <el-link @click="onRouter('user', article.articleAuthorName)" :underline="false"
                             class="text-default">{{ article.articleAuthorName }}
                    </el-link>
                    <small class="d-block text-muted">{{ article.timeAgo }}</small>
                  </div>
                </el-col>
                <el-col :xs="12" :sm="12" :xl="12" v-if="isLogin" class="text-right">
                  <el-dropdown trigger="click" @command="handleCommand">
                    <el-link :underline="false"><i class="el-icon-more"></i></el-link>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="edit" v-if="hasPermissions">编辑</el-dropdown-item>
                      <el-dropdown-item command="share">分享</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
                <el-col class="text-right">
                  <el-link :underline="false" title="总浏览数"><i class="el-icon-s-data"></i><span style="color: red;">{{ article.articleViewCount }}</span>
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
                    <el-col v-for="portfolio in article.portfolios" :key="portfolio.idPortfolio" :span="8">
                      <el-col :xs="3" :sm="3" :xl="3">
                        <el-avatar :size="24" :src="portfolio.headImgUrl"></el-avatar>
                      </el-col>
                      <el-col :xs="20" :sm="20" :xl="20">
                        <el-link @click="onRouter('portfolio', portfolio.idPortfolio)" :underline="false"
                                 class="text-default">{{ portfolio.portfolioTitle }}
                        </el-link>
                      </el-col>
                    </el-col>
                  </el-col>
                </el-col>
                <!--                <el-col v-if="isShare" style="margin-bottom: 1rem;">-->
                <!--                  <el-input v-model="shareData.shareUrl">-->
                <!--                    <el-popover slot="append"-->
                <!--                                placement="bottom"-->
                <!--                                width="20"-->
                <!--                                trigger="hover">-->
                <!--                      <el-col>-->
                <!--                        <qrcode :value="shareWeiXin(shareData.shareUrl)" :options="{ width: 20 }"></qrcode>-->
                <!--                      </el-col>-->
                <!--                      <el-col class="text-center">-->
                <!--                        <span>扫码分享至微信</span>-->
                <!--                      </el-col>-->
                <!--                      <el-button slot="reference"><el-image style="width: 14px;height: 14px;" :src="weiXin" fit="cover"></el-image></el-button>-->
                <!--                    </el-popover>-->
                <!--                  </el-input>-->
                <!--                </el-col>-->
              </el-row>
              <div class="pt-7 pipe-content__reset vditor-reset" id="articleContent" v-html="article.articleContent"
                   style="overflow: hidden;"></div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col v-if="isLogin" style="margin-top: 1rem;">
        <el-col :xs="2" :sm="1" :xl="1">
          <el-avatar :src="avatar"></el-avatar>
        </el-col>
        <el-col :xs="22" :sm="23" :xl="23" style="padding-left: 1rem;">
          <el-input @click.native="showComment" placeholder="请输入回帖内容"></el-input>
        </el-col>
        <!--        <el-col>-->
        <!--          <el-drawer-->
        <!--            :visible.sync="drawer"-->
        <!--            :direction="direction"-->
        <!--            size="40%">-->
        <!--            <el-col slot="title">-->
        <!--              <el-col>-->
        <!--                <el-avatar v-if="commentAuthorAvatar" :src="commentAuthorAvatar"></el-avatar>-->
        <!--                <span class="text-default" style="padding-left: 1rem;">{{ title }}</span>-->
        <!--              </el-col>-->
        <!--            </el-col>-->
        <!--            <el-col>-->
        <!--              <div id="contentEditor"></div>-->
        <!--            </el-col>-->
        <!--            <el-col style="margin-top: 1rem;padding-right:3rem;text-align: right;">-->
        <!--              <el-button type="primary" :loading="loading" @click="postComment">发布</el-button>-->
        <!--            </el-col>-->
        <!--          </el-drawer>-->
        <!--        </el-col>-->
      </el-col>
      <el-col v-else class="text-center" style="margin-top: 1rem;">
        <el-button type="primary" size="medium" @click="gotoLogin">登录</el-button>
        后发布评论
      </el-col>
      <el-col>
        <!--        <Comment :comments="article.articleComments" :reply="reply"></Comment>-->
      </el-col>
    </el-col>
    <el-col v-else>
      <!--      <Component404></Component404>-->
    </el-col>
  </el-row>
</template>

<script>
  import Vue from 'vue';
  import {mapState} from 'vuex';

  export default {
    name: "ArticleDetail",
    validate({params, store}) {
      return params.article_id && !isNaN(Number(params.article_id))
    },
    fetch({store, params, error}) {
      return Promise.all([
        store
          .dispatch('article/fetchDetail', params)
          .catch(err => error({statusCode: 404})),
        // store.dispatch('comment/fetchList', {post_id: params.article_id})
      ])
    },
    computed: {
      ...mapState({
        article: state => state.article.detail.data,
        isFetching: state => state.article.detail.fetching,
        isMobile: state => state.global.isMobile,
        isLogin: state => state.oauth,
        avatar: state => state.oauth?.avatarURL,
      }),
      hasPermissions() {
        let account = this.$store.state.oauth?.nickname;
        if (account) {
          if (account === this.article.articleAuthor.userNickname) {
            return true;
          }
        }
        return this.$store.getters.hasPermissions('blog_admin');
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
        isShow: true,
        loading: false,
        isShare: false,
        shareData: {},
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
      handleCommand(item) {
        let _ts = this;
        if (item === 'edit') {
          _ts.$router.push({
            name: 'post-article',
            query: {
              id: _ts.article.idArticle
            }
          })
        } else {
          _ts.axios.get('/article/' + _ts.article.idArticle + '/share').then(function (res) {
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
      Vue.nextTick(() => {
        this.$store.commit('setActiveMenu', 'articleDetail')
        const previewElement = document.getElementById("articleContent");
        // //const outLineElement = document.getElementById("articleToC");
        // VditorPreview.setContentTheme('light');
        Vue.VditorPreview.codeRender(previewElement, 'zh_CN');
        Vue.VditorPreview.highlightRender({"enable": true, "lineNumber": false, "style": "github"}, previewElement);
        Vue.VditorPreview.mathRender(previewElement, {
          math: {"engine": "KaTeX", "inlineDigit": false, "macros": {}},
        });
        Vue.VditorPreview.mermaidRender(previewElement, ".language-mermaid");
        Vue.VditorPreview.graphvizRender(previewElement);
        Vue.VditorPreview.chartRender(previewElement);
        Vue.VditorPreview.mindmapRender(previewElement);
        Vue.VditorPreview.abcRender(previewElement);
        Vue.VditorPreview.mediaRender(previewElement);
        //VditorPreview.outlineRender(previewElement, outLineElement);
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
