<template>
  <el-row style="margin-top: 20px;">
    <el-col style="margin-bottom: 1rem;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/admin/topics' }">专题管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{ topic.topicTitle }}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col v-if="topic.idTopic">
      <el-col :span="2" class="text-right">
        <img :src="topic.topicIconPath" :alt="topic.topicTitle" class="topic-brand-img">
      </el-col>
      <el-col :span="20">
        <el-row :gutter="20">
          <el-col :span="20">
            <span class="topic-title">{{ topic.topicTitle }}</span>
            <span class="text-muted" v-if="topic.topicTagCount">{{ topic.topicTagCount }} 引用</span>
            <span class="text-muted" v-else> <span style="color: #F56C6C;">0</span> 引用</span>
          </el-col>
          <el-col v-if="hasPermissions" :span="4" class="text-right">
            <el-dropdown trigger="click" @command="handleCommand">
              <el-link :underline="false"><i class="el-icon-more"></i></el-link>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="admin-post-topic">管理</el-dropdown-item>
                <el-dropdown-item command="admin-bind-topic-tag">关联标签</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
          <el-col>
            <span v-html="topic.topicDescriptionHtml"></span>
          </el-col>
        </el-row>
      </el-col>
      <el-col v-for="tag in tags.list" :key="tag.idTag">
        <el-card style="margin: .5rem;">
          <el-col :span="1">
            <el-avatar shape="square" :src="tag.tagIconPath" fit="scale-down"></el-avatar>
          </el-col>
          <el-col :span="20">
            <el-col>
              <span class="tag-title">{{ tag.tagTitle }}</span>
            </el-col>
            <el-col>
              <span class="text-muted" v-if="tag.tagArticleCount">{{ tag.tagArticleCount }} 引用</span>
              <span class="text-muted" v-else> <span style="color: #F56C6C;">0</span> 引用</span>
            </el-col>
          </el-col>
          <el-col :span="3" class="text-right">
            <el-button size="small" @click="unbindTopicTag(tag.idTag)" plain>取消关联</el-button>
          </el-col>
          <el-col style="margin-bottom: .8rem">{{ tag.tagDescription }}</el-col>
        </el-card>
      </el-col>
      <el-col>
        <div class="vertical-container text-center">
          <el-pagination :hide-on-single-page="true"
                         layout="prev, pager, next"
                         :current-page="tags.pageNum"
                         :total="tags.total"
                         @current-change="currentChange">
          </el-pagination>
        </div>
      </el-col>
    </el-col>
  </el-row>
</template>

<script>
import {mapState} from 'vuex';

export default {
  name: "adminTopicDetail",
  middleware: 'auth',
  validate({params, store}) {
    if (typeof params.topic_uri === 'undefined') {
      return true;
    }
    return params.topic_uri
  },
  fetch() {
    let {store, params, error} = this.$nuxt.context
    return Promise.all([
      store.dispatch('topic/fetchDetail', params)
        .catch(err => error({statusCode: 404})),
      store.dispatch('topic/fetchTopicTags', {
        topic_uri: params.topic_uri,
        page: 1
      })
    ])
  },
  computed: {
    ...mapState({
      topic: state => state.topic.detail.data,
      tags: state => state.topic.tags.data
    }),
    hasPermissions() {
      return this.$auth.hasScope('admin') || this.$auth.hasScope('blog_admin');
    }
  },
  methods: {
    currentChange(page) {
      let _ts = this;
      _ts.$store.dispatch('topic/fetchTopicTags', {
        page: page,
        topic_uri: _ts.topic.topicUri
      })
    },
    handleCommand(command) {
      console.log(command)
      let _ts = this;
      if ("admin-post-topic" === command) {
        _ts.$router.push({
          path: `/admin/topic/post/${_ts.topic.idTopic}`
        })
      } else {
        _ts.$router.push({
          path: `/admin/topic/bind/${_ts.topic.idTopic}`
        })
      }
    },
    unbindTopicTag(idTag) {
      let _ts = this;
      this.$confirm('确定取消关联吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _ts.$axios.$delete('/api/admin/topic/unbind-topic-tag', {
          data: {
            idTag: idTag,
            idTopic: _ts.topic.idTopic
          }
        }).then(function (res) {
          if (res) {
            const page = _ts.tags.pageNum;
            _ts.$store.dispatch('topic/fetchTopicTags', {
              page: page,
              topic_uri: _ts.topic.topicUri
            });
          }
        })
      }).catch(() => {
      });
    }
  },


}
</script>

<style scoped>

</style>
