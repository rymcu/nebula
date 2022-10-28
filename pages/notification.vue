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
    middleware: 'auth',
    components: {
      NotificationList
    },
    fetch() {
      let {store, query, error} = this.$nuxt.context
      return Promise.all([
        store
          .dispatch('notification/fetchList', {page: query.page || 1})
          .catch(err => error({statusCode: 404}))
      ])
    },
    watch: {
      '$route.query': function () {
        this.$store.dispatch('notification/fetchList', {page: this.$route.query.page || 1})
      }
    },
    computed: {
      ...mapState({
        notifications: state => state.notification.list.data,
        user: state => state.auth.user
      })
    },
    methods: {
      currentChangeNotification(page) {
        this.$router.push({
          name: 'notification',
          query: {
            page: page
          }
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
