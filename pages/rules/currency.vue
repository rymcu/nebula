<template>
  <el-row class="wrapper">
    <el-col>
      <h1>货币规则</h1>
    </el-col>
    <el-col>
      <el-table
        :data="currencyRules"
        style="width: 100%">
        <el-table-column
          label="名称"
          width="180"
          prop="ruleName">
        </el-table-column>
        <el-table-column
          label="描述"
          width="180"
          prop="ruleDescription">
        </el-table-column>
        <el-table-column
          label="奖励/消耗"
          width="180"
          prop="money">
        </el-table-column>
        <el-table-column
          label="上限"
          width="180"
          prop="maximumMoney">
        </el-table-column>
        <el-table-column
          label="重复"
          width="180"
          prop="repeatDays">
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: "currency",
  fetch({store, params, error}) {
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
  }
}
</script>

<style scoped>

</style>
