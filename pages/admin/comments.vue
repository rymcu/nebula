<template>
  <el-row class="article__wrapper" style="margin-top: 20px;">
    <el-col style="margin-bottom: 1rem;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>评论管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col>
      <el-pagination
        :hide-on-single-page="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="comments.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="comments.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="comments.total">
      </el-pagination>
    </el-col>
    <el-col>
      <el-col v-for="comment in comments.list" :key="comment.idComment">
        <el-card style="margin-top: 1rem;padding-bottom: 10px;" :id="'comment-' + comment.idComment">
          <el-col style="margin-bottom: 1rem;">
            <el-link :href="comment.commentSharpUrl">
              <span style="font-weight: bold;font-size: 16px;">{{ comment.articleTitle }}</span>
            </el-link>
          </el-col>
          <el-col :xs="3" :sm="1" :xl="1">
            <el-avatar v-show="comment.commenter.userAvatarURL" :src="comment.commenter.userAvatarURL"></el-avatar>
            <el-avatar v-show="!comment.commenter.userAvatarURL"
                       src="https://static.rymcu.com/article/1578475481946.png"></el-avatar>
          </el-col>
          <el-col :xs="21" :sm="23" :xl="23">
            <el-col style="margin-left: 1rem;">
              <el-col v-show="comment.commentOriginalCommentId">
                <el-col :span="16">
                  <el-link rel="nofollow" @click="onRouter('user', comment.commenter.userAccount)" :underline="false"
                           class="text-default">{{ comment.commenter.userNickname }}
                  </el-link>
                  <small class="text-default" style="margin: 0 0.2rem">回复了</small><span style="font-weight: bold;"> {{comment.commentOriginalAuthorNickname}}</span>
                </el-col>
                <el-col :span="8" class="text-right" style="padding-right: 1rem;">
                  <el-link rel="nofollow" :underline="false" title="查看原评论"
                           @click.native="toggleShowOriginalComment(comment.commentOriginalCommentId)"><i
                    class="el-icon-reading"></i> 查看原评论</el-link>
                </el-col>
              </el-col>
              <el-col v-show="!comment.commentOriginalCommentId">
                <el-col :span="16">
                  <el-link rel="nofollow" @click="onRouter('user', comment.commenter.userAccount)" :underline="false"
                           class="text-default">{{ comment.commenter.userNickname }}
                  </el-link>
                </el-col>
              </el-col>
            </el-col>
            <el-col style="padding: 1rem;">
              <el-col>
                <div class="vditor-reset comment-content" v-html="comment.commentContent"></div>
              </el-col>
            </el-col>
            <el-col :span="16" style="padding-left: 1rem;">
              <el-link rel="nofollow" :underline="false" class="text-default">{{ comment.timeAgo }}</el-link>
            </el-col>
          </el-col>
        </el-card>
        <el-col :id="'original-' + comment.commentOriginalCommentId" style="background-color: #d9d9d9;padding-left: 1.5rem;
            margin-top: 0.3rem;border-radius: 0.5rem;cursor: pointer;display: none;">
          <el-col v-show="comment.commentOriginalCommentId" :span="2">
            <p>
              <span>{{comment.commentOriginalAuthorNickname}} :</span>
            </p>
          </el-col>
          <el-col v-show="comment.commentOriginalCommentId" :span="20">
            <div class="vditor-reset comment-content" v-html="comment.commentOriginalContent"></div>
          </el-col>
        </el-col>
      </el-col>
    </el-col>
    <el-col>
      <el-pagination
        :hide-on-single-page="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="comments.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="comments.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="comments.total">
      </el-pagination>
    </el-col>
  </el-row>
</template>

<script>
import {mapState} from 'vuex';

export default {
  name: "comments",
  middleware: 'auth',
  fetch() {
    let {store, params, error} = this.$nuxt.context
    return Promise.all([
      store
        .dispatch('admin/fetchComments', params)
        .catch(err => error({statusCode: 404}))
    ])
  },
  computed: {
    ...mapState({
      comments: state => state.admin.comments
    })
  },
  data() {
    return {
      order: 'desc',
      idRole: 0,
      idUser: 0,
      dialogVisible: false
    }
  },
  methods: {
    onRouter(name, data) {
      this.$router.push(
        {
          path: '/user/' + data
        }
      )
    },
    toggleShowOriginalComment(commentId) {
      let ele = document.getElementById('original-' + commentId);
      if (ele.style.display === 'none') {
        ele.style.display = 'block';
      } else {
        ele.style.display = 'none';
      }
    },
    handleSizeChange(pageSize) {
      let _ts = this;
      _ts.$store.dispatch('admin/fetchComments', {
        page: _ts.comments.pageNum,
        rows: pageSize
      })
    },
    handleCurrentChange(page) {
      let _ts = this;
      _ts.$store.dispatch('admin/fetchComments', {
        page: page,
        rows: _ts.comments.pageSize
      })
    },
    toggleStatus() {}
  }
}
</script>

<style lang="less">
  @import "~vditor/src/assets/less/index.less";

.article__wrapper {
  margin: 20px auto;
  display: block;
  padding-left: 1rem;
  padding-right: 1rem;
  box-sizing: border-box;
}
</style>
