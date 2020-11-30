<template>
  <el-row class="wrapper">
    <el-col style="margin-bottom: 1rem;">
      <h1>通知</h1>
    </el-col>
    <notification-list :notifications="notifications" @currentChange="currentChangeNotification"></notification-list>
  </el-row>
</template>

<script>
  import NotificationList from '~/components/common/notification/list';
  import {mapState} from 'vuex';

  export default {
    name: "Notification",
    middleware: 'authenticated',
    components: {
      NotificationList
    },
    fetch({store, error}) {
      return Promise.all([
        store
          .dispatch('notification/fetchList')
          .catch(err => error({statusCode: 404}))
      ])
    },
    computed: {
      ...mapState({
        notifications: state => state.notification.list.data,
        user: state => state.oauth
      })
    },
    methods: {
      currentChangeNotification(page) {
        this.$store.dispatch('notification/fetchList', {
          page: page
        })
      }
    },
    mounted() {
      this.$store.commit('setActiveMenu', 'notification');
    }
  }
</script>

<style scoped>

</style>
