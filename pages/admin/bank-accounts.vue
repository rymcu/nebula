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
        :data="bankAccounts"
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
      </el-table>
    </el-col>
    <el-col>
      <el-pagination
        :hide-on-single-page="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total">
      </el-pagination>
    </el-col>
  </el-row>
</template>

<script>
import {mapState} from 'vuex';

export default {
  name: "bank-accounts",
  fetch({store, params, error}) {
    return Promise.all([
      store
        .dispatch('bank-account/fetchList', params)
        .catch(err => error({statusCode: 404}))
    ])
  },
  computed: {
    ...mapState({
      bankAccounts: state => state["bank-account"].list.data.bankAccounts,
      pagination: state => state["bank-account"].list.data.pagination
    })
  },
  data() {
    return {
      order: 'desc',
      idRole: 0,
      idUser: 0,
      dialogVisible: false
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
        page: _ts.pagination.currentPage,
        rows: pageSize
      })
    },
    handleCurrentChange(page) {
      let _ts = this;
      _ts.$store.dispatch('bank-account/fetchList', {
        page: page,
        rows: _ts.pagination.pageSize
      })
    }
  },
  mounted() {
    this.$store.commit("setActiveMenu", "admin-bank-accounts");
  }
}
</script>

<style scoped>

</style>
