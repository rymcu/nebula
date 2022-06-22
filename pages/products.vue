<template>
  <el-row class="product__wrapper">
    <el-col>
      <product-list :products="products" @currentChange="currentChangeProduct"></product-list>
    </el-col>
  </el-row>
</template>

<script>
import {mapState} from "vuex";
import ProductList from "~/components/common/product/list";

export default {
  name: "products",
  components: {ProductList},
  fetch({store, query, error}) {
    return Promise.all([
      store
        .dispatch('product/fetchList', {page: query.page || 1})
        .catch(err => error({statusCode: 404}))
    ])
  },
  watch: {
    '$route.query': function () {
      this.$store.dispatch('product/fetchList', {page: this.$route.query.page || 1})
    }
  },
  computed: {
    ...mapState({
      products: state => state.product.list.data
    })
  },
  data() {
    return {
      currentDate: new Date().toLocaleString()
    };
  },
  methods: {
    currentChangeProduct(page) {
      this.$router.push({
        name: 'products',
        query: {
          page: page
        }
      })
    }
  },
  mounted() {
    this.$store.commit('setActiveMenu', 'products');
  }
}
</script>

<style scoped>

.product__wrapper {
  max-width: 980px;
  margin: 20px auto;
  display: block;
  padding-left: 1rem;
  padding-right: 1rem;
  box-sizing: border-box;
}

.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
  margin-left: 10px;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}
</style>
