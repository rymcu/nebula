<template>
  <el-row>
    <el-col>
      <el-input v-model="url">
        <el-popover slot="append"
                    placement="bottom"
                    width="20"
                    trigger="hover">
          <el-col>
            <qrcode :value="url" :options="{ width: 20 }"></qrcode>
          </el-col>
          <el-col class="text-center">
            <span>扫码分享至微信</span>
          </el-col>
          <el-button slot="reference">
            <el-image style="width: 14px;height: 14px;" :src="wx" fit="cover"></el-image>
          </el-button>
        </el-popover>
      </el-input>
    </el-col>
  </el-row>
</template>

<script>
  import Vue from 'vue';
  import VueQrCode from '@chenfengyuan/vue-qrcode';
  import wx from "~/assets/weixin.png";

  Vue.component(VueQrCode.name, VueQrCode);
  export default {
    name: "Share",
    props: {
      url: {
        type: String
      }
    },
    data() {
      return {
        wx: wx
      }
    }
  }
</script>

<style scoped>

</style>
