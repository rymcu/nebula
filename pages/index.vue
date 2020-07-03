<template>
  <div>
    <article-list :articles="articles" @currentChange="currentChangeArticle"></article-list>
  </div>
</template>
<script>
  import ArticleList from '~/components/archive/list'

  export default {
    name: 'Index',
    fetch({store}) {
      return Promise.all([
        store.dispatch('article/fetchList')
      ])
    },
    components: {
      ArticleList
    },
    computed: {
      articles() {
        return this.$store.state.article.list.data
      }
    },
    methods: {
      currentChangeArticle(page) {
        this.$store.dispatch('article/fetchList', {page: page})
      }
    },
    mounted() {
      this.$store.commit('setActiveMenu', 'index')
    }
  }
</script>

<style>

</style>
