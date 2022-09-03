<template>
  <el-row>
    <el-col>
      <el-select
        style="width: 100%;"
        v-model="articleTags"
        multiple
        filterable
        allow-create
        default-first-option
        remote
        :remote-method="remoteMethod"
        placeholder="请选择文章标签"
        :loading="loading">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-col>
    <el-col style="text-align: center;">
      <el-button type="primary" style="margin-top: 1rem;" @click="saveTags" plain>保存</el-button>
      <el-button style="margin-top: 1rem;" @click="$emit('closeDialog')" plain>取消</el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "tags",
  props: {
    idArticle: {
      type: Number
    },
    tags: {
      type: String,
      default: false
    }
  },
  data() {
    return {
      options: [],
      list: [],
      loading: false,
      articleTags: []
    }
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options = this.list.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options = [];
      }
    },
    getTags() {
      let _ts = this;
      _ts.$axios.$get('/api/tag/tags').then(function (res) {
        if (res) {
          _ts.$set(_ts, 'list', res);
        }
      })
    },
    saveTags() {
      let _ts = this;
      _ts.$axios.$post(`/api/article/update-tags`, {
        idArticle: _ts.idArticle,
        articleTags: _ts.articleTags.join(',')
      }).then(function (res) {
        console.log(res)
        if (res) {
          _ts.$emit('closeDialog');
        } else {
          _ts.$message(res.message)
        }
      })
    }
  },
  mounted() {
    this.getTags();
    this.$set(this, 'articleTags', this.tags.split(','))
  }
}
</script>

<style scoped>

</style>
