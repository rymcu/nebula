<template>
  <el-row>
    <el-col>
      <el-form :model="user" :rules="rules" ref="user" label-width="100px">
        <el-form-item style="align-items: center;text-align: center;">
          <el-upload
            class="avatar-uploader"
            :action="tokenURL.URL"
            :multiple="true"
            :with-credentials="true"
            :headers="uploadHeaders"
            :show-file-list="false"
            :data="uploadOption"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <div v-if="svgShow">
              <Avataaars
                id="avatarSvg"
                style="width: 178px; height: 178px;"
                :avatarStyle='avatar.acatarStyle'
                :topType='avatar.topType'
                :accessoriesType='avatar.accessoriesType'
                :hairColor='avatar.hairColor'
                :facialHairType='avatar.facialHairType'
                :clotheType='avatar.clotheType'
                :clotheColor='avatar.clotheColor'
                :eyeType='avatar.eyeType'
                :eyebrowType='avatar.eyebrowType'
                :mouthType='avatar.mouthType'
                :skinColor='avatar.skinColor'>
              </Avataaars>
            </div>
            <div v-else>
              <el-avatar v-if="avatarUrl" class="avatar" :src="avatarUrl"></el-avatar>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </div>
          </el-upload>
          <el-button style="margin-top: 1rem;" type="primary" round @click="genAvatar">随机</el-button>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="user.nickname" @blur="checkNickname"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="email" v-model="user.email" :disabled="true"></el-input>
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
          <el-button type="primary" round @click="updateUserInfo">保存</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
  import {mapState} from 'vuex';
  import Avataaars from 'vuejs-avataaars';
  import saveSvg from 'save-svg-as-png';

  const {generateRandomAvatar} = require('~/plugins/avataaars/generator/generateAvatar');
  export default {
    name: "account",
    components: {
      Avataaars
    },
    computed: {
      ...mapState({
        uploadHeaders: state => {
          return {'X-Upload-Token': state.uploadHeaders}
        },
        idUser: state => state.oauth.idUser
      })
    },
    data() {
      return {
        user: {},
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
        loading: false,
        svgShow: false,
        tokenURL: {
          URL: '',
          token: ''
        },
        avatarUrl: '',
        avatar: {},
        fileList: [],
        uploadOption: {
          type: 0
        }
      }
    },
    methods: {
      genAvatar() {
        let _ts = this;
        _ts.$set(_ts, 'svgShow', true);
        const avatar = generateRandomAvatar();
        _ts.$set(_ts, 'avatar', avatar);
      },
      handleAvatarSuccess(res) {
        let _ts = this;
        if (res && res.data && res.data.url) {
          let user = _ts.user;
          user.avatarUrl = res.data.url;
          user.avatarType = '';
          _ts.$set(_ts, 'user', user);
          _ts.$set(_ts, 'svgShow', false);
          _ts.$set(_ts, 'avatarUrl', res.data.url);
        } else {
          _ts.$message.error('上传失败!');
        }
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!(isJPG || isPNG)) {
          this.$message.error('上传图标只能是 JPG 或者 PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图标大小不能超过 2MB!');
        }
        return (isJPG || isPNG) && isLt2M;
      },
      getData() {
        let _ts = this;
        _ts.$axios.$get('/api/user-info/detail/' + _ts.idUser).then(function (res) {
          if (res) {
            if (res.message) {
              _ts.$message.error(res.message);
            } else {
              _ts.$set(_ts, 'user', res.user);
              _ts.$set(_ts, 'avatarUrl', res.user.avatarUrl);
            }
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
          if (res && res.message) {
            _ts.$message.error(res.message);
          }
        })
      },
      updateUserInfo() {
        let _ts = this;
        let svgShow = _ts.svgShow;
        let user = _ts.user;
        if (svgShow) {
          saveSvg.svgAsPngUri(document.getElementById('avatarSvg'), {}).then(uri => {
            if (uri) {
              user.avatarType = 1;
              user.avatarUrl = uri;
              _ts.updateUser(user);
            } else {
              _ts.$message.error('头像上传失败 !');
            }
          });
        } else {
          _ts.updateUser(user);
        }
      },
      updateUser(user) {
        let _ts = this;
        _ts.$refs['user'].validate((valid) => {
          if (valid) {
            _ts.$axios.$patch('/api/user-info/update', user).then(function (res) {
              if (res) {
                if (res.message) {
                  _ts.$message.error(res.message);
                } else {
                  _ts.$set(_ts, 'user', res.user);
                  _ts.$set(_ts, 'avatarUrl', res.user.avatarUrl);
                  _ts.$set(_ts, 'svgShow', false);
                  _ts.$store.commit('setUserInfo', res.user);
                  _ts.$message.success('更新成功 !');
                }
              }
            })
          } else {
            _ts.$message.error('数据异常 !');
          }
        });
      }
    },
    mounted() {
      let _ts = this;
      this.$store.commit('setActiveMenu', 'account');
      this.$axios.$get('/api/upload/simple/token').then(function (res) {
        if (res) {
          _ts.$store.commit('setUploadHeaders', res.uploadToken);
          _ts.$set(_ts, 'tokenURL', {
            token: res.uploadToken || '',
            URL: res.uploadURL || '',
          })
        }
      });
      this.getData();
    }
  }
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
