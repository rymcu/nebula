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

const getDefaultArticlesData = () => {
  return {
    articles: [],
    pagination: {}
  }
}

const getDefaultCommentsData = () => {
  return {
    comments: [],
    pagination: {}
  }
}

const getDefaultProductsData = () => {
  return {
    products: [],
    pagination: {}
  }
}

export const state = () => {
  return {
    fetching: false,
    users: getDefaultUsersData(),
    roles: getDefaultRolesData(),
    articles: getDefaultArticlesData(),
    comments: getDefaultCommentsData(),
    products: getDefaultProductsData(),
    tabs: [
      {
        title: 'Dashboard',
        name: 'admin-dashboard',
        path: '/admin/dashboard',
        icon: 'el-icon-s-data',
        closable: false
      }
    ],
    activeTab: 'admin-dashboard'
  }
}

export const mutations = {
  updateFetching(state, action) {
    state.fetching = action
  },
  updateUsersData(state, action) {
    state.users = action
  },
  updateRolesData(state, action) {
    state.roles = action
  },
  updateArticlesData(state, action) {
    state.articles = action
  },
  updateCommentsData(state, action) {
    state.comments = action
  },
  updateProductsData(state, action) {
    state.products = action
  },
  updateArticlePreference(state, action) {
    let articles = state.articles.list[action.index]
    if (articles.idArticle === action.idArticle) {
      articles.articlePerfect = action.articlePerfect
    }
  },
  updateTags(state, action) {
    state.tabs = action
  },
  pushTags(state, action) {
    let tabs = state.tabs
    tabs.push(action)
  },
  updateActiveTab(state, action) {
    state.activeTab = action
  }
}

export const actions = {
  fetchUsers({commit}, params = {}) {
    if (params && params.reset === '0') {
      return true;
    }
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
    if (params && params.reset === '0') {
      return true;
    }
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
  },
  fetchArticles({commit}, params = {}) {
    if (params && params.reset === '0') {
      return true;
    }
    // 清空已有数据
    commit('updateArticlesData', getDefaultArticlesData())
    commit('updateFetching', true)

    let data = {
      page: params.page || 1,
      rows: params.rows || 10,
      topicUri: 'news'
    }

    return this.$axios
      .$get(`${ADMIN_API_PATH}/articles`, {
        params: data
      })
      .then(response => {
        commit('updateFetching', false);
        commit('updateArticlesData', response);
      })
      .catch(error => {
        console.log(error);
        commit('updateFetching', false);
      });
  },
  fetchComments({commit}, params = {}) {
    if (params && params.reset === '0') {
      return true;
    }
    // 清空已有数据
    commit('updateCommentsData', getDefaultCommentsData())
    commit('updateFetching', true)

    let data = {
      page: params.page || 1,
      rows: params.rows || 10
    }

    return this.$axios
      .$get(`${ADMIN_API_PATH}/comments`, {
        params: data
      })
      .then(response => {
        commit('updateFetching', false);
        commit('updateCommentsData', response);
      })
      .catch(error => {
        console.log(error);
        commit('updateFetching', false);
      });
  },
  fetchProducts({commit}, params = {}) {
    if (params && params.reset === '0') {
      return true;
    }
    // 清空已有数据
    commit('updateProductsData', getDefaultProductsData())
    commit('updateFetching', true)

    let data = {
      page: params.page || 1,
      rows: params.rows || 10
    }

    return this.$axios
      .$get(`${ADMIN_API_PATH}/products`, {
        params: data
      })
      .then(response => {
        commit('updateFetching', false);
        commit('updateProductsData', response);
      })
      .catch(error => {
        console.log(error);
        commit('updateFetching', false);
      });
  }
}
