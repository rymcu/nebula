<template>
  <div class="topic-archive-page">
    <article-list :articles="articles" @currentChange="currentChangeArticle"/>
  </div>
</template>

<script>
  import ArticleList from '~/components/archive/list'

  export default {
    name: "topicArticleList",
    components: {
      ArticleList
    },
    validate({ params, store }) {
      return params.topic_uri && store.state.topic.data.some(
        topic => topic.topicUri === params.topic_uri
      )
    },
    fetch({ store, params }) {
      return store.dispatch('article/fetchList', params)
    },
    computed: {
      articles() {
        return this.$store.state.article.list.data
      },
      currentTopic() {
        return this.$store.state.topic.data.find(
          topic => topic.topicUri === this.$route.params.topic_uri
        )
      },
      defaultParams() {
        return {
          topic_uri: this.$route.params.topic_uri
        }
      }
    },
    methods: {
      currentChangeArticle(page) {
        this.$store.dispatch('article/fetchList', {page: page,topic: this.currentTopic})
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
