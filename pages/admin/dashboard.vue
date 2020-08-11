<template>
  <el-row :gutter="8" class="text-center">
    <el-col :span="4">
      <el-card>
        <el-col class="mt-2rem dashboard-number">{{ dashboard.countUserNum }}</el-col>
        <el-col class="mt-2rem">总用户数</el-col>
      </el-card>
    </el-col>
    <el-col :span="4">
      <el-card>
        <el-col class="mt-2rem dashboard-number">{{ dashboard.newUserNum }}</el-col>
        <el-col class="mt-2rem">新增用户</el-col>
      </el-card>
    </el-col>
    <el-col :span="4">
      <el-card>
        <el-col class="mt-2rem dashboard-number">{{ dashboard.countArticleNum }}</el-col>
        <el-col class="mt-2rem">总文章数</el-col>
      </el-card>
    </el-col>
    <el-col :span="4">
      <el-card>
        <el-col class="mt-2rem dashboard-number">{{ dashboard.newArticleNum }}</el-col>
        <el-col class="mt-2rem">今日文章数</el-col>
      </el-card>
    </el-col>
    <el-col :span="4">
      <el-card>
        <el-col class="mt-2rem dashboard-number">{{ dashboard.countViewNum }}</el-col>
        <el-col class="mt-2rem">总浏览量</el-col>
      </el-card>
    </el-col>
    <el-col :span="4">
      <el-card>
        <el-col class="mt-2rem dashboard-number">{{ dashboard.todayViewNum }}</el-col>
        <el-col class="mt-2rem">今日浏览量</el-col>
      </el-card>
    </el-col>
    <el-col class="mt-2rem">
      <div id="lastThirtyDays" style="width: 100%;height: 500px;"></div>
    </el-col>
    <el-col class="mt-2rem">
      <div id="history" style="width: 100%;height: 500px;"></div>
    </el-col>
  </el-row>
</template>

<script>
  import Vue from 'vue';
  import {mapState} from 'vuex';
  import echarts from 'echarts';

  Vue.prototype.$echarts = echarts;
  export default {
    name: "Dashboard",
    fetch({store, params, error}) {
      return Promise.all([
        store
          .dispatch('dashboard/fetchDashboard', params)
          .catch(err => error({statusCode: 404})),
        store.dispatch("dashboard/fetchLastThirtyDays"),
        store.dispatch("dashboard/fetchHistory")
      ])
    },
    computed: {
      ...mapState({
        dashboard: state => state.dashboard.data,
        lastThirtyDays: state => state.dashboard.lastThirtyDays,
        history: state => state.dashboard.history,
      })
    },
    methods: {
      initLastThirtyDaysCharts(data) {
        let myChart = this.$echarts.init(document.getElementById('lastThirtyDays'));
        // 指定图表的配置项和数据
        let option = {
          title: {
            text: '最近 30 天'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            data: ["文章", "用户", "浏览量"]
          },
          xAxis: {
            type: 'category',
            data: data.dates
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            name: '文章',
            data: data.articles,
            type: 'line',
            smooth: true,
            areaStyle: {}
          },
            {
              name: '用户',
              data: data.users,
              type: 'line',
              smooth: true,
              areaStyle: {}
            },
            {
              name: '浏览量',
              data: data.visits,
              type: 'line',
              smooth: true,
              areaStyle: {}
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      },
      initHistoryCharts(data) {
        let myChart = this.$echarts.init(document.getElementById('history'));
        // 指定图表的配置项和数据
        let option = {
          title: {
            text: '历史'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            data: ["文章", "用户", "浏览量"]
          },
          xAxis: {
            type: 'category',
            data: data.dates
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            name: '文章',
            data: data.articles,
            type: 'line',
            smooth: true,
            areaStyle: {}
          },
            {
              name: '用户',
              data: data.users,
              type: 'line',
              smooth: true,
              areaStyle: {}
            },
            {
              name: '浏览量',
              data: data.visits,
              type: 'line',
              smooth: true,
              areaStyle: {}
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      }
    },
    mounted() {
      this.$store.commit("setActiveMenu", "admin-dashboard");
      this.initLastThirtyDaysCharts(this.lastThirtyDays)
      this.initHistoryCharts(this.history)
    }
  }
</script>

<style scoped>
  .mt-2rem {
    margin: 2rem auto;
  }

  .dashboard-number {
    font-weight: bold;
    font-size: 2em;
  }
</style>
