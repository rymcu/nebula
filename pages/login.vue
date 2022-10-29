<template>
  <el-row class="wrapper verify" style="background-color: #F6F7F8;padding-top: 10%;">
    <el-col :xs="24" :sm="12" :xl="12" class="verify-wrap flex-inline">
      <el-form :model="user" ref="user" status-icon label-width="100px" style="width: 375px;">
        <el-form-item>
          <img src="~/assets/rymcu.png" alt="RYMCU" class="icon-rymcu">
        </el-form-item>
        <el-form-item label="账号" prop="account" :rules="[{ required: true, message: '请输入账号', trigger: 'blur' }]">
          <el-input v-model="user.account" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
          <el-input type="password" v-model="user.password" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-link rel="nofollow" style="float: right;" :underline="false" @click="forgetPassword">忘记密码</el-link>
        </el-form-item>
        <el-form-item>
          <el-button style="width: 60%;" type="primary" @click="login" :loading="loginLoading" plain>立即登录</el-button>
          <el-button style="width: 32%;" @click="register" plain>注册</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :xs="24" :sm="12" :xl="12" class="intro vditor-reset verify__sign">
      <div>
        <h2>欢迎来到 RYMCU</h2>
        <p><a rel="nofollow" href="/">RYMCU</a> 是一个嵌入式知识学习交流平台，专注于单片机学习。</p>
        <p>我们正在构建一个小众社区。大家在这里相互<strong>信任</strong>，以<em>平等 • 自由 • 奔放</em>的价值观进行分享交流。最终，希望大家能够找到与自己志同道合的伙伴，共同成长。</p>
        <p>最后请大家共同爱护这个<i>自由</i>的交流环境，相信这里一定是你注册过的所有社区中用户体验最好的 😍</p>
      </div>
    </el-col>
    <el-dialog
      title="找回密码"
      :visible.sync="forget"
      width="475px"
      :before-close="hideForgetPasswordDialog"
      center>
      <el-form :model="forgetForm" ref="forgetForm" status-icon label-width="100px"
               style="align-items: center;max-width: 375px;">
        <el-form-item label="邮箱" prop="email"
                      :rules="[
                  { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                  { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]">
          <el-input v-model="forgetForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item style="text-align: center;">
          <el-button :loading="loading" @click.native="sendEmailCode" type="success" plain>发送</el-button>
          <el-button :loading="loading" @click.native="hideForgetPasswordDialog" plain>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-row>
</template>

<script>
import {mapState} from 'vuex';

export default {
  name: "login",
  middleware: 'auth',
  auth: 'guest',
  data() {
    return {
      user: {
        account: '',
        password: ''
      },
      forgetForm: {
        email: ''
      },
      forget: false,
      loading: false,
      loginLoading: false,
      historyUrl: ''
    }
  },
  computed: {
    ...mapState({
      article: state => state.article.detail.data
    })
  },
  methods: {
    login() {
      let _ts = this;
      _ts.$refs.user.validate(async (valid) => {
        if (valid) {
          _ts.$set(_ts, 'loginLoading', true);
          let data = {
            account: _ts.user.account,
            password: _ts.user.password
          }
          try {
            let response = await _ts.$auth.loginWith('local', {data: data})
            if (response.success) {
              _ts.$auth.setUserToken(response.data.token, response.data.refreshToken);
              if (_ts.historyUrl) {
                window.location.href = _ts.historyUrl
              }
            }
            _ts.$set(_ts, 'loginLoading', false);
          } catch (err) {
            _ts.$set(_ts, 'loginLoading', false);
            console.log(err)
          }
        } else {
          return false;
        }
      });
    },
    register() {
      this.$router.push(
        {
          name: 'register'
        }
      )
    },
    forgetPassword() {
      this.forget = true;
    },
    hideForgetPasswordDialog() {
      this.forget = false;
    },
    sendEmailCode() {
      let _ts = this;
      _ts.loading = true;
      let email = _ts.forgetForm.email;
      if (!email) {
        return false
      }
      let data = {
        email: email
      };
      _ts.$axios.$get('/api/console/get-forget-password-email', {
        params: data
      }).then(function (res) {
        _ts.loading = false;
        _ts.forget = false;
        if (res) {
          _ts.$message(res.message)
        }
      })
    }
  },
  mounted() {
    let _ts = this
    _ts.$store.commit('setActiveMenu', 'login');
    _ts.$set(_ts, 'historyUrl', _ts.$route.query.historyUrl || '');
    // if (_ts.$auth.loggedIn) {
    //   _ts.$router.push({
    //     name: 'index'
    //   })
    // }
  }
}
</script>

<style scoped>
.icon-rymcu {
  margin: 0 auto;
  display: block;
  height: 4rem;
}

.verify .verify-wrap {
  /*width: 60%;*/
}

.flex-inline {
  display: flex;
  align-items: center;
}

.verify .intro {
  padding: 50px;
  background-color: #f1f7fe;
  /*width: 40%;*/
  color: #616161;
}

.verify__sign {
  background-color: transparent !important;
}

.vditor-reset {
  font-variant-ligatures: no-common-ligatures;
  font-family: Helvetica Neue, Luxi Sans, DejaVu Sans, Tahoma, Hiragino Sans GB, Microsoft Yahei, sans-serif, Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, Segoe UI Symbol, Android Emoji, EmojiSymbols;
  word-wrap: break-word;
  overflow: auto;
  line-height: 1.5;
  font-size: 16px;
  word-break: break-word;
}
</style>
