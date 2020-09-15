export const ADMIN_API_PATH = '/api/admin'

const getDefaultUsersData = () => {
  return {
    users: [],
    pagination: {}
  }
}

const getDefaultRolesData = () => {
  return {
    role: [],
    pagination: {}
  }
}

export const state = () => {
  return {
    fetching: false,
    user: getDefaultUsersData(),
    role: getDefaultRolesData()
  }
}

export const mutations = {
  updateFetching(state, action) {
    state.fetching = action
  },
  updateUsersData(state, action) {
    state.user.users = action.users
    state.user.pagination = action.pagination
  },
  updateRolesData(state, action) {
    state.role.roles = action.roles
    state.role.pagination = action.pagination
  }
}

export const actions = {
  fetchUsers({commit}, params = {}) {
    // 清空已有数据
    commit('updateUsersData', getDefaultUsersData())
    commit('updateFetching', true)

    let data = {
      page: params.page || 1,
      rows: params.rows || 10
    }

    return this.$axios
      .$get(`${ADMIN_API_PATH}/users`, {
        params: data
      })
      .then(response => {
        commit('updateFetching', false);
        commit('updateUsersData', response);
      })
      .catch(error => {
        console.log(error);
        commit('updateFetching', false);
      });
  },
  fetchRoles({commit}, params = {}) {
    // 清空已有数据
    commit('updateRolesData', getDefaultRolesData())
    commit('updateFetching', true)

    let data = {
      page: params.page || 1,
      rows: params.rows || 10
    }

    return this.$axios
      .$get(`${ADMIN_API_PATH}/roles`, {
        params: data
      })
      .then(response => {
        commit('updateFetching', false);
        commit('updateRolesData', response);
      })
      .catch(error => {
        console.log(error);
        commit('updateFetching', false);
      });
  }
}
