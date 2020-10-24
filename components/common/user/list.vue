<template>
  <div class="wrapper">
    <el-row>
      <el-col :span="12" v-for="user in users.users" :key="user.idUser" style="margin-bottom: 1rem;">
        <el-col :span="3">
          <el-avatar size="medium" :src="user.avatarUrl"></el-avatar>
        </el-col>
        <el-col :span="21">
          <div>
            <el-link rel="nofollow" @click="onRouter(user.nickname)" :underline="false" class="text-default">
              {{ user.nickname }}
            </el-link>
            <small class="d-block text-muted">{{ user.signature }}</small>
          </div>
        </el-col>
      </el-col>
      <el-col v-show="!users" class="text-center">
        这里什么都没有!
      </el-col>
      <el-col>
        <div class="vertical-container text-center">
          <el-pagination :hide-on-single-page="true" v-model="users.pagination"
                         layout="prev, pager, next"
                         :current-page="users.pagination.currentPage"
                         :total="users.pagination.total"
                         @current-change="currentChange">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "UserList",
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
    }
  }
}
</script>

<style scoped>

</style>
