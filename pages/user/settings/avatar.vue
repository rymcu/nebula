<template>
  <el-row>
    <el-col :spn="12">
      <h1>我的头像</h1>
    </el-col>
    <el-col>
      <el-form :model="user" ref="user" label-width="100px">
        <el-form-item>
          <el-row>
            <el-col :span="12">
              <client-only>
                <div class="cropperBox">
                  <!--                  <vue-cropper-->
                  <!--                    :autoCrop="autoCrop"-->
                  <!--                    :img="avatarUrl"-->
                  <!--                    ref="cropper"-->
                  <!--                    :fixed="true"-->
                  <!--                    @realTime="realTime"-->
                  <!--                    @imgMoving="cropImage"-->
                  <!--                    @cropMoving="cropImage"-->
                  <!--                  />-->
                  <vue-cropper
                    :autoCrop="autoCrop"
                    :img="avatarUrl"
                    ref="cropper"
                    :fixed="true"
                    @realTime="realTime"
                  />
                </div>
              </client-only>
            </el-col>
            <el-col :span="24" style="margin-top: 2rem;">
              <el-col :span="8" style="max-width: 20rem;max-height: 20rem;">
                <div class="preview preview-large" :style="{height:cropImg.h+'px',width:cropImg.w+'px'}"
                     style="overflow:hidden;margin: 0 auto">
                  <img :src="cropImg.url" :style="cropImg.img">
                </div>
              </el-col>
<!--              <el-col :span="6" style="height: 20rem;">-->
<!--                <div class="preview preview-medium" style="overflow:hidden;">-->
<!--                  <div :style="{height:cropImg.h+'px',width:cropImg.w+'px'}"-->
<!--                       style="overflow:hidden;margin: 0 auto">-->
<!--                    <img :src="cropImg.url" :style="cropImg.img">-->
<!--                  </div>-->
<!--                </div>-->
<!--              </el-col>-->
<!--              <el-col :span="4" style="height: 20rem;">-->
<!--                <div class="preview preview-small" style="overflow:hidden;">-->
<!--                  <div :style="{height:(cropImg.h*0.2)+'px',width:cropImg.w+'px'}"-->
<!--                       style="overflow:hidden;margin: 0 auto">-->
<!--                    <img :src="cropImg.url" :style="cropImg.img">-->
<!--                  </div>-->
<!--                </div>-->
<!--                &lt;!&ndash;                <div class="preview preview-small">&ndash;&gt;-->
<!--                &lt;!&ndash;                  <img :src="cropImg.url"/>&ndash;&gt;-->
<!--                &lt;!&ndash;                </div>&ndash;&gt;-->
<!--              </el-col>-->
            </el-col>
            <el-col :span="24" style="margin-top: 2rem;">
              <el-upload
                class="avatar-uploader"
                action=""
                :multiple="true"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <div v-show="false">
                  <Avataaars
                    id="avatarSvg"
                    style="width: 16rem; height: 16rem;"
                    :avatarStyle='avatar.avatarStyle'
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
                <div>
                  <el-button type="primary" round plain>上传</el-button>
                </div>
              </el-upload>
              <el-button style="margin-top: 1rem;" type="primary" round plain @click="genAvatar">随机</el-button>
              <el-button type="primary" round plain @click.prevent="reset">重置</el-button>
              <el-button type="primary" round plain @click.prevent="updateUser">提交</el-button>
            </el-col>
          </el-row>
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
  name: "avatar",
  middleware: 'auth',
  components: {
    Avataaars
  },
  computed: {
    ...mapState({
      uploadHeaders: state => {
        return {'X-Upload-Token': state.uploadHeaders}
      },
      idUser: state => state.auth.user.idUser
    })
  },
  data() {
    return {
      user: {},
      loading: false,
      oldAvatarUrl: '',
      avatarUrl: '',
      avatar: {},
      cropImg: '',
      data: null,
      autoCrop: true,
    }
  },
  methods: {
    realTime(data) {
      console.log(data.img)
      this.cropImg = data;
    },
    genAvatar() {
      let _ts = this;
      let user = _ts.user
      const avatar = generateRandomAvatar();
      _ts.$set(_ts, 'avatar', avatar);
      setTimeout(function () {
        saveSvg.svgAsPngUri(document.getElementById('avatarSvg'), {}).then(uri => {
          if (uri) {
            user.avatarType = 1;
            user.avatarUrl = uri;
            _ts.$set(_ts, 'avatarUrl', uri);
          } else {
            _ts.$message.error('头像上传失败 !');
          }
        });
      }, 300);
    },
    handleAvatarSuccess(res) {
      let _ts = this;
      if (res && res.data && res.data.url) {
        let user = _ts.user;
        user.avatarUrl = res.data.url;
        user.avatarType = '1';
        _ts.$set(_ts, 'user', user);
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
        this.$message.error('上传头像只能是 JPG 或者 PNG 格式!');
        return false;
      }
      if (!isLt2M) {
        this.$message.error('上传头像大小不能超过 2MB!');
        return false;
      }
      this.fileToBase64(file);
      return false;
    },
    getData() {
      let _ts = this;
      _ts.$axios.$get('/api/user-info/detail/' + _ts.idUser).then(function (res) {
        if (res) {
          if (res.message) {
            _ts.$message.error(res.message);
          } else {
            _ts.$set(_ts, 'user', res);
            _ts.$set(_ts, 'avatarUrl', res.avatarUrl);
            _ts.$set(_ts, 'oldAvatarUrl', res.avatarUrl);
            // _ts.webImageToBase64(res.user.avatarUrl);
          }
        }
      })
    },
    reset() {
      let _ts = this;
      const avatarUrl = JSON.parse(JSON.stringify(this.oldAvatarUrl))
      let user = _ts.user;
      user.avatarUrl = avatarUrl;
      user.avatarType = '0';
      _ts.$set(_ts, 'user', user);
      _ts.$set(_ts, 'avatarUrl', avatarUrl);
      // this.$refs.cropper.clearCrop();
    },
    // get image data for post processing, e.g. upload or setting image src
    cropImage() {
      let _ts = this;
      this.$refs.cropper.getCropData(data => {
        let user = _ts.user;
        user.avatarUrl = data;
        user.avatarType = '1';
        _ts.$set(_ts, 'user', user);
        _ts.$set(_ts, 'avatarUrl', data);
      })
    },
    updateUser() {
      let _ts = this;
      let user = _ts.user;
      _ts.$refs['user'].validate((valid) => {
        if (valid) {
          this.$refs.cropper.getCropData(data => {
            user.avatarUrl = data
            _ts.$axios.$patch('/api/user-info/update', user).then(function (res) {
              if (res) {
                if (res.message) {
                  _ts.$message.error(res.message);
                } else {
                  _ts.$set(_ts, 'user', res);
                  _ts.$set(_ts, 'avatarUrl', res.avatarUrl);
                  _ts.$store.commit('setUserInfo', res);
                  _ts.$message.success('更新成功 !');
                }
              }
            })
          });
        } else {
          _ts.$message.error('数据异常 !');
        }
      });
    },
    fileToBase64(file) {
      let _ts = this;
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        _ts.$set(_ts, 'avatarUrl', this.result);
      }
    },
    compress(img, width, height, ratio) {
      // img可以是dataURL或者图片url
      /*	如果宽度大于 750 图片太大 等比压缩 	*/
      if (width > 750) {
        let ratio = width / height;
        width = 750;
        height = 750 / ratio;
      }
      let canvas, ctx, img64;
      canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;


      ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      /* canvas.toDataURL(mimeType（图片的类型）, qualityArgument（图片质量）) */
      img64 = canvas.toDataURL("image/jpeg", ratio);

      return img64; // 压缩后的base64串
    },
    webImageToBase64(url) {
      let _ts = this;
      let c = document.createElement("canvas");
      let cxt = c.getContext("2d");
      let img = new Image();
      img.setAttribute("crossOrigin", '*');
      img.onload = function () {
        c.width = this.width;
        c.height = this.height;
        cxt.drawImage(img, 0, 0, this.width, this.height) // 在canvas上绘制图片
        let dataURL = _ts.compress(img, this.width, this.height, 0.8);
        console.log(dataURL)
      }
      img.src = url;
    }
  },
  mounted() {
    this.$store.commit('setActiveMenu', 'avatar');
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
  width: 16rem;
  height: 16rem;
  line-height: 16rem;
  text-align: center;
}

