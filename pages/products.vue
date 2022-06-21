<template>
  <el-row class="product__wrapper">
    <el-col :span="8">
      <el-card :body-style="{ padding: '0px' }">
        <img src="https://static.rymcu.com/article/1648960741563.jpg"
             class="image">
        <div style="padding: 14px;">
          <span>Nebula Pi</span>
          <div class="bottom clearfix">
            <el-button type="text" class="button">立即购买</el-button>
            <el-button type="text" class="button" @click="handleClick">相关内容</el-button>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "products",
  data() {
    return {
      currentDate: new Date().toLocaleString()
    };
  },
  methods: {
    handleClick() {
      this.$router.push({
        path: "/nebula-pi"
      });
    }
  }
}
</script>

<style scoped>

.product__wrapper {
  max-width: 980px;
  margin: 20px auto;
  display: block;
  padding-left: 1rem;
  padding-right: 1rem;
  box-sizing: border-box;
}

.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
  margin-left: 10px;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}
</style>
