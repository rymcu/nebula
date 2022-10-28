<template>
  <el-row class="wrapper">
    <el-col style="margin-bottom: 1rem;">
      <h1>我的草稿</h1>
    </el-col>
    <draft-list :articles="articles"></draft-list>
  </el-row>
</template>

<script>
  import DraftList from '~/components/common/draft/list';
  import {mapState} from 'vuex';

  export default {
    name: "Drafts",
    middleware: 'auth',
    components: {
      DraftList
    },
    fetch() {
      let {store, error} = this.$nuxt.context
      return Promise.all([
        store
          .dispatch('draft/fetchList')
          .catch(err => error({statusCode: 404}))
      ])
    },
    computed: {
      ...mapState({
        articles: state => state.draft.list.data,
        user: state => state.auth.user
      })
    },
    mounted() {
      this.$store.commit('setActiveMenu', 'drafts');
    }
  }
</script>

<style scoped>

</style>
