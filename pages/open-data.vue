<template>
  <el-row class="article__wrapper">
    <el-col>
      <el-card>
        <div class="card-body d-flex flex-column article">
          <h1>📊 开放数据 Open Data</h1>
          <el-col>
            <p>
              RYMCU 致力于建造一个即严谨又活泼、专业又不失有趣,为数百万人服务的开源嵌入式知识学习交流平台。现在，他也是一个开放创业项目了，就是说关于 RYMCU 的数据都是开放透明的，包括流量等等信息。
            </p>
            <p>
              如果你对 RYMCU 有任何兴趣或想法，都可以扫右侧二维码加我微信交流（请备注：RYMCU）
            </p>
          </el-col>
          <el-col>
            <el-row :gutter="8" class="text-center">
              <el-col :span="6">
                <el-card style="max-height: 210px;">
                  <el-col class="mt-2rem dashboard-number">{{ dashboard.countUserNum }}</el-col>
                  <el-col class="mt-2rem">总用户数</el-col>
                </el-card>
              </el-col>
              <el-col :span="6">
                <el-card style="max-height: 210px;">
                  <el-col class="mt-2rem dashboard-number">{{ dashboard.countArticleNum }}</el-col>
                  <el-col class="mt-2rem">总文章数</el-col>
                </el-card>
              </el-col>
              <el-col :span="6">
                <el-card style="max-height: 210px;">
                  <el-image :src="gzh"></el-image>
                </el-card>
              </el-col>
            </el-row>
          </el-col>
          <el-col class="mt-2rem">
            <div id="lastThirtyDays" style="width: 100%;height: 500px;"></div>
          </el-col>
          <el-col class="mt-2rem">
            <div id="lastThirtyDays2" style="width: 100%;height: 500px;"></div>
          </el-col>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import echarts from 'echarts';
import gzh from "assets/rymcugzh.jpg";

Vue.prototype.$echarts = echarts;
export default {
  name: "openData",
  asyncData({store, params, error}) {
    return Promise.all([
      store
        .dispatch('open-data/fetchLastThirtyDays', params)
        .catch(err => error({ statusCode: 404 })),
      store.dispatch('open-data/fetchDashboard', params)
    ])
  },
  computed: {
    ...mapState({
      dashboard: state => state['open-data'].data,
      lastThirtyDays: state => state['open-data'].lastThirtyDays
    })
  },
  data() {
    return {
      gzh: gzh
    }
  },
  methods: {
    initLastThirtyDaysCharts(data) {
      let myChart = this.$echarts.init(document.getElementById('lastThirtyDays'));
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: '浏览量（根据页面访问次数统计）'
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
          data: ["浏览量"]
        },
        xAxis: {
          type: 'category',
          data: data.dates
        },
        yAxis: {
          type: 'value'
        },
        series: [
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

      let myChart2 = this.$echarts.init(document.getElementById('lastThirtyDays2'));
      // 指定图表的配置项和数据
      let option2 = {
        title: {
          text: '访客数（根据访问 IP 统计）'
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
          data: ["访客数"]
        },
        xAxis: {
          type: 'category',
          data: data.dates
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '访客数',
            data: data.visitIps,
            type: 'line',
            smooth: true,
            areaStyle: {}
          }]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart2.setOption(option2);
    }
  },
  mounted() {
    this.$store.commit("setActiveMenu", "open-data");
    this.initLastThirtyDaysCharts(this.lastThirtyDays)
  }
}
</script>

<style scoped>
.article__wrapper {
  max-width: 980px;
  margin: 20px auto;
  display: block;
  padding-left: 1rem;
  padding-right: 1rem;
  box-sizing: border-box;
}

.mt-2rem {
  margin: 2rem auto;
}

.dashboard-number {
  font-weight: bold;
  font-size: 2em;
}
</style>
