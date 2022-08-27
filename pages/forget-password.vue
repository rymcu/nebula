<template>
  <el-row class="wrapper verify" style="background-color: #F6F7F8;padding-top: 10%;">
    <el-col :xs="24" :sm="12" :xl="12" class="verify-wrap flex-inline">
      <el-form :model="form" ref="form" status-icon label-width="100px" style="width: 375px;">
        <el-form-item>
          <img src="~/assets/rymcu.png" alt="RYMCU" class="icon-rymcu">
        </el-form-item>
        <el-form-item style="text-align: center;">
          <span style="font-size: 32px;">找回密码</span>
        </el-form-item>
        <el-form-item label="新密码" prop="password" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
          <el-input type="password" v-model="form.password" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword"
                      :rules="[{ required: true, message: '请输入确认密码', trigger: 'blur' }]">
          <el-input type="password" v-model="form.confirmPassword" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="width: 60%;" type="primary" @click="forgetPassword" plain>提交</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "forgetPassword",
  data() {
    return {
      form: {
        password: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    forgetPassword() {
      let _ts = this;
      if (_ts.form.password !== _ts.form.confirmPassword) {
        _ts.$message('两次输入的密码不一致!');
        return false;
      }
      let data = {
        code: _ts.$route.query.code,
        password: _ts.form.password
      };
      _ts.$axios.$patch("/api/console/forget-password", data).then(function (res) {
        if (res) {
          _ts.$message("修改成功，正在跳转登录界面！");
          _ts.$router.push({
            name: 'login'
          })
        }
      })
    }
  },
  mounted() {
    this.$store.commit('setActiveMenu', 'forget-password')
  }
}
</script>

<style scoped>
.icon-rymcu {
  margin: 0 auto;
  display: block;
  height: 4rem;
}
</style>
