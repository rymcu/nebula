<template>
  <el-row class="wrapper">
    <el-col>
      <h1>货币规则</h1>
    </el-col>
    <el-col>
      <el-table :data="currencyRules">
        <el-table-column
          label="规则名称"
          width="180"
          prop="ruleName">
        </el-table-column>
        <el-table-column
          label="奖励/消耗(巴旦木)"
          width="180"
          prop="money">
          <template slot-scope="scope">
            <span v-if="scope.row.awardStatus === '0'" style="color: limegreen;font-weight: bold;">+{{ scope.row.money }}</span>
            <span v-else style="color: red;font-weight: bold;">-{{ scope.row.money }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="上限(巴旦木)"
          width="180"
          prop="maximumMoney">
        </el-table-column>
        <el-table-column
          label="重复(天/次)"
          width="180"
          prop="repeatDays">
        </el-table-column>
        <el-table-column
          label="规则说明"
          prop="ruleDescription">
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: "currency",
  fetch() {
    let {store, params, error} = this.$nuxt.context
    return Promise.all([
      store
        .dispatch('rule/fetchCurrencyRules', params)
        .catch(err => error({statusCode: 404}))
    ])
  },
  computed: {
    ...mapState({
      currencyRules: state => state.rule.currencyRules.data
    })
  },
  mounted() {
    this.$store.commit('setActiveMenu', 'currencyRule');
  }
}
</script>

<style scoped>

</style>
