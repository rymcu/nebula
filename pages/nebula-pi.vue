<template>
  <el-row class="product__wrapper">
    <el-col>
      <el-card :body-style="{ padding: '15px' }">
        <h2>Nebula Pi 主板结构及布局</h2>
        <p>
          <img src="https://static.rymcu.com/article/1640531590844"
               class="image">
        </p>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "nebula-pi"
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

.image {
  width: 100%;
  display: block;
}

</style>
