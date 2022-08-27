<template>
  <el-row class="wrapper verify" style="background-color: #F6F7F8;padding-top: 10%;">
    <el-col :xs="24" :sm="12" :xl="12" class="verify-wrap flex-inline">
      <el-form :model="user" ref="user" status-icon label-width="100px" style="width: 375px;">
        <el-form-item>
          <img src="~/assets/rymcu.png" alt="RYMCU" class="icon-rymcu">
        </el-form-item>
        <el-form-item label="邮箱" prop="email"
                      :rules="[
                  { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                  { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]">
          <el-input v-model="user.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password"
                      :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
          <el-input type="password" v-model="user.password" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword"
                      :rules="[{ required: true, message: '请输入确认密码', trigger: 'blur' }]">
          <el-input type="password" v-model="user.confirmPassword" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code"
                      :rules="[{ required: true, message: '请输入验证码', trigger: 'blur' }]">
          <el-input v-model="user.code" maxlength="6" autocomplete="off">
            <el-button type="email" size="small" slot="append" @click="sendCode" :loading="loading" plain>
              {{ loadText }}
            </el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="width: 60%;" type="primary" @click="register" :loading="registerLoading" plain>立即注册
          </el-button>
          <el-button style="width: 32%;" @click="login" plain>登录</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :xs="24" :sm="12" :xl="12" class="intro vditor-reset verify__sign">
      <div>
        <h2>欢迎来到 RYMCU</h2>
        <p><a rel="nofollow" href="/">RYMCU</a> 是一个嵌入式知识学习交流平台，专注于单片机学习。</p>
        <p>我们正在构建一个小众社区。大家在这里相互<strong>信任</strong>，以<em>平等 • 自由 • 奔放</em>的价值观进行分享交流。最终，希望大家能够找到与自己志同道合的伙伴，共同成长。
        </p>
        <p>最后请大家共同爱护这个<i>自由</i>的交流环境，相信这里一定是你注册过的所有社区中用户体验最好的 😍</p>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "register",
  data() {
    return {
      user: {
        email: '',
        code: '',
        password: '',
        confirmPassword: ''
      },
      registerLoading: false,
      loading: false,
      loadText: '发送验证码',
      timeClock: null
    }
  },
  methods: {
    sendCode() {
      let _ts = this;
      _ts.timerHandler();
      let email = _ts.user.email;
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
    register() {
      let _ts = this;
      _ts.$refs.user.validate((valid) => {
        if (valid) {
          _ts.$set(_ts, 'registerLoading', true);
          setTimeout(function () {
            _ts.$set(_ts, 'registerLoading', false);
          }, 10000);
          let data = {
            email: _ts.user.email,
            password: _ts.user.password,
            code: _ts.user.code
          }
          _ts.$axios.$post('/api/console/register', data).then(function (res) {
            _ts.$set(_ts, 'registerLoading', false);
            if (res) {
              _ts.$message("注册成功！");
              _ts.$router.push(
                {
                  name: 'login'
                }
              )
            }
          })
        } else {
          return false;
        }
      });

    },
    login() {
      this.$router.push(
        {
          name: 'login'
        }
      )
    }
  },
  mounted() {
    this.$store.commit('setActiveMenu', 'register')
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
