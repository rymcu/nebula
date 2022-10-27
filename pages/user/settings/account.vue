<template>
  <client-only>
    <el-row>
      <el-col>
        <h1>基本信息</h1>
      </el-col>
      <el-col>
        <el-form :model="user" :rules="rules" ref="user" label-width="100px">
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="user.nickname" @blur="checkNickname"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="user.sex">
              <el-radio border label="0">保密</el-radio>
              <el-radio border label="1">男</el-radio>
              <el-radio border label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="个人介绍" prop="signature">
            <el-input type="textarea" v-model="user.signature"></el-input>
          </el-form-item>
          <el-form-item style="text-align: right;">
            <el-button type="primary" round plain @click="updateUserInfo">保存基本信息</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col>
        <h1>社交信息</h1>
      </el-col>
      <el-col>
        <el-form :model="userExtend" ref="userExtend" label-width="100px">
          <el-form-item label="博客" prop="signature">
            <el-input placeholder="设置后将会公开你的博客" v-model="userExtend.blog">
            </el-input>
          </el-form-item>
          <el-form-item label="github" prop="signature">
            <el-input placeholder="yourname" v-model="userExtend.github">
              <template slot="prepend">https://github.com/</template>
            </el-input>
          </el-form-item>
          <el-form-item label="微博" prop="signature">
            <el-input placeholder="yourname" v-model="userExtend.weibo">
              <template slot="prepend">https://weibo.com/n/</template>
            </el-input>
          </el-form-item>
          <el-form-item label="微信" prop="signature">
            <el-input placeholder="设置后将会公开你的微信" v-model="userExtend.weixin">
            </el-input>
          </el-form-item>
          <el-form-item label="QQ" prop="signature">
            <el-input placeholder="设置后将会公开你的 QQ" v-model="userExtend.qq">
            </el-input>
          </el-form-item>
          <el-form-item style="text-align: right;">
            <el-button type="primary" round plain @click="updateUserExtend">保存社交信息</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </client-only>
</template>

<script>
  import {mapState} from 'vuex';

  export default {
    name: "account",
    middleware: 'auth',
    computed: {
      ...mapState({
        idUser: state => state.auth.user.idUser
      })
    },
    data() {
      return {
        user: {},
        userExtend: {},
        rules: {
          nickname: [
            {required: true, message: '请输入昵称', trigger: 'blur'},
            {min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱地址', trigger: 'blur'},
            {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
          ]
        },
        loading: false
      }
    },
    methods: {
      getData() {
        let _ts = this;
        _ts.$axios.$get('/api/user-info/detail/' + _ts.idUser).then(function (res) {
          if (res) {
            _ts.$set(_ts, 'user', res);
          }
        })
        _ts.$axios.$get('/api/user-info/detail/' + _ts.idUser + '/extend-info').then(function (res) {
          if (res) {
            _ts.$set(_ts, 'userExtend', res);
          }
        })
      },
      checkNickname() {
        let _ts = this;
        _ts.$axios.$get('/api/user-info/check-nickname', {
          params: {
            idUser: _ts.user.idUser,
            nickname: _ts.user.nickname
          }
        }).then(function (res) {
          if (!res) {
            _ts.$message.error('昵称已被占用!');
          }
        })
      },
      updateUserInfo() {
        let _ts = this;
        let user = _ts.user;
        _ts.updateUser(user);
      },
      updateUser(user) {
        let _ts = this;
        _ts.$refs['user'].validate((valid) => {
          if (valid) {
            _ts.$axios.$patch('/api/user-info/update', user).then(function (res) {
              if (res) {
                _ts.$set(_ts, 'user', res);
                _ts.$store.commit('setUserInfo', res);
                _ts.$message.success('更新成功 !');
              }
            })
          } else {
            _ts.$message.error('数据异常 !');
          }
        });
      },
      updateUserExtend() {
        let _ts = this;
        let userExtend = _ts.userExtend;
        _ts.$axios.$patch('/api/user-info/update-extend', userExtend).then(function (res) {
          if (res) {
            _ts.$set(_ts, 'userExtend', res);
            _ts.$message.success('更新成功 !');
          }
        })
      }
    },
    mounted() {
      this.$store.commit('setActiveMenu', 'account');
      this.getData();
    }
  }
</script>

<style scoped>

</style>
