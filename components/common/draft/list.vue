<template>
  <el-row>
    <el-col v-for="article in articles.list" :key="article.idArticle">
      <el-col>
        <el-link rel="nofollow" @click="onRouter(article.articleLink)" :underline="false">
          <h2 v-html="article.articleTitle"></h2>
        </el-link>
      </el-col>
      <el-col>
        <small class="d-block text-muted">{{ article.timeAgo }}</small>
      </el-col>
      <el-col>
        <el-divider></el-divider>
      </el-col>
    </el-col>
    <el-col v-if="articles.total === 0" class="text-center">
      <span class="text-default">这里什么也没有!</span>
    </el-col>
    <el-col>
      <div class="vertical-container text-center">
        <el-pagination :hide-on-single-page="true"
                       layout="prev, pager, next"
                       :current-page="articles.pageNum"
                       :total="articles.total"
                       @current-change="currentChange">
        </el-pagination>
      </div>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: "DraftList",
    props: {
      articles: {
        type: Object
      }
    },
    methods: {
      currentChange(page) {
      },
      onRouter(url) {
        this.$router.push({
          path: url
        })
      }
    }
  }
</script>

<style scoped>

</style>
