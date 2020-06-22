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
    }
  }
</script>

<style>
  .el-header {
    padding-bottom: 1rem;
    background: #fff;
    border-bottom: 1px solid rgba(0, 40, 100, 0.12);
    z-index: 80;
  }

  .el-main {
    padding: 20px 0;
    background-attachment: fixed;
    min-height: 280px;
    margin-bottom: 60px;
    overflow-x: hidden;
  }

  .el-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding-top: 1rem;
    padding-bottom: 1rem;
    background: #fff;
    border-top: 1px solid rgba(0, 40, 100, 0.12);
    z-index: 80;
  }
</style>
