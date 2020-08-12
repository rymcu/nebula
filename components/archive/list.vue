<template>
  <el-row class="wrapper">
    <el-col :xs="24" :sm="24" :xl="24" style="margin: 0 auto;">
      <el-col v-for="article in articles.articles" :key="article.idArticle" style="padding-bottom: 1rem;">
        <el-card>
          <div class="card-body d-flex flex-column">
            <el-link rel="nofollow" @click="onRouter('article',article.articleLink)" :underline="false" style="margin-bottom: .5rem;">
              <h4 v-html="article.articleTitle"></h4>
            </el-link>
            <el-tag
              style="margin-left: 0.5rem;"
              v-for="tag in article.tags"
              :key="tag.idTag"
              size="mini"
              effect="plain">
              {{ tag.tagTitle }}
            </el-tag>
            <div class="text-muted article-summary-md">{{ article.articlePreviewContent }}</div>
            <el-row class="pt-5">
              <el-col :xs="3" :sm="1" :xl="1" class="mr-3">
                <el-avatar v-if="article.articleAuthorAvatarUrl" size="medium"
                           :src="article.articleAuthorAvatarUrl"></el-avatar>
                <el-avatar v-else size="medium"
                           src="https://static.rymcu.com/article/1578475481946.png"></el-avatar>
              </el-col>
              <el-col :xs="16" :sm="16" :xl="16">
                <div>
                  <el-link rel="nofollow" @click="onRouter('user', article.articleAuthorName)" :underline="false" class="text-default">
                    {{ article.articleAuthorName }}
                  </el-link>
                  <small class="d-block text-muted">{{ article.timeAgo }}</small>
                </div>
              </el-col>
              <el-col class="text-right">
                <el-link rel="nofollow" :underline="false" title="总浏览数"><i class="el-icon-s-data"></i><span style="color: red;">{{ article.articleViewCount }}</span>
                </el-link>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col>
        <div class="vertical-container text-center">
          <el-pagination v-show="articles.pagination.total > 10" v-model="articles.pagination"
                         layout="prev, pager, next"
                         :current-page="articles.pagination.currentPage"
                         :total="articles.pagination.total"
                         @current-change="currentChange">
          </el-pagination>
        </div>
      </el-col>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: "ArticleList",
    props: {
      articles: {
        type: Object
      }
    },
    methods: {
      currentChange(page) {
        this.$emit('currentChange', page);
      },
      onRouter(name, data) {
        if ("article" === name) {
          this.$router.push({
            path: data
          })
        } else {
          this.$router.push(
            {
              path: '/user/' + data
            }
          )
        }
      }
    }
  }
</script>

<style scoped>

</style>
