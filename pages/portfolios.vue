<template>
  <el-row class="wrapper">
    <el-col>
      <h1>最新作品集</h1>
    </el-col>
    <el-col>
      <portfolio-list :portfolios="portfolios" @currentChange="currentChangePortfolio"></portfolio-list>
    </el-col>
  </el-row>
</template>

<script>
import {mapState} from "vuex";
import PortfolioList from "~/components/common/portfolio/list";

export default {
  name: "Portfolios",
  components: {PortfolioList},
  fetch() {
    let {store, query, error} = this.$nuxt.context
    return Promise.all([
      store
        .dispatch('portfolio/fetchList', {page: query.page || 1})
        .catch(err => error({statusCode: 404}))
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
      portfolios: state => state.portfolio.list.data
    })
  },
  methods: {
    currentChangePortfolio(page) {
      this.$router.push({
        name: 'portfolios',
        query: {
          page: page
        }
      })
    }
  },
  mounted() {
    this.$store.commit('setActiveMenu', 'portfolios');
  }
}
</script>

<style scoped>

</style>
