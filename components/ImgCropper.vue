<template>
  <el-dialog title="请裁剪图片" v-bind='$attrs' v-on='$listeners' @open='onOpen' @close='onClose' :title='dialogTitle'
             :close-on-click-modal="false">
    <el-row>
      <el-col :span="12">
        <client-only>
          <div class="cropperBox">
            <vue-cropper
              :autoCrop="autoCrop"
              :img="newAvatarUrl"
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
      </el-col>
      <el-col :span="24" style="margin-top: 2rem;">
        <el-upload
          style="float: left"
          class="avatar-uploader"
          action=""
          :multiple="true"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <div>
            <el-button type="primary" round plain>上传</el-button>
          </div>
        </el-upload>
        <!--        <el-button style="margin-top: 1rem;" type="primary" round plain @click="genAvatar">随机</el-button>-->
        <el-button style="margin-left: 20px;float: left" type="primary" round plain @click.prevent="reset">重置
        </el-button>
        <!--        <el-button type="primary" round plain @click.prevent="updateUser">提交</el-button>-->
      </el-col>
    </el-row>

    <span slot="footer" class="dialog-footer">
    <el-button @click="close">取 消</el-button>
          <el-button type="primary" @click="onSubmit">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
// import VueCropper from "vue-cropper";

export default {
  name: "ImgCropper",
  data() {
    return {
      dialogTitle: '裁剪图片',
      autoCrop: true,
      cropImg: '',
      oldAvatarUrl: '',
      newAvatarUrl: ''
    }
  },
  // components: {
  //   VueCropper
  // },
  props: {
    avatarUrl: {
      type: [String, Object]
    }
  },
  methods: {
    onSubmit() {
      this.$refs.cropper.getCropData(data => {
        this.$emit('onSubmit',data)
      });
    },
    onOpen() {
      this.oldAvatarUrl = JSON.parse(JSON.stringify(this.avatarUrl))
      this.newAvatarUrl = JSON.parse(JSON.stringify(this.avatarUrl))
    },
    onClose() {
    },
    close() {
      this.$emit('update:visible', false)
    },
    realTime(data) {
      this.cropImg = data;
      // this.$emit('cropImg', data)
    },
    handleAvatarSuccess(res) {
      let _ts = this;
      if (res && res.data && res.data.url) {
        _ts.$set(_ts, 'newAvatarUrl', res.data.url);
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
    reset() {
      this.newAvatarUrl = JSON.parse(JSON.stringify(this.oldAvatarUrl))
      // this.$refs.cropper.clearCrop();
    },
    fileToBase64(file) {
      let _ts = this;
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        _ts.$set(_ts, 'newAvatarUrl', this.result);
      }
    },
  }
}
</script>

<style scoped>
.cropperBox {
  width: 100%;
  height: 256px;
  margin-bottom: 20px;
  border: 1px solid #F2F6FC;
}

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
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  overflow: hidden;
}

.avatar {
  border-radius: 100%;
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

</style>
