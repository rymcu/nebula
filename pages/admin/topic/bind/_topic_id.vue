<template>
  <el-row style="margin-top: 20px;">
    <el-col>
      <el-col style="margin-bottom: 1rem;">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/admin/topics' }">专题管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/admin/topic/' + topic.topicUri }">{{ topic.topicTitle }}</el-breadcrumb-item>
          <el-breadcrumb-item>关联标签</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col>
        <el-input placeholder="请输入标签名" v-model="tagTitle">
          <el-button @click="getTags()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
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
            <el-button size="small" @click="bindTopicTag(tag.idTag)" plain>关联</el-button>
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
  name: "adminTopicBindTag",
  middleware: 'auth',
  fetch({store, params, error}) {
    let _ts = this;
    return Promise.all([
      store.dispatch('topic/fetchUnBindTags', {
        idTopic: params.topic_id
      })
    ])
  },
  computed: {
    ...mapState({
      topic: state => state.topic.detail.data,
      tags: state => state.topic.tags.data
    })
  },
  data() {
    return {
      tagTitle: ''
    }
  },
  methods: {
    currentChange(page) {
      let _ts = this;
      this.$store.dispatch('topic/fetchUnBindTags', {
        page: page,
        idTopic: _ts.topic.idTopic,
        tagTitle: _ts.tagTitle
      })
    },
    bindTopicTag(idTag) {
      let _ts = this;
      this.$confirm('确定关联吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _ts.$axios.$post('/api/admin/topic/bind-topic-tag', {
          idTag: idTag,
          idTopic: _ts.topic.idTopic
        }).then(function (res) {
          if (res) {
            _ts.currentChange(_ts.tags.pageNum);
          }
        })
      }).catch(() => {
        _ts.currentChange(_ts.tags.pageNum);
      });
    },
    getTags() {
      this.currentChange(this.tags.pageNum);
    }
  },
  mounted() {
    let _ts = this;
    if (!_ts.topic.idTopic) {
      _ts.$axios.$get('/api/admin/topic/detail/' + _ts.$route.params.topic_id).then(function (res) {
        _ts.$store.commit('topic/updateDetailData', res)
      });
    }
  }
}
</script>

<style scoped>

</style>
