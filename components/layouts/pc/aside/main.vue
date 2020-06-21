<template>
  <el-row class="wrapper">
    <el-col :xs="24" :sm="24" :xl="24" style="margin: 0 auto;">
      <el-col v-for="article in articles.data" :key="article.idArticle" style="padding-bottom: 1rem;">
        <el-card>
          <div class="card-body d-flex flex-column">
            <el-link @click="onRouter('article',article.articleLink)" :underline="false" style="margin-bottom: .5rem;">
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
                <el-avatar v-if="article.articleAuthorAvatarUrl" size="medium" :src="article.articleAuthorAvatarUrl"></el-avatar>
                <el-avatar v-else size="medium" src="https://rymcu.com/vertical/article/1578475481946.png"></el-avatar>
              </el-col>
              <el-col :xs="20" :sm="20" :xl="20">
                <div>
                  <el-link @click="onRouter('user', article.articleAuthorName)" :underline="false" class="text-default">{{ article.articleAuthorName }}</el-link>
                  <small class="d-block text-muted">{{ article.timeAgo }}</small>
                </div>
              </el-col>
              <el-col class="text-right">
                <el-link :underline="false" title="总浏览数"><i class="el-icon-s-data"></i><span style="color: red;">{{ article.articleViewCount }}</span></el-link>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col>
        <div class="vertical-container text-center">
          <el-pagination v-show="pagination.total > 10" v-model="pagination"
                         layout="prev, pager, next"
                         :current-page="pagination.currentPage"
                         :total="pagination.total"
                         @current-change="currentChange">
          </el-pagination>
        </div>
      </el-col>
    </el-col>
  </el-row>
</template>

<script>
  import Vue from 'vue';
  import { mapState } from 'vuex';

  export default Vue.extend({
    name: "PcAside",
    data() {
      return {
      }
    },
    computed: {
      ...mapState({
        articles: state => state.article.list.data,
        pagination: state => state.article.list.data.pagination
      })
    },
    methods: {
      currentChange(p) {
        console.log(p);
      }
    },
    mounted () {
    }
  })
</script>

<style scoped>

</style>
