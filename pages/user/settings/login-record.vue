<template>
  <el-row>
    <el-col>
      <login-records :records="records" :idUser="idUser" @currentChange="handleCurrentChange"></login-records>
    </el-col>
  </el-row>
</template>

<script>
import {mapState} from 'vuex';
import LoginRecords from "@/components/common/user/login-records";

export default {
  name: "loginRecord",
  middleware: 'auth',
  components: {LoginRecords},
  computed: {
    ...mapState({
      idUser: state => state.auth.user.idUser
    })
  },
  data() {
    return {
      records: {
        records: [],
        pagination: {}
      }
    }
  },
  methods: {
    handleCurrentChange(search) {
      let _ts = this;
      _ts.$axios.$get('api/user-info/login-records', {
        params: {
          idUser: _ts.idUser,
          page: search.page || 1,
          rows: search.size || 10
        }
      }).then(function (res) {
        if (res) {
          _ts.records = res
        }
      })

    },
    getData() {
      let _ts = this
      _ts.$axios.$get('api/user-info/login-records', {
        params: {
          idUser: _ts.idUser
        }
      }).then(function (res) {
        if (res) {
          _ts.records = res
        }
      })
    }
  },
  mounted() {
    this.$store.commit('setActiveMenu', 'login-record');
    this.getData();
  }
}
</script>

<style scoped>

</style>
