<template>
  <el-row style="margin-top: 20px;">
    <el-col style="margin-bottom: 1rem;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>标签管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col style="margin: .5rem;">
      <el-button size="small" @click="createTag" plain>创建标签</el-button>
      <el-button size="small" @click="cleanUnusedTag" plain>清除未使用标签</el-button>
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
          <el-button size="small" @click="updateTag(tag.idTag)" plain>管理</el-button>
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
  </el-row>
</template>

<script>
  import {mapState} from 'vuex';

  export default {
    name: "tags",
    middleware: 'auth',
    fetch() {
      let {store, params, error} = this.$nuxt.context
      return Promise.all([
        store
          .dispatch('tag/fetchList', params)
          .catch(err => error({statusCode: 404}))
      ])
    },
    computed: {
      ...mapState({
        tags: state => state.tag.list.data
      })
    },
    methods: {
      cleanUnusedTag() {
        let _ts = this;
        _ts.$confirm('确定清除未使用标签吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _ts.$axios.$delete('/api/admin/tag/clean-unused').then(function (res) {
            if (res && res.message){
              _ts.$message.error(res.message);
            } else {
              const p = _ts.tags.pageNum;
              _ts.currentChange(p);
              _ts.$message({
                type: 'success',
                message: '已清理完成!'
              });
            }
          })
        }).catch(() => {
          _ts.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      currentChange(page){
        this.$store.dispatch('tag/fetchList', {
          page: page
        })
      },
      createTag() {
        this.$router.push({
          path: '/admin/tag/post/'
        })
      },
      updateTag(id) {
        this.$router.push({
          path: '/admin/tag/post/' + id
        })
      }
    }
  }
</script>

<style scoped>

</style>
