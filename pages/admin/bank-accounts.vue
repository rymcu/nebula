<template>
  <el-row style="margin-top: 20px;">
    <el-col style="margin-bottom: 1rem;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>银行账户管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col>
      <el-table
        :data="bankAccounts.list"
        style="width: 100%">
        <el-table-column
          label="#"
          width="40"
          prop="idBankAccount">
        </el-table-column>
        <el-table-column
          label="开户银行"
          width="180"
          prop="bankName">
        </el-table-column>
        <el-table-column
          label="账户所有者"
          width="180"
          prop="accountOwnerName">
        </el-table-column>
        <el-table-column
          label="银行账户"
          width="180"
          prop="bankAccount">
        </el-table-column>
        <el-table-column
          label="账户余额 (巴旦木)"
          width="180"
          prop="accountBalance">
        </el-table-column>
        <el-table-column
          label="创建时间"
          width="180"
          prop="createdTime">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary"
                       @click="transactionRecords(scope.$index, scope.row)" plain>查看交易记录
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col>
      <el-pagination
        :hide-on-single-page="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="bankAccounts.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="bankAccounts.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="bankAccounts.total">
      </el-pagination>
    </el-col>
    <el-dialog :title="'卡号：' + bankAccount + ' 的交易记录'" :visible.sync="dialogVisible">
      <records :records="records" :bankAccount="bankAccount"
               @currentChange="handleTransactionRecordCurrentChange"
               @searchTransactionRecord="searchTransactionRecord"></records>
    </el-dialog>
  </el-row>
</template>

<script>
import {mapState} from 'vuex';
import Records from "../../components/common/bank/account/records";

export default {
  name: "bank-accounts",
  middleware: 'auth',
  components: {Records},
  fetch() {
    let {store, params, error} = this.$nuxt.context
    return Promise.all([
      store
        .dispatch('bank-account/fetchList', params)
        .catch(err => error({statusCode: 404}))
    ])
  },
  computed: {
    ...mapState({
      bankAccounts: state => state["bank-account"].list.data,
      records: state => state["bank-account"].records.data
    })
  },
  data() {
    return {
      order: 'desc',
      idRole: 0,
      idUser: 0,
      dialogVisible: false,
      bankAccount: ''
    }
  },
  methods: {
    onRouter(name, data) {
      this.$router.push({
        path: `/${name}/${data}`
      })
    },
    handleSizeChange(pageSize) {
      let _ts = this;
      _ts.$store.dispatch('bank-account/fetchList', {
        page: _ts.bankAccounts.pageNum,
        rows: pageSize
      })
    },
    handleCurrentChange(page) {
      let _ts = this;
      _ts.$store.dispatch('bank-account/fetchList', {
        page: page,
        rows: _ts.bankAccounts.pageSize
      })
    },
    transactionRecords(index, bankAccount) {
      let _ts = this
      _ts.bankAccount = bankAccount.bankAccount
      _ts.dialogVisible = true
      _ts.$store.dispatch('bank-account/fetchTransactionRecordList', {
        bankAccount: _ts.bankAccount
      })
    },
    handleTransactionRecordCurrentChange(search) {
      let _ts = this;
      _ts.$store.dispatch('bank-account/fetchTransactionRecordList', {
        bankAccount: _ts.bankAccount,
        startDate: search.startDate,
        endDate: search.endDate,
        page: search.page
      })
    },
    searchTransactionRecord(dates) {
      let _ts = this
      let startDate = dates[0]
      let endDate = dates[1]
      _ts.$store.dispatch('bank-account/fetchTransactionRecordList', {
        bankAccount: _ts.bankAccount,
        startDate: startDate,
        endDate: endDate
      })
    }
  }
}
</script>

<style scoped>

</style>
