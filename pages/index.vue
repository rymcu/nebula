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
    fetch() {
      return this.$store.dispatch('article/fetchList', {page: 1})
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
