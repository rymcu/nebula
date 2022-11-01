<template>
  <el-row :gutter="8" style="margin-top: 20px;">
    <el-col style="margin-bottom: 1rem;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>专题管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col style="margin: .5rem;">
      <el-button size="small" @click="createTopic" plain>创建专题</el-button>
    </el-col>
    <el-col :span="8" style="margin-bottom: .5rem;" v-for="topic in topics.list" :key="topic.idTopic">
      <el-card>
        <div class="card-body d-flex flex-column">
          <el-col :span="4" style="text-align: right;">
            <img :src="topic.topicIconPath" :alt="topic.topicTitle" class="topic-brand-img">
          </el-col>
          <el-col :span="20">
            <el-col>
              <el-col>
                <el-link rel="nofollow" @click="onRouter('admin-topic-detail',topic.topicUri)" :underline="false"><h4>{{
                    topic.topicTitle
                  }}</h4>
                </el-link>
              </el-col>
              <el-col>
                <div class="text-muted article-summary-md">{{ topic.topicDescription }}</div>
              </el-col>
            </el-col>
          </el-col>
        </div>
      </el-card>
    </el-col>
  </el-row>
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

</style>
