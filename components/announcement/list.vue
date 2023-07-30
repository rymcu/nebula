<template>
  <el-row class="wrapper">
    <el-col :xs="24" :sm="24" :xl="24" style="margin: 0 auto;">
      <el-carousel :interval="5000" height="210px" indicator-position="outside">
        <el-carousel-item v-for="article in announcements.list" :key="article.idArticle">
          <el-card>
            <div class="card-body d-flex flex-column">
              <el-link :href="article.articleLink" style="margin-bottom: .7rem;">
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
              <div style="margin-top: 1rem;">
                <small class="d-block text-muted">发布于 {{ article.timeAgo }}</small>
              </div>
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
  }
}
</script>

<style scoped>

</style>
