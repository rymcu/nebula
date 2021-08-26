<template>
  <el-row class="footer">
    <el-col>
      <el-col style="text-align: right;margin-bottom: 0.5rem;">
        <el-col>
          <span>{{ slogan }}</span>
        </el-col>
      </el-col>
      <el-col :span="12" style="text-align: left;">
        <el-link class="footer-link" rel="nofollow" :underline="false" :href="markdownGuide" style="vertical-align: baseline;"><span>Markdown 教程</span></el-link>
        <el-link class="footer-link" rel="nofollow" :underline="false" :href="rules" style="vertical-align: baseline;"><span>社区规章</span></el-link>
        <el-link class="footer-link" rel="nofollow" :underline="false" :href="currencyRule" style="vertical-align: baseline;"><span>货币规则</span></el-link>
        <el-link class="footer-link" rel="nofollow" :underline="false" :href="email" style="vertical-align: baseline;"><span>意见反馈</span></el-link>
        <el-link class="footer-link" rel="nofollow" :underline="false" :href="aboutMe" style="vertical-align: baseline;"><span>关于我们</span></el-link>
        <el-link class="footer-link" rel="nofollow" :underline="false" :href="github" style="vertical-align: baseline;"><span>GitHub</span></el-link>
        <el-link class="footer-link" rel="nofollow" :underline="false" :href="gitee" style="vertical-align: baseline;"><span>Gitee</span></el-link>
      </el-col>
      <el-col :span="12" style="text-align: right;">
        <el-col>
          <el-col class="row align-items-center">
            <el-col class="col-auto">
              Copyright © 2020
              <el-link rel="nofollow" :underline="false" href="/" style="vertical-align: baseline;"><span>{{ systemName }}</span>
              </el-link>
              .
              <el-link rel="nofollow" :underline="false" href="https://beian.miit.gov.cn/" style="vertical-align: baseline;"><span>{{ beiAn }}</span>
              </el-link>
            </el-col>
          </el-col>
        </el-col>
      </el-col>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: "PcFooter",
    data() {
      return {
        systemTitle: '\u7f57\u5409\u7f51\u0020\u002d\u0020\u5185\u5bb9\u5206\u4eab\u751f\u6001\u5e73\u53f0',
        systemName: 'RYMCU',
        systemUrl: 'https://rymcu.com',
        slogan: 'RYMCU · 嵌入式知识学习交流平台 ',
        beiAn: '赣ICP备2021003088号-1',
        markdownGuide: '/guides/markdown',
        rules: '/article/20',
        email: 'mailto:support@rymcu.com',
        aboutMe: '/article/115',
        github: 'https://github.com/rymcu',
        gitee: 'https://gitee.com/rymcu-community',
        currencyRule: '/rules/currency'
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
  .footer .footer-link {
    margin-left: 2rem;
  }
</style>
