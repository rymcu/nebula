<template>
  <client-only>
    <el-row>
      <el-col v-for="notification in notifications.notifications" :key="notification.idNotification">
        <el-col v-if="notification.dataType == 0">
          <el-col :xs="9" :sm="11" :xl="11">
            <el-link :underline="false" @click="onRouter(notification)" style="font-size: 1.1em;"
                     v-html="notification.dataSummary"></el-link>
            <el-col>{{ notification.createdTime }}</el-col>
          </el-col>
          <el-col :xs="3" :sm="1" :xl="1" class="mr-3">
            <el-link v-if="notification.hasRead === '0'" :underline="false" @click="read(notification.idNotification)">
              <i class="el-icon-check"></i>
            </el-link>
          </el-col>
        </el-col>
        <el-col v-else-if="notification.dataType == 1">
          <el-col :xs="9" :sm="11" :xl="11">
            <el-link :underline="false" style="font-size: 1.1em;" v-html="notification.dataSummary"></el-link>
            <el-col>{{ notification.createdTime }}</el-col>
          </el-col>
          <el-col :xs="3" :sm="1" :xl="1" class="mr-3">
            <el-link v-if="notification.hasRead === '0'" :underline="false" @click="read(notification.idNotification)">
              <i class="el-icon-check"></i>
            </el-link>
          </el-col>
        </el-col>
        <el-col v-else>
          <el-col :xs="20" :sm="20" :xl="20">
            <el-link :underline="false" style="font-size: 1.1em;" v-html="notification.dataSummary"></el-link>
            <el-col>{{ notification.createdTime }}</el-col>
          </el-col>
          <el-col :xs="4" :sm="4" :xl="4" class="text-right" style="padding-right: 1rem;">
            <el-link v-if="notification.hasRead === '0'" :underline="false" @click="read(notification.idNotification)">
              <i class="el-icon-check" style="font-weight: bold;"></i> 标记已读
            </el-link>
          </el-col>
        </el-col>
        <el-col>
          <el-divider></el-divider>
        </el-col>
      </el-col>
      <el-col>
        <div class="vertical-container text-center">
          <el-pagination v-show="notifications.pagination.total > 10" v-model="notifications.pagination"
                         layout="prev, pager, next"
                         :current-page="notifications.pagination.currentPage"
                         :total="notifications.pagination.total"
                         @current-change="currentChange">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
  </client-only>
</template>

<script>
  export default {
    name: "NotificationList",
    props: {
      notifications: {
        type: Object
      }
    },
    methods: {
      currentChange(page) {
        this.$emit('currentChange', page);
      },
      read(id) {
        let _ts = this;
        this.$axios.$put('/api/notification/read/' + id).then(function (res) {
          _ts.currentChange(1);
        }).catch(error => console.log(error));
      },
      onRouter(notification) {
        if ('0' === notification.dataType) {
          if (notification.hasRead === '0') {
            this.read(notification.idNotification);
          }
          this.$router.push({
            path: '/article/' + notification.dataId
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>
