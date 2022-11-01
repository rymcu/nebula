<template>
  <el-row style="margin-top: 20px;">
    <el-col style="margin-bottom: 1rem;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>银行管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col>
      <el-table
        :data="banks.list"
        style="width: 100%">
        <el-table-column
          label="#"
          width="40"
          prop="idBank">
        </el-table-column>
        <el-table-column
          label="银行名称"
          width="180"
          prop="bankName">
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
        <el-table-column
          label="描述"
          width="180"
          prop="bankDescription">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="showTransfer(scope.$index, scope.row)" plain>划转</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col>
      <el-pagination
        :hide-on-single-page="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="banks.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="banks.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="banks.total">
      </el-pagination>
    </el-col>
    <el-col>
      <el-dialog :visible.sync="dialogVisible">
        <el-form label-width="180px">
          <el-form-item label="转账账户">
            <el-input v-model="toBankAccount" style="width: 300px;"></el-input>
          </el-form-item>
          <el-form-item label="转账金额">
            <el-input-number v-model="money" :min="1" :step="1" :step-strictly="true" style="width: 300px;"></el-input-number>
          </el-form-item>
          <el-form-item label="款项">
            <el-input v-model="funds" style="width: 300px;"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button v-if="money && toBankAccount" type="primary" @click="transfer">确 定</el-button>
          <el-button v-else type="primary" :disabled="true">确 定</el-button>
        </div>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script>
import {mapState} from 'vuex';

export default {
  name: "banks",
  middleware: 'auth',
  fetch() {
    let {store, params, error} = this.$nuxt.context
    return Promise.all([
      store
        .dispatch('bank/fetchList', params)
        .catch(err => error({statusCode: 404}))
    ])
  },
  computed: {
    ...mapState({
      banks: state => state.bank.list.data
    })
  },
  data() {
    return {
      order: 'desc',
      formBankAccount: '',
      toBankAccount: '',
      money: 1,
      dialogVisible: false,
      funds: '财政划拨',
      transactionType: '0'
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
      _ts.$store.dispatch('bank/fetchList', {
        page: _ts.banks.pageNum,
        rows: pageSize
      })
    },
    handleCurrentChange(page) {
      let _ts = this;
      _ts.$store.dispatch('bank/fetchList', {
        page: page,
        rows: _ts.banks.pageSize
      })
    },
    showTransfer(index, bank) {
      let _ts = this;
      _ts.$set(_ts, 'formBankAccount', bank.bankAccount);
      _ts.$set(_ts, 'dialogVisible', true);
    },
    transfer() {
      let _ts = this;
      _ts.$axios.$post("/api/transaction/transfer", {
        formBankAccount: _ts.formBankAccount,
        toBankAccount: _ts.toBankAccount,
        money: _ts.money,
        funds: _ts.funds
      }).then(function (res) {
        if (res) {
          if (res.idTransactionRecord) {
            _ts.$message({
              type: 'success',
              message: '划转成功!'
            });
            _ts.$set(_ts, 'dialogVisible', false);
            _ts.handleCurrentChange(1);
          }
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
