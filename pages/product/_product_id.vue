<template>
  <el-row class="article__wrapper">
    <el-col>
      <el-card>
        <div class="card-body d-flex flex-column article">
          <div class="article__item">
            <h1 class="list__title">
              {{ product.productTitle }}
            </h1>
          </div>
          <div style="margin: 1rem 0;">
            <el-tag
              style="margin-right: 0.5rem;"
              v-for="tag in product.tags?.split(',') || []"
              :key="tag"
              size="small"
              effect="plain">
              # {{ tag }}
            </el-tag>
          </div>
          <div class="pt-7 pipe-content__reset vditor-reset" id="articleContent" v-html="product.productContent"
               style="overflow: hidden;"></div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import {mapState} from 'vuex';

export default {
  name: "ProductDetail",
  validate({params, store}) {
    return params.product_id && !isNaN(Number(params.product_id))
  },
  fetch() {
    let {store, params, error} = this.$nuxt.context
    return Promise.all([
      store
        .dispatch('product/fetchDetail', params)
        .catch(err => error({statusCode: 404}))
    ])
  },
  computed: {
    ...mapState({
      product: state => state.product.detail.data
    })
  },
  mounted() {
    this.$store.commit('setActiveMenu', 'product');
  }
}
</script>

<style lang="less">
@import "~vditor/src/assets/less/index.less";

.article__wrapper {
  max-width: 980px;
  margin: 20px auto;
  display: block;
  padding-left: 1rem;
  padding-right: 1rem;
  box-sizing: border-box;
}
</style>
