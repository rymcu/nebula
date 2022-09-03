<template>
  <el-row>
    <el-col>
      <h1>交易记录</h1>
    </el-col>
    <el-col style="margin-bottom: 10px;">
      <el-date-picker
        v-model="searchDate"
        type="daterange"
        align="right"
        unlink-panels
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始月份"
        end-placeholder="结束月份"
        :picker-options="pickerOptions"
        @change="searchTransactionRecord">
      </el-date-picker>
    </el-col>
    <el-col>
      <el-table
        :data="records.list"
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
              placement="left"
              trigger="hover">
              <el-col style="padding: 5px;">
                开户银行: {{ scope.row.formBankAccountInfo.bankName }}
              </el-col>
              <el-col style="padding: 5px;">
                银行账号: {{ scope.row.formBankAccountInfo.bankAccount }}
              </el-col>
              <el-col style="padding: 5px;">
                所属用户: {{ scope.row.formBankAccountInfo.accountOwnerName }}
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
                开户银行: {{ scope.row.toBankAccountInfo.bankName }}
              </el-col>
              <el-col style="padding: 5px;">
                银行账号: {{ scope.row.toBankAccountInfo.bankAccount }}
              </el-col>
              <el-col style="padding: 5px;">
                所属用户: {{ scope.row.toBankAccountInfo.accountOwnerName }}
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
            <span v-if="scope.row.formBankAccount === bankAccount" style="color: red;font-weight: bold;">
              - {{ scope.row.money }}
            </span>
            <span v-else style="color: springgreen;font-weight: bold;"> + {{ scope.row.money }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col>
      <el-pagination
        :hide-on-single-page="true"
        @current-change="currentChange"
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
  name: "records",
  props: {
    bankAccount: '',
    records: {
      type: Object
    }
  },
  watch: {
    bankAccount() {
      this.resetSearchDate()
    }
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '本月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setDate(1);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近 30 天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 1);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 3);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近六个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 6);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '今年至今',
          onClick(picker) {
            const end = new Date();
            const start = new Date(new Date().getFullYear(), 0);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      searchDate: []
    }
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
    },
    searchTransactionRecord(dates) {
      this.$emit('searchTransactionRecord', dates);
    },
    resetSearchDate() {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 1);
      let searchDate = [start, end]
      this.searchDate = searchDate
    }
  },
  mounted() {
    this.resetSearchDate()
  }
}
</script>

<style scoped>

</style>
