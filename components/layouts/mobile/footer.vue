<template>
    <el-row class="footer">
        <el-col style="text-align: center;">
            <el-col :xs="24" :sm="24" :xl="12">
                <span>{{ slogan }}</span>
                <span>{{ slogan_en }}</span>
            </el-col>
            <el-col :xs="24" :sm="24" :xl="12">
                <el-col class="row align-items-center">
                    <el-col class="col-auto">
                        Copyright © 2020 <el-link :underline="false" href="/" style="vertical-align: baseline;"><span>{{ systemName }}</span></el-link>.
                        <el-link :underline="false" href="http://www.beian.miit.gov.cn/" style="vertical-align: baseline;"><span>{{ beiAn }}</span></el-link>
                    </el-col>
                </el-col>
            </el-col>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "MobileFooter",
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
</style>
