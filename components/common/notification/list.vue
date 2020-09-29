<template>
  <client-only>
    <el-row>
      <el-col v-for="notification in notifications.notifications" :key="notification.idNotification">
        <el-col v-if="notification.dataType == 0">
          <el-col :xs="16" :sm="20" :xl="20">
            <el-link rel="nofollow" :underline="false" @click="onRouter(notification)" style="font-size: 1.1em;"
                     v-html="notification.dataSummary"></el-link>
            <el-col style="font-size: 12px;color: #7f828b;">{{ notification.createdTime }}</el-col>
          </el-col>
          <el-col :xs="8" :sm="4" :xl="4" class="text-right" style="padding-right: 1rem;">
            <el-link rel="nofollow" v-if="notification.hasRead === '0'" :underline="false" @click="read(notification.idNotification)">
              <i class="el-icon-check"></i> 标记已读
            </el-link>
          </el-col>
        </el-col>
        <el-col v-else-if="notification.dataType == '-1'">
          <el-col :xs="16" :sm="20" :xl="20">
            <el-link rel="nofollow" :underline="false" style="font-size: 1.1em;"
                     v-html="notification.dataSummary"></el-link>
            <el-col style="font-size: 12px;color: #7f828b;">{{ notification.createdTime }}</el-col>
          </el-col>
          <el-col :xs="8" :sm="4" :xl="4" class="text-right" style="padding-right: 1rem;">
            <el-link rel="nofollow" v-if="notification.hasRead === '0'" :underline="false" @click="read(notification.idNotification)">
              <i class="el-icon-check"></i> 标记已读
            </el-link>
          </el-col>
        </el-col>
        <el-col v-else>
          <el-col v-if="notification.author" :xs="4" :xl="2">
            <el-avatar :src="notification.author.userAvatarURL"></el-avatar>
          </el-col>
          <el-col :xs="20" :xl="22">
            <el-col :xs="16" :sm="20" :xl="20">
              <el-link rel="nofollow" :underline="false" @click="onRouter(notification)" style="font-size: 1.1em;"
                       v-html="notification.dataTitle"></el-link>
              <el-col style="font-size: 12px;color: #7f828b;">
                {{ notification.createdTime }}
              </el-col>
              <el-col>
                {{ notification.dataSummary }}
              </el-col>
            </el-col>
            <el-col :xs="8" :sm="4" :xl="4" class="text-right" style="padding-right: 1rem;">
              <el-link rel="nofollow" v-if="notification.hasRead === '0'" :underline="false"
                       @click="read(notification.idNotification)">
                <i class="el-icon-check" style="font-weight: bold;"></i> 标记已读
              </el-link>
            </el-col>
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
        this.$axios.$put('/api/notification/read/' + id).then(function () {
          _ts.currentChange(1);
        }).catch(error => console.log(error));
      },
      onRouter(notification) {
        if (notification.hasRead === '0') {
          this.read(notification.idNotification);
        }
        window.location.href = notification.dataUrl;
      }
    }
  }
</script>

<style scoped>

</style>
