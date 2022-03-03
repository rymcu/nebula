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

export const state = () => {
  return {
    fetching: false,
    user: getDefaultUsersData(),
    role: getDefaultRolesData(),
    article: getDefaultArticlesData(),
    comment: getDefaultCommentsData(),
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
    state.user.users = action.users
    state.user.pagination = action.pagination
  },
  updateRolesData(state, action) {
    state.role.roles = action.roles
    state.role.pagination = action.pagination
  },
  updateArticlesData(state, action) {
    state.article.articles = action.articles
    state.article.pagination = action.pagination
  },
  updateCommentsData(state, action) {
    state.comment.comments = action.comments
    state.comment.pagination = action.pagination
  },
  updateArticlePreference(state, action) {
    let article = state.article.articles[action.index]
    if (article.idArticle === action.idArticle) {
      article.articlePerfect = action.articlePerfect
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
  },
  fetchArticles({commit}, params = {}) {
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
    // 清空已有数据
    commit('updateCommentsData', getDefaultArticlesData())
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
  }
}
