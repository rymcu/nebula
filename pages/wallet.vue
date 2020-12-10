<template>
  <el-row class="wrapper">
    <el-col>
      <h1>账户信息</h1>
    </el-col>
    <el-col class="bank-account-item">
      <span style="font-size: 24px;"> 余额:</span> <span style="color: red;">{{ bankAccount.accountBalance }}</span> <span style="font-size: 24px;">巴旦木</span>
    </el-col>
    <el-col>
      <h1>交易记录</h1>
    </el-col>
    <el-col>
      <el-table
        :data="transactionRecords"
        style="width: 100%">
        <el-table-column
          label="#"
          width="40"
          prop="idTransactionRecord">
        </el-table-column>
        <el-table-column
          label="款项"
          width="180"
          prop="funds">
        </el-table-column>
        <el-table-column
          label="交易时间"
          width="180"
          prop="transactionTime">
        </el-table-column>
        <el-table-column
          label="金额 (巴旦木)">
          <template slot-scope="scope">
            <span v-if="scope.row.formBankAccount === bankAccount.bankAccount" style="color: red;font-weight: bold;">
              - {{ scope.row.money }}
            </span>
            <span v-else style="color: springgreen;font-weight: bold;"> + {{ scope.row.money }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<script>
import {mapState} from 'vuex';

export default {
  name: "wallet",
  fetch({store, error}) {
    return Promise.all([
      store
        .dispatch('wallet/fetchDetail', {idUser: store.state.oauth.idUser})
        .catch(err => error({statusCode: 404}))
    ])
  },
  computed: {
    ...mapState({
      bankAccount: state => state.wallet.detail.data,
      transactionRecords: state => state.wallet.detail.data.transactionRecords,
    })
  },
  data() {
    return {
    }
  },
  mounted() {
    this.$store.commit('setActiveMenu', 'wallet');
  }
}
</script>

<style scoped>
.bank-account-item {
  font-size: 32px;
  padding-left: 15vw;
}
</style>
