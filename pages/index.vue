<template>
  <div>
    <article-list :articles="articles" @currentChange="currentChangeArticle"></article-list>
  </div>
</template>
<script>
import ArticleList from '~/components/archive/list'
import {mapState} from 'vuex';

export default {
  name: 'Index',
  fetch({store, query}) {
    return Promise.all([
      store.dispatch('article/fetchList', {page: query.page || 1})
    ])
  },
  watch: {
    '$route.query': function () {
      this.$store.dispatch('article/fetchList', {page: this.$route.query.page || 1})
    }
  },
  components: {
    ArticleList
  },
  computed: {
    ...mapState({
      articles: state => state.article.list.data
    })
  },
  methods: {
    currentChangeArticle(page) {
      this.$router.push({
        name: 'index',
        query: {
          page: page
        }
      })
    }
  },
  mounted() {
    this.$store.commit('setActiveMenu', 'index')
  }
}
</script>

<style>

</style>
