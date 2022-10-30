<template>
  <div class="wrapper">
    <el-row :gutter="20">
      <el-col :span="8" v-for="user in users.list" :key="user.idUser" style="margin-bottom: 1rem;">
        <el-card shadow="always" :body-style="{textAlign: 'center', paddingBottom: '20'}">
          <el-col :span="24">
            <el-link target="_blank" :href="'/user/' + user.account" class="text-default" :underline="false">
              <el-avatar :src="user.avatarUrl" style="width: 50px;height: 50px;"></el-avatar>
            </el-link>
          </el-col>
          <el-col :span="24">
              <el-link target="_blank" :href="'/user/' + user.account" class="text-default">
                <span style="font-size: 20px;font-weight: bold;" v-html="user.nickname"></span>
              </el-link>
          </el-col>
          <el-col :span="24" style="padding: 1rem 0;">
            <small class="d-block text-muted" v-if="user.signature" v-html="user.signature"></small>
            <small class="d-block text-muted" v-else>还没有介绍自己</small>
          </el-col>
          <el-col :span="24" style="padding: 2rem 0;">
            <template v-if="!(userInfo && userInfo.idUser === user.idUser)">
              <el-button v-if="isFollower(user.idUser)" size="medium" round @click="cancelFollowUser2(user.idUser)">取消关注</el-button>
              <el-button v-else size="medium" round @click="followUser2(user.idUser)">关注</el-button>
            </template>
          </el-col>
        </el-card>
      </el-col>
      <el-col v-show="!users" class="text-center">
        这里什么都没有!
      </el-col>
      <el-col>
        <div class="vertical-container text-center">
          <el-pagination :hide-on-single-page="true"
                         layout="prev, pager, next"
                         :current-page="users.pageNum"
                         :total="users.total"
                         @current-change="currentChange">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {mapState} from 'vuex';
export default {
  name: "UserList",
  computed: {
    ...mapState({
      userInfo: state => state.auth.user
    })
  },
  props: {
    users: Object
  },
  methods: {
    onRouter(data) {
      this.$router.push({
        path: `/user/${data}`
      })
    },
    currentChange(page) {
      this.$emit('currentChange', page);
    },
    followUser2(idUser) {
      this.$emit('followUser', idUser);
    },
    cancelFollowUser2(idUser) {
      this.$emit('cancelFollowUser', idUser);
    },
    isFollower(idUser) {
      return this.$store.getters["follow/isFollower"](idUser)
    }
  }
}
</script>

<style scoped>

</style>
