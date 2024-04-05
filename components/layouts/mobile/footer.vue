<template>
  <el-row class="footer">
    <el-col style="text-align: center;">
      <el-col :xs="24" :sm="24" :xl="12">
        <span>{{ slogan }}</span>
      </el-col>
      <el-col :xs="24" :sm="24" :xl="12">
        <el-col class="row align-items-center">
          <el-col class="col-auto">
            Copyright © {{new Date().getFullYear()}}
            <el-link rel="nofollow" :underline="false" href="/" style="vertical-align: baseline;"><span>{{
                systemName
              }}</span>
            </el-link>
            .
          </el-col>
          <el-col>
            <el-link rel="nofollow" :underline="false" :href="wangBeiUrl" target="_blank"
                     style="vertical-align: baseline;"><img
              :src="wangBeiImage" style="float:left;"/><span>{{ wangBei }}</span>
            </el-link>
          </el-col>
          <el-col>
            <el-link rel="nofollow" :underline="false" href="http://www.beian.miit.gov.cn/" target="_blank"
                     style="vertical-align: baseline;"><span>{{ beiAn }}</span>
            </el-link>
          </el-col>
        </el-col>
      </el-col>
    </el-col>
  </el-row>
</template>

<script>
import wangBeiImage from '~/assets/wangbei.png'

export default {
  name: "MobileFooter",
  data() {
    return {
      systemTitle: '\u7f57\u5409\u7f51\u0020\u002d\u0020\u5185\u5bb9\u5206\u4eab\u751f\u6001\u5e73\u53f0',
      systemName: 'RYMCU',
      systemUrl: 'https://rymcu.com',
      slogan: 'RYMCU · 嵌入式知识学习交流平台 ',
      slogan_en: 'Embedded knowledge learning exchange platform',
      beiAn: '赣ICP备2021003088号-1',
      wangBeiUrl: 'http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=36012302000055',
      wangBei: '赣公网安备 36012302000055号',
      wangBeiImage: wangBeiImage
    }
  }
}
</script>

<style scoped>
.footer {
  font-size: 14px;
  align-items: center;
  display: flex;
}
</style>
