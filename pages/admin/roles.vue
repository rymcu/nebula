<template>
  <el-row>
    <el-col style="margin-bottom: 1rem;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col>
      <el-button type="primary" @click="showAddDialog" plain>添加角色</el-button>
      <el-table
        :data="roles"
        style="width: 100%;margin-top: 1rem;">
        <el-table-column
          label="#"
          width="180"
          prop="idRole">
        </el-table-column>
        <el-table-column
          label="角色名"
          width="180"
          prop="name">
        </el-table-column>
        <el-table-column
          label="权重"
          width="180"
          prop="weights">
        </el-table-column>
        <el-table-column
          label="创建时间"
          width="180"
          prop="createdTime">
        </el-table-column>
        <el-table-column
          label="状态"
          width="180"
          prop="status">
          <template slot-scope="scope">
            <el-tag type="primary" disable-transitions>
              {{scope.row.status === '0' ? '正常' : '禁用'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" plain>编辑</el-button>
            <el-button v-if="scope.row.status == 1" size="mini" type="primary"
                       @click="toggleStatus(scope.$index, scope.row)" plain>启用
            </el-button>
            <el-button v-else size="mini" type="danger" @click="toggleStatus(scope.$index, scope.row)" plain>禁用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total">
      </el-pagination>
    </el-col>
    <el-col>
      <el-dialog :title="title" :visible.sync="dialogVisible">
        <el-form v-model="role" label-width="80px">
          <el-form-item label="角色名">
            <el-input v-model="role.name"></el-input>
          </el-form-item>
          <el-form-item label="拼音码">
            <el-input v-model="role.inputCode"></el-input>
          </el-form-item>
          <el-form-item label="权重">
            <el-input-number :min="1" v-model="role.weights"></el-input-number>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" plain>取 消</el-button>
          <el-button type="primary" @click="updateRole" plain>确 定</el-button>
        </div>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script>
  import {mapState} from 'vuex';

  export default {
    name: "roles",
    fetch({store, params, error}) {
      return Promise.all([
        store
          .dispatch('admin/fetchRoles', params)
          .catch(err => error({statusCode: 404}))
      ])
    },
    computed: {
      ...mapState({
        pagination: state => state.admin.role.pagination,
        roles: state => state.admin.role.roles
      })
    },
    data() {
      return {
        order: 'desc',
        role: {},
        title: '',
        dialogVisible: false
      }
    },
    methods: {
      showAddDialog() {
        let _ts = this;
        _ts.$set(_ts, 'dialogVisible', true);
        _ts.$set(_ts, 'title', '添加角色信息');
        _ts.$set(_ts, 'role', {weights: 10});
      },
      handleEdit(index, role) {
        let _ts = this;
        _ts.$set(_ts, 'dialogVisible', true);
        _ts.$set(_ts, 'title', '编辑角色信息');
        _ts.$set(_ts, 'role', roles);
      },
      updateRole() {
        let _ts = this;
        let id = _ts.role.idRole;
        let title = id ? '更新' : '添加';
        _ts.$axios[id ? '$put' : '$post']('/api/admin/role/post', _ts.role).then(function (res) {
          if (res && res.message) {
            _ts.$message.error(res.message);
          } else {
            _ts.$message({
              type: 'success',
              message: title + '成功!'
            });
            _ts.$set(_ts, 'dialogVisible', false);
            _ts.handleCurrentChange(1);
          }
        })
      },
      toggleStatus(index, role) {
        let _ts = this;
        let title, status;
        if (roles.status == 0) {
          title = '禁用';
          status = 1;
        } else {
          title = '启用';
          status = 0;
        }
        _ts.$confirm('确定' + title + '角色 ' + roles.name + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _ts.$axios.$patch('/api/admin/role/update-status', {
            idRole: roles.idRole,
            status: status
          }).then(function (res) {
            if (res && res.message) {
              _ts.$message.error(res.message);
            } else {
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
        _ts.$store.dispatch('admin/fetchRoles', {
          page: _ts.pagination.currentPage,
          rows: pageSize
        })
      },
      handleCurrentChange(page) {
        let _ts = this;
        _ts.$store.dispatch('admin/fetchRoles', {
          page: page,
          rows: _ts.pagination.pageSize
        })
      }
    }
  }
</script>

<style scoped>

</style>
