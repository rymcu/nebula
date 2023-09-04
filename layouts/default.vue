<template>
  <div>
    <pc-main-view v-if="$device.isDesktop"/>
    <mobile-main-view v-else/>
  </div>
</template>
<script>
import Vue from 'vue';
import PcMainView from '~/components/layouts/pc/main.vue';
import MobileMainView from '~/components/layouts/mobile/main.vue';

export default Vue.extend({
  name: 'App',
  components: {
    PcMainView,
    MobileMainView
  },

  computed: {
    theme() {
      return this.$store.state.global.theme
    }

  }
})
</script>

<style>

body {
  margin: 0;
  display: block;
  overflow-wrap: break-word;
  -webkit-font-smoothing: antialiased;
  background-color: rgb(246, 247, 248);
  overflow-x: hidden;
  font-family: "PingFang SC", sans-serif;


}

a, li {
  text-decoration: none !important;
}

h1 a, h2 a, h3 a, h4 a, h5 a, h6 a, .h1 a, .h2 a, .h3 a, .h4 a, .h5 a, .h6 a {
  color: inherit;
}

h4, .h4 {
  font-size: 1.125rem;
}

h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6 {
  margin-bottom: 0.66em;
  font-family: inherit;
  font-weight: 600;
  line-height: 1.1;
  color: inherit;
}

p {
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
}

.avatar-md {
  width: 2.5rem;
  height: 2.5rem;
  line-height: 2.5rem;
  font-size: 1rem;
}

.avatar {
  width: 2rem;
  height: 2rem;
  line-height: 2rem;
  border-radius: 50%;
  display: inline-block;
  background: #ced4da no-repeat center/cover;
  position: relative;
  text-align: center;
  color: #868e96;
  font-weight: 600;
  vertical-align: bottom;
  font-size: .875rem;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.pt-5, .py-5 {
  padding-top: 1.5rem !important;
}

.text-default {
  color: #495057 !important;
}

.text-muted {
  color: #9aa0ac !important;
}

.d-block {
  display: block !important;
}

.article-summary-md {
  line-height: 1.4em;
  margin: 10px 0;
  min-height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  word-break: break-all;
}

/*.article-summary-md::after {*/
/*  content: "...";*/
/*  font-weight: bold;*/
/*  position: absolute;*/
/*  bottom: 0;*/
/*  right: 0;*/
/*  padding: 0 20px 1px 45px;*/
/*  !*background:url(http://newimg88.b0.upaiyun.com/newimg88/2014/09/ellipsis_bg.png) repeat-y;*!*/
/*}*/

.article-summary-sd {
  position: relative;
  line-height: 1.4em;
  /* 1 times the line-height to show 1 lines */
  height: 1.4em;
  overflow: hidden;
}

.article-summary-sd::after {
  content: "...";
  font-weight: bold;
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 0 20px 1px 45px;
  /*background:url(http://newimg88.b0.upaiyun.com/newimg88/2014/09/ellipsis_bg.png) repeat-y;*/
}

.text-center {
  text-align: center !important;
}

.wrapper {
  max-width: 980px;
  margin: 20px auto;
  display: block;
  padding-left: 1rem;
  padding-right: 1rem;
  box-sizing: border-box;
  float: none;
}

.mr-3, .mx-3 {
  margin-right: 0.75rem !important;
}


.navbar-brand-img {
  height: 2rem;
  line-height: 2rem;
  vertical-align: bottom;
  margin-right: .5rem;
  width: auto;
}

.topic-brand-img {
  height: 4rem;
  line-height: 2rem;
  vertical-align: bottom;
  margin-right: .5rem;
  width: auto;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}

/* 滚动槽 */
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
}

::-webkit-scrollbar-thumb:window-inactive {
  background: rgba(255, 0, 0, 0.4);
}

</style>
