<template>
  <div class="wrapper">

    <div style="background: white">
      <el-menu type="border-card" :default-active="currentTopic"
               style="width: 96%;margin: 0 auto" mode="horizontal"
               @select="handleSelectTopic">
        <el-menu-item index="news">最新</el-menu-item>
        <el-menu-item v-for="topic in topicNavs" :key="topic.idTopic" :index="topic.topicUri">{{ topic.topicTitle }}
        </el-menu-item>
      </el-menu>
    </div>

  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: "topicNav",
  props: {
    currentTopic: {
      type: String,
      default: 'news'
    }
  },
  computed: {
    ...mapState({
      topicNavs: state => state.topic.data,
      isFetching: state => state.topic.fetching
    })
  },
  watch: {},
  methods: {
    handleSelectTopic(item) {
      this.$router.push({
        path: `/topic/${item}?page=1`
      });
    }
  }
}
</script>

<style scoped>

</style>
