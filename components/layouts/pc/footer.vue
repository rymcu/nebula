<template>
  <el-row class="footer">
    <el-col>
      <el-col style="text-align: right;margin-bottom: 0.5rem;">
        <el-col>
          <span>{{ slogan }}</span>
          <span>{{ slogan_en }}</span>
        </el-col>
      </el-col>
      <el-col :span="12" style="text-align: left;">
        <el-link class="footer-link" rel="nofollow" :underline="false" href="/guides/markdown" style="vertical-align: baseline;"><span>Markdown 教程</span></el-link>
        <el-link class="footer-link" rel="nofollow" :underline="false" href="/article/20" style="vertical-align: baseline;"><span>社区规章</span></el-link>
        <el-link class="footer-link" rel="nofollow" :underline="false" href="mailto:support@rymcu.com" style="vertical-align: baseline;"><span>意见反馈</span></el-link>
        <el-link class="footer-link" rel="nofollow" :underline="false" href="/article/115" style="vertical-align: baseline;"><span>关于我们</span></el-link>
      </el-col>
      <el-col :span="12" style="text-align: right;">
        <el-col>
          <el-col class="row align-items-center">
            <el-col class="col-auto">
              Copyright © 2020
              <el-link rel="nofollow" :underline="false" href="/" style="vertical-align: baseline;"><span>{{ systemName }}</span>
              </el-link>
              .
              <el-link rel="nofollow" :underline="false" href="http://www.beian.miit.gov.cn/" style="vertical-align: baseline;"><span>{{ beiAn }}</span>
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
        slogan: 'rymcu · 嵌入式知识学习交流平台 ',
        slogan_en: 'Embedded knowledge learning exchange platform',
        beiAn: '沪ICP备19042611号'
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
