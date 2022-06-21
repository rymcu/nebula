export const DASHBOARD_API_PATH = '/api/admin/dashboard'

const getDefaultDashboardData = () => {
  return {
    dashboard: {}
  }
}

const getDefaultLastThirtyDaysData = () => {
  return {
    dates: [],
    articles: [],
    users: [],
    visits: [],
    visitIps: []
  }
}

const getDefaultNewUserData = () => {
  return {
    users: [],
    pagination: {}
  }
}

const getDefaultNewBankAccountData = () => {
  return {
    bankAccounts: [],
    pagination: {}
  }
}

const getDefaultNewArticleData = () => {
  return {
    articles: [],
    pagination: {}
  }
}

export const state = () => {
  return {
    fetching: false,
    data: getDefaultDashboardData(),
    lastThirtyDays: getDefaultLastThirtyDaysData(),
    history: getDefaultLastThirtyDaysData(),
    users: getDefaultNewUserData(),
    bankAccounts: getDefaultNewBankAccountData(),
    articles: getDefaultNewArticleData()
  }
}

export const mutations = {
  updateDashboardFetching(state, action) {
    state.fetching = action
  },
  updateDashboardData(state, action) {
    state.data = action
  },
  updateLastThirtyDaysData(state, action) {
    state.lastThirtyDays = action
  },
  updateHistoryData(state, action) {
    state.history = action
  },
  updateNewUsersData(state, action) {
    state.users = action
  },
  updateNewBankAccountsData(state, action) {
    state.bankAccounts = action
  },
  updateNewArticlesData(state, action) {
    state.articles = action
  }
}

export const actions = {
  fetchDashboard({commit}, params = {}) {
    if (params && params.reset === '0') {
      return true;
    }
    // 清空已有数据
    commit('updateDashboardData', getDefaultDashboardData())
    commit('updateDashboardFetching', true)

    return this.$axios
      .$get(`${DASHBOARD_API_PATH}`)
      .then(response => {
        commit('updateDashboardFetching', false);
        commit('updateDashboardData', response);
      })
      .catch(error => {
        console.log(error);
        commit('updateDashboardFetching', false);
      });
  },
  fetchLastThirtyDays({commit}, params = {}) {
    if (params && params.reset === '0') {
      return true;
    }
    // 清空已有数据
    commit('updateLastThirtyDaysData', getDefaultLastThirtyDaysData())
    commit('updateDashboardFetching', true)

    return this.$axios
      .$get(`${DASHBOARD_API_PATH}/last-thirty-days`)
      .then(response => {
        commit('updateDashboardFetching', false);
        commit('updateLastThirtyDaysData', response);
      })
      .catch(error => {
        console.log(error);
        commit('updateDashboardFetching', false);
      });
  },
  fetchHistory({commit}, params = {}) {
    if (params && params.reset === '0') {
      return true;
    }
    // 清空已有数据
    commit('updateHistoryData', getDefaultLastThirtyDaysData())
    commit('updateDashboardFetching', true)

    return this.$axios
      .$get(`${DASHBOARD_API_PATH}/history`)
      .then(response => {
        commit('updateDashboardFetching', false);
        commit('updateHistoryData', response);
      })
      .catch(error => {
        console.log(error);
        commit('updateDashboardFetching', false);
      });
  },
  fetchNewUsers({commit}, params = {}) {
    if (params && params.reset === '0') {
      return true;
    }
    // 清空已有数据
    commit('updateNewUsersData', getDefaultNewUserData())
    commit('updateDashboardFetching', true)

    return this.$axios
      .$get(`${DASHBOARD_API_PATH}/new-users`)
      .then(response => {
        commit('updateDashboardFetching', false);
        commit('updateNewUsersData', response);
      })
      .catch(error => {
        console.log(error);
        commit('updateDashboardFetching', false);
      });
  },
  fetchNewBankAccounts({commit}, params = {}) {
    if (params && params.reset === '0') {
      return true;
    }
    // 清空已有数据
    commit('updateNewBankAccountsData', getDefaultNewBankAccountData())
    commit('updateDashboardFetching', true)

    return this.$axios
      .$get(`${DASHBOARD_API_PATH}/new-bank-accounts`)
      .then(response => {
        commit('updateDashboardFetching', false);
        commit('updateNewBankAccountsData', response);
      })
      .catch(error => {
        console.log(error);
        commit('updateDashboardFetching', false);
      });
  },
  fetchNewArticles({commit}, params = {}) {
    if (params && params.reset === '0') {
      return true;
    }
    // 清空已有数据
    commit('updateNewArticlesData', getDefaultNewBankAccountData())
    commit('updateDashboardFetching', true)

    return this.$axios
      .$get(`${DASHBOARD_API_PATH}/new-articles`)
      .then(response => {
        commit('updateDashboardFetching', false);
        commit('updateNewArticlesData', response);
      })
      .catch(error => {
        console.log(error);
        commit('updateDashboardFetching', false);
      });
  }
}
