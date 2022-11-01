<template>
  <el-row class="wrapper">
    <el-col v-if="bankAccount">
      <el-col>
        <h1>账户信息</h1>
      </el-col>
      <el-col class="bank-account-item">
        <span style="font-size: 24px;"> 账号:</span> <span style="color: red;">{{ bankAccount.bankAccount }}</span>
      </el-col>
      <el-col class="bank-account-item">
        <span style="font-size: 24px;"> 余额:</span> <span style="color: red;">{{ bankAccount.accountBalance }}</span>
        <span
          style="font-size: 24px;">巴旦木</span>
      </el-col>
      <el-col>
        <records :records="records" :bankAccount="bankAccount.bankAccount" @currentChange="handleCurrentChange"
                 @searchTransactionRecord="searchTransactionRecord"></records>
      </el-col>
    </el-col>
    <el-col v-else style="text-align: center;margin-top: 10vh;">
      <p style="font-size: 24px;line-height: 48px;">
        <code>钱包</code> 是社区非常重要的组成部分<br/>
        开通钱包账号后可激活 <code>每日一题</code> , <code>赞赏</code> 等功能
      </p>
      <el-button type="primary" @click="createBankAccount">现在开通</el-button>
    </el-col>
  </el-row>
</template>

<script>
import {mapState} from 'vuex';
import Records from "../components/common/bank/account/records";

export default {
  name: "wallet",
  components: {Records},
  fetch() {
    let {store, error} = this.$nuxt.context
    return Promise.all([
      store
        .dispatch('wallet/fetchDetail')
        .catch(err => error({statusCode: 404})),
      store
        .dispatch('wallet/fetchTransactionRecordList')
        .catch(err => error({statusCode: 404}))
    ])
  },
  computed: {
    ...mapState({
      bankAccount: state => state.wallet.detail.data,
      records: state => state.wallet.list.data
    })
  },
  data() {
    return {}
  },
  methods: {
    handleCurrentChange(search) {
      let _ts = this;
      _ts.$store.dispatch('wallet/fetchTransactionRecordList', {
        idUser: _ts.$store.state.auth.user.idUser,
        startDate: search.startDate,
        endDate: search.endDate,
        page: search.page
      })
    },
    searchTransactionRecord(dates) {
      let _ts = this
      let startDate = dates[0]
      let endDate = dates[1]
      _ts.$store.dispatch('wallet/fetchTransactionRecordList', {
        idUser: _ts.$store.state.auth.user.idUser,
        startDate: startDate,
        endDate: endDate
      })
    },
    createBankAccount() {
      let _ts = this
      _ts.$axios.$post('/api/wallet/create').then(function (res) {
        if (res) {
          _ts.$fetch()
        }
      })
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
code {
  color: red;
  font-weight: bold;
}
</style>
