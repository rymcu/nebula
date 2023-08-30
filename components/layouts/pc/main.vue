<template>
  <el-container>
    <el-header>
      <header-view v-bind="$attrs" v-on="$listeners"/>
    </el-header>
    <el-main>
      <nuxt/>
    </el-main>
    <el-footer height="5rem">
      <footer-view/>
    </el-footer>
    <div v-if="isPostArticle && isShow" style="position: fixed;bottom: 10vh;right: 3vw;">
      <el-col v-if="isPostArticle" :xs="0" :xl="24">
        <el-popover
          placement="right"
          width="20"
          trigger="hover">
          <el-col>
            <el-image :src="gzh"></el-image>
          </el-col>
          <el-col class="text-center">
            <span>扫码关注公众号</span>
          </el-col>
          <el-button slot="reference" circle><img style="width: 14px;height: 14px;" :src="wx" fit="cover"/>
          </el-button>
        </el-popover>
      </el-col>
      <el-col style="padding-top: 1rem;" :xs="0" :xl="24">
        <el-button circle @click="backTop" icon="el-icon-caret-top"></el-button>
      </el-col>
    </div>
  </el-container>
</template>

<script>
import {mapState} from 'vuex';
import HeaderView from "./header";
import FooterView from "./footer";
import wx from "~/assets/weixin.png";
import gzh from "~/assets/rymcugzh.jpg";

export default {
  name: "PcMain",
  components: {
    HeaderView,
    FooterView
  },
  props: [],

  computed: {
    ...mapState('global', []),
    isPostArticle() {
      if (this.$route.name === 'article-post-article_id') {
        return false;
      }
      return true;
    }
  },
    data() {
      return {
        isShow: false,
        wx: wx,
        gzh: gzh
      }
    },
    methods: {
      backTop() {
        window.scrollTo(0, 0);
      },
      handleScroll() {
        let _ts = this;
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollTop > 100) {
          _ts.$set(_ts, 'isShow', true);
        } else {
          _ts.$set(_ts, 'isShow', false);
        }
      }
    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll, true);
    }
  }
</script>

<style scoped>
  .el-header {
    /*padding-bottom: 1rem;*/
    /*background: #fff;*/
    border-bottom: 1px solid rgba(0, 40, 100, 0.12);
    z-index: 80;
  }

  .el-main {
    padding: 0;
    background-attachment: fixed;
    min-height: 85vh;
    overflow-x: hidden;
  }

  .el-footer {
    position: relative;
    width: 100%;
    padding-top: 1.2rem;
    /*background: #fff;*/
    border-top: 1px solid rgba(0, 40, 100, 0.12);
    z-index: 80;
  }
</style>
