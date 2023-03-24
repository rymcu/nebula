<template>
  <div>
    <announcement-list :announcements="announcements"></announcement-list>
    <article-list :articles="articles" @currentChange="currentChangeArticle"></article-list>
  </div>
</template>
<script>
import ArticleList from '~/components/archive/list'
import AnnouncementList from '~/components/announcement/list'
import {mapState} from 'vuex';

export default {
  name: 'Index',
  fetch() {
    let {store, query, error} = this.$nuxt.context
    return Promise.all([
      store.dispatch('article/fetchList', {page: query.page || 1}),
      store.dispatch('article/fetchAnnouncementList', {page: query.page || 1})
    ])
  },
  watch: {
    '$route'(to, from) {
      if ((to.query.page || 1) !== (from.query.page || 1)) {
        this.$router.go()
      }
    }
  },
  components: {
    AnnouncementList,
    ArticleList
  },
  computed: {
    ...mapState({
      articles: state => state.article.list.data,
      announcements: state => state.article.announcements.data
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
