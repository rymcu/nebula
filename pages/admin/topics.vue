<template>
  <div>
    <el-row style="margin-top: 20px;">
      <el-col style="margin-bottom: 1rem;">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>专题管理</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col style="margin: .5rem;">
        <el-button size="small" @click="createTopic" plain>创建专题</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8" style="margin-bottom: .5rem;" v-for="topic in topics.list" :key="topic.idTopic">
        <el-card shadow="never">
          <div class="card-body d-flex flex-column">
            <el-row :gutter="20">
              <el-col :span="5" style="text-align: right;">
                <img :src="topic.topicIconPath" :alt="topic.topicTitle"
                   style="display: block;width:60px;height: 60px"  class="topic-brand-img">
              </el-col>
              <el-col :span="18">
                <el-link rel="nofollow" @click="onRouter('admin-topic-detail',topic.topicUri)" :underline="false">
              <span style="font-size: 18px;font-weight: bold"> {{ topic.topicTitle }}</span>
            </el-link>
            <div class="text-muted article-summary-md text-content">{{ topic.topicDescription }}</div>
          </el-col>
        </el-row>
      </div>
    </el-card>

  </el-col>
</el-row>
  </div>
</template>

<script>
import {mapState} from 'vuex';

export default {
  name: "topics",
  middleware: 'auth',
  fetch() {
    let {store, params, error} = this.$nuxt.context
    return Promise.all([
      store
        .dispatch('topic/fetchList', params)
        .catch(err => error({statusCode: 404}))
    ])
  },
  computed: {
    ...mapState({
      topics: state => state.topic.list.data
    })
  },
  methods: {
    onRouter(item, data) {
      this.$router.push({
        path: '/admin/topic/' + data
      })
    },
    createTopic() {
      let _ts = this;
      _ts.$router.push({
        path: '/admin/topic/post'
      })
    }
  }
}
</script>

<style scoped>
.topic-brand-img {
  /*margin-top: 40%;*/
}

.text-content {
  height: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
</style>
