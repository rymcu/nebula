<template>
  <el-row class="wrapper">
    <el-col>
      <h1>账户信息</h1>
    </el-col>
    <el-col class="bank-account-item">
      <span style="font-size: 24px;"> 账号:</span> <span style="color: red;">{{ bankAccount.bankAccount }}</span>
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
          label="流水号"
          prop="transactionNo"
          width="200">
        </el-table-column>
        <el-table-column
          label="支付账号">
          <template slot-scope="scope">
            <el-popover
              placement="right"
              trigger="hover">
                <el-col style="padding: 5px;">
                  开户银行: {{scope.row.formBankAccountInfo.bankName}}
                </el-col>
                <el-col style="padding: 5px;">
                  银行账号: {{scope.row.formBankAccountInfo.bankAccount}}
                </el-col>
                <el-col style="padding: 5px;">
                  所属用户: {{scope.row.formBankAccountInfo.accountOwnerName}}
                </el-col>
              <el-button slot="reference" type="text">{{ scope.row.formBankAccount }}</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="收款账号">
          <template slot-scope="scope">
            <el-popover
              placement="right"
              trigger="hover">
              <el-col style="padding: 5px;">
                开户银行: {{scope.row.toBankAccountInfo.bankName}}
              </el-col>
              <el-col style="padding: 5px;">
                银行账号: {{scope.row.toBankAccountInfo.bankAccount}}
              </el-col>
              <el-col style="padding: 5px;">
                所属用户: {{scope.row.toBankAccountInfo.accountOwnerName}}
              </el-col>
              <el-button slot="reference" type="text">{{ scope.row.toBankAccount }}</el-button>
            </el-popover>
          </template>
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
