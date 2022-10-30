<template>
  <el-row style="margin-top: 20px;">
    <el-col style="margin-bottom: 1rem;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col>
      <el-table
        :data="users.list"
        style="width: 100%">
        <el-table-column
          label="#"
          width="40"
          prop="idUser">
        </el-table-column>
        <el-table-column
          label="头像"
          width="60"
          prop="avatarUrl">
          <template slot-scope="scope">
            <el-avatar v-if="scope.row.avatarUrl" size="medium" :src="scope.row.avatarUrl"></el-avatar>
            <el-avatar v-else size="medium" src="https://rymcu.com/article/1578475481946.png"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column
          label="昵称"
          width="140"
          prop="nickname">
          <template slot-scope="scope">
            <el-link type="primary" :href="getUserPath(scope.row.account)" :underline="false">
              {{ scope.row.nickname }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          label="账号"
          width="140"
          prop="account">
        </el-table-column>
        <el-table-column
          label="注册时间"
          width="180"
          prop="createdTime">
        </el-table-column>
        <el-table-column
          label="最后登录时间"
          width="180"
          prop="lastLoginTime">
        </el-table-column>
        <el-table-column
          label="最后在线时间"
          width="180"
          prop="lastOnlineTime">
          <template slot-scope="scope">
            <span v-if="scope.row.onlineStatus === 0">
              {{ scope.row.lastOnlineTime }}
            </span>
            <el-tag v-else type="success" disable-transitions>
              Online now
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          width="180"
          prop="status">
          <template slot-scope="scope">
            <el-tag type="primary" disable-transitions>
              {{ scope.row.status === '0' ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleRole(scope.$index, scope.row)" plain>授权</el-button>
            <el-button v-if="scope.row.status == 1" size="mini" type="primary"
                       @click="toggleStatus(scope.$index, scope.row)" plain>启用
            </el-button>
            <el-button v-else size="mini" type="danger" @click="toggleStatus(scope.$index, scope.row)" plain>禁用
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col>
      <el-pagination
        :hide-on-single-page="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="users.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="users.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="users.total">
      </el-pagination>
    </el-col>
    <el-col>
      <el-dialog :visible.sync="dialogVisible">
        <el-form>
          <el-form-item>
            <el-radio-group v-model="idRole">
              <el-radio v-for="role in roles" :key="role.idRole" border :label="role.idRole">{{ role.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateRole">确 定</el-button>
        </div>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script>
import {mapState} from 'vuex';

export default {
  name: "users",
  middleware: 'auth',
  fetch() {
    let {store, params, error} = this.$nuxt.context
    return Promise.all([
      store
        .dispatch('admin/fetchUsers', params)
        .catch(err => error({statusCode: 404})),
      store.dispatch("admin/fetchRoles")
    ])
  },
  computed: {
    ...mapState({
      users: state => state.admin.users,
      roles: state => state.admin.roles.list
    })
  },
  data() {
    return {
      order: 'desc',
      idRole: 0,
      idUser: 0,
      dialogVisible: false
    }
  },
  methods: {
    onRouter(name, data) {
      this.$router.push({
        path: `/${name}/${data}`
      })
    },
    handleRole(index, user) {
      let _ts = this;
      _ts.$set(_ts, 'idUser', user.idUser);
      _ts.$axios.$get('/api/admin/user/' + user.idUser + '/role')
        .then(function (res) {
          _ts.$set(_ts, 'dialogVisible', true);
          _ts.$set(_ts, 'idRole', res[0].idRole);
        });
    },
    toggleStatus(index, user) {
      let _ts = this;
      let title, status;
      if (user.status === '0') {
        title = '禁用';
        status = 1;
      } else {
        title = '启用';
        status = 0;
      }
      _ts.$confirm('确定' + title + '用户' + user.nickname + '(' + user.account + ')?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _ts.$axios.$patch('/api/admin/user/update-status', {
          idUser: user.idUser,
          status: status
        }).then(function (res) {
          if (res) {
            _ts.$message({
              type: 'success',
              message: title + '成功!'
            });
            _ts.handleCurrentChange(1);
          }
        });
      }).catch(() => {
        _ts.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    handleSizeChange(pageSize) {
      let _ts = this;
      _ts.$store.dispatch('admin/fetchUsers', {
        page: _ts.users.pageNum,
        rows: pageSize
      })
    },
    handleCurrentChange(page) {
      let _ts = this;
      _ts.$store.dispatch('admin/fetchUsers', {
        page: page,
        rows: _ts.users.pageSize
      })
    },
    updateRole() {
      let _ts = this;
      let data = {
        idUser: _ts.idUser,
        idRole: _ts.idRole
      };
      _ts.$axios.$patch('/api/admin/user/update-role', data).then(function (res) {
        if (res) {
          _ts.$message({
            message: '授权成功',
            type: 'success'
          });
          _ts.$set(_ts, 'dialogVisible', false);
          _ts.$set(_ts, 'idUser', 0);
          _ts.$set(_ts, 'idRole', 0);
        }
      })
    },
    getUserPath(nickname) {
      return `/user/${nickname}`
    }
  }
}
</script>

<style scoped>

</style>
