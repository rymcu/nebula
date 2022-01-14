<template>
  <el-row>
    <el-col>
      <h1>登录记录</h1>
    </el-col>
    <el-col>
      <el-table
        :data="records.records"
        style="width: 100%">
        <el-table-column
          label="登录 IP"
          prop="loginIp"
          width="200">
        </el-table-column>
        <el-table-column
          label="浏览器"
          width="180"
          prop="loginBrowser">
        </el-table-column>
        <el-table-column
          label="登录时间"
          width="180"
          prop="createdTime">
        </el-table-column>
      </el-table>
    </el-col>
    <el-col>
      <el-pagination
        :hide-on-single-page="true"
        @current-change="currentChange"
        :current-page="records.pagination.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="records.pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="records.pagination.total">
      </el-pagination>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "loginRecords",
  props: {
    idUser: '',
    records: {
      type: Object
    }
  },
  watch: {
    idUser() {
      this.resetSearchDate()
    }
  },
  data() {
    return {}
  },
  methods: {
    currentChange(page) {
      let _ts = this;
      let startDate = _ts.searchDate[0]
      let endDate = _ts.searchDate[1]
      let search = {
        page: page,
        startDate: startDate,
        endDate: endDate
      }
      _ts.$emit('currentChange', search);
    }
  }
}
</script>

<style scoped>

</style>
