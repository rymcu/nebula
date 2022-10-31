<template>
  <el-row>
    <el-col>
      <h1>登录记录</h1>
    </el-col>
    <el-col>
      <el-table
        :data="records.list"
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
        @size-change="sizeChange"
        :current-page="records.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="records.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="records.total">
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
    sizeChange(size) {
      let _ts = this;
      let search = {
        size: size,
        page: _ts.records.pageNum
      }
      _ts.$emit('currentChange', search);
    },
    currentChange(page) {
      let _ts = this;
      let search = {
        page: page,
        size: _ts.records.pageSize
      }
      _ts.$emit('currentChange', search);
    }
  }
}
</script>

<style scoped>

</style>