.avatar {
  width: 16rem;
  height: 16rem;
  display: block;
}

.preview-area {
  width: 16rem;
}

.preview-area p {
  font-size: 1.25rem;
}

.preview-area p:last-of-type {
  margin-top: 1rem;
}

.crop-placeholder {
  width: 36px;
  height: 36px;
  background: #ccc;
}

.cropped-image img {
  max-width: 100%;
}

.img-cropper {
  width: 740px;
  min-height: 360px;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC);
}

.preview-large img {
  object-fit: contain;
  width: 16rem;
  height: 16rem;
}

.preview-large {
  width: 16rem;
  height: 16rem;
  margin-bottom: 1rem;
  margin-top: 3rem;
  border: 3px solid #fff;
  border-radius: 100%;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  overflow: hidden;
}

.preview-medium img {
  object-fit: contain;
  width: 8rem;
  height: 8rem;
}


.preview-medium {
  width: 8rem;
  height: 8rem;
  margin-bottom: 1rem;
  margin-top: 11rem;
  border: 3px solid #fff;
  border-radius: 100%;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  overflow: hidden;

}


.preview-small {
  width: 2rem;
  height: 2rem;
  margin-bottom: 1rem;
  margin-top: 17rem;
  border: 3px solid #fff;
  border-radius: 100%;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  overflow: hidden;
}

.preview-small img {
  object-fit: contain;
  width: 2rem;
  height: 2rem;
}

.cropperBox {
  width: 100%;
  height: 256px;
  margin-bottom: 20px;
  border: 1px solid #F2F6FC;
}
</style>
