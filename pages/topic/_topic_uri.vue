<template>
  <div class="topic-archive-page">
    <topic-nav :currentTopic="defaultParams.topic_uri"></topic-nav>
    <article-list :articles="articles" @currentChange="currentChangeArticle"></article-list>
  </div>
</template>

<script>
import ArticleList from '~/components/archive/list'
import {mapState} from 'vuex';

export default {
  name: "topicArticleList",
  components: {
    ArticleList
  },
  validate({params, store}) {
    if (params.topic_uri === 'news') {
      return true;
    }
    return params.topic_uri && store.state.topic.data.some(
      topic => topic.topicUri === params.topic_uri
    )
  },
  fetch() {
    let {store, params, query} = this.$nuxt.context
    params.page = query.page || 1
    return Promise.all([
      store.dispatch('article/fetchList', params)
    ])
  },
  watch: {
    '$route'(to, from) {
      if (from.query.page && to.query.page) {
        this.$router.go()
      }
    }
  },
  computed: {
    ...mapState({
      articles: state => state.article.list.data
    }),
    currentTopic() {
      if (this.$route.params.topic_uri === 'news') {
        return true;
      }
      return this.$store.state.topic.data.find(
        topic => topic.topicUri === this.$route.params.topic_uri
      )
    },
    defaultParams() {
      return {
        topic_uri: this.$route.params.topic_uri,
        page: this.$route.query.page || 1
      }
    }
  },
  methods: {
    currentChangeArticle(page) {
      this.$router.push({
        path: `/topic/${this.defaultParams.topic_uri}?page=${page}`
      })
    }
  },
  mounted() {
    this.$store.commit('setActiveMenu', 'topic');
  },
  created() {
    if (!this.currentTopic) {
      this.$router.back()
    }
  }
}
</script>

<style scoped>

</style>
