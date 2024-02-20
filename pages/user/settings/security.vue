<template>
  <el-row>
    <el-col>
      <h1>账户安全</h1>
    </el-col>
    <el-col>
      <el-form :model="user" ref="user" label-width="100px">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="user.email" disabled>
            <el-button slot="append" @click="changeEmail">更换邮箱</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
          <el-input type="password" v-model="user.password" placeholder="请输入新密码" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword" :rules="[{ required: true, message: '请输入确认密码', trigger: 'blur' }]">
          <el-input type="password" v-model="user.confirmPassword" placeholder="请再次输入新密码" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" round plain @click="updatePassword">提交</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col>
      <h1>双重验证</h1>
    </el-col>
    <el-col>
      <el-button type="primary" round plain @click="open2FA">开启</el-button>
    </el-col>
    <el-dialog
      title="更换邮箱"
      :visible.sync="dialogVisible"
      width="475px"
      :before-close="hideChangeEmailDialog"
      center>
      <el-form :model="emailForm" ref="emailForm" status-icon label-width="100px"
               style="align-items: center;max-width: 375px;">
        <el-form-item label="邮箱" prop="email"
                      :rules="[
                  { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                  { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]">
          <el-input v-model="emailForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code" :rules="[{ required: true, message: '请输入验证码', trigger: 'blur' }]">
          <el-input v-model="emailForm.code" maxlength="6" autocomplete="off">
            <el-button type="email" size="small" slot="append" @click="sendEmailCode" :loading="loading" plain>
              {{ loadText }}
            </el-button>
          </el-input>
        </el-form-item>
        <el-form-item style="text-align: center;">
          <el-button :loading="btnLoading" @click.native="submitChangeEmail" type="success" plain>提交</el-button>
          <el-button :loading="btnLoading" @click.native="hideChangeEmailDialog" plain>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="双重验证"
      :visible.sync="secretKeyDialogVisible"
      width="475px"
      :before-close="hideSecretKeyDialog"
      center>
      <el-row style="text-align: center;">
        <el-col>
          <qrcode :value="secretKey" :options="{ width: 20 }"></qrcode>
        </el-col>
      </el-row>
    </el-dialog>
  </el-row>
</template>

<script>
import Vue from 'vue';
import {mapState} from 'vuex';
import VueQrCode from '@chenfengyuan/vue-qrcode';

Vue.component(VueQrCode.name, VueQrCode);
export default {
  name: "security",
  computed: {
    ...mapState({
      idUser: state => state.auth.user.idUser
    })
  },
  data() {
    return {
      user: {},
      rules: {},
      password: '',
      confirmPassword: '',
      emailForm: {
        email: '',
        code: ''
      },
      dialogVisible: false,
      loading: false,
      loadText: '发送验证码',
      btnLoading: false,
      secretKeyDialogVisible: false,
      secretKey: ''
    }
  },
  methods: {
    changeEmail() {
      this.$set(this, 'dialogVisible', true);
    },
    getData() {
      let _ts = this;
      _ts.$axios.$get('/api/user-info/detail/' + _ts.idUser).then(function (res) {
        _ts.$set(_ts, 'user', res);
      })
    },
    hideChangeEmailDialog() {
      this.$set(this, 'dialogVisible', false);
    },
    sendEmailCode() {
      let _ts = this;
      _ts.timerHandler();
      let email = _ts.emailForm.email;
      if (!email) {
        return false
      }
      let data = {
        email: email
      }
      _ts.$axios.$get('/api/console/get-email-code', {
        params: data
      }).then(response => {
        if (response.message) {
          _ts.$message(response.message);
        }
      }).catch(error => {
        console.log(error);
        _ts.$message("邮件发送失败,请检查邮箱是否正确!");
      })
    },
    timerHandler() {
      let _ts = this;
      _ts.$set(_ts, 'loading', true);
      let times = 30;
      _ts.timeClock = setInterval(function () {
        times--;
        _ts.$set(_ts, 'loadText', times + ' s');
        if (times == 0) {
          clearInterval(_ts.timeClock);
          _ts.$set(_ts, 'loading', false);
          _ts.$set(_ts, 'loadText', '发送验证码');
        }
      }, 1000)
    },
    submitChangeEmail() {
      let _ts = this;
      _ts.$refs.emailForm.validate((valid) => {
        if (valid) {
          _ts.$set(_ts, 'btnLoading', true);
          let data = {
            idUser: _ts.idUser,
            email: _ts.emailForm.email,
            code: _ts.emailForm.code
          }
          _ts.$axios.$patch('/api/user-info/update-email', data).then(function (res) {
            _ts.$set(_ts, 'btnLoading', false);
            if (res) {
              if (res.email) {
                let user = _ts.user;
                user.email = res.email;
                _ts.$set(_ts, 'user', user);
                _ts.$message(res.message);
                _ts.$set(this, 'dialogVisible', false);
              } else {
                _ts.$message(res.message);
              }
            }
          })

        }
      })
    },
    updatePassword() {
      let _ts = this;
      _ts.$refs.user.validate((valid) => {
        if (valid) {
          let password = _ts.user.password;
          let confirmPassword = _ts.user.confirmPassword;
          if (password === confirmPassword) {
            _ts.$axios.$patch('/api/user-info/update-password', {
              idUser: _ts.idUser,
              password: password
            }).then(function (res) {
              if (res) {
                _ts.$message(res.message);
                let user = _ts.user;
                user.password = '';
                user.confirmPassword = '';
                _ts.$set(_ts, 'user', user);
              }
            })
          } else {
            _ts.$message("两次输入的密码不一致!");
          }
        }
      })
    },
    open2FA () {
      let _ts = this;
      _ts.$axios.$get('/api/auth/tow-factor/gen-key').then(function (res) {
        if (res) {
          _ts.secretKey = res.secretKey
          _ts.$set(_ts, 'secretKeyDialogVisible', true);
        }
      })
    },
    hideSecretKeyDialog () {
      this.$set(this, 'secretKeyDialogVisible', false);
    }
  },
  mounted() {
    this.$store.commit('setActiveMenu', 'security');
    this.getData();
  }
}
</script>

<style scoped>

</style>
