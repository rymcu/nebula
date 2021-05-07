<template>
  <el-row class="wrapper">
    <el-col :xs="24" :sm="24" :xl="24" style="margin: 0 auto;">
      <el-carousel :interval="5000" type="card" height="256px">
        <el-carousel-item v-for="article in announcements.articles" :key="article.idArticle" style="padding-bottom: 1rem;">
          <el-card style="height: 250px;">
            <div class="card-body d-flex flex-column">
              <el-link rel="nofollow" @click="onRouter('article',article.articleLink)" :underline="false"
                       style="margin-bottom: .7rem;">
                <h4>
                  {{ article.articleTitle }}
                  <el-tag
                  style="margin-left: 0.5rem;"
                  size="mini"
                  effect="plain">
                  # 公告
                </el-tag>
                </h4>
              </el-link>
              <div class="text-muted article-summary-md">{{ article.articlePreviewContent }}</div>
            </div>
          </el-card>
        </el-carousel-item>
      </el-carousel>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "announcementList",
  props: {
    announcements: {
      type: Object
    }
  },
  methods: {
    onRouter(name, data) {
      this.$router.push({
        path: data
      })
    }
  }
}
</script>

<style scoped>

</style>
