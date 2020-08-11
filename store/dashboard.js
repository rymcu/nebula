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
    visits: []
  }
}

export const state = () => {
  return {
    fetching: false,
    data: getDefaultDashboardData(),
    lastThirtyDays: getDefaultLastThirtyDaysData(),
    history: getDefaultLastThirtyDaysData()
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
  }
}

export const actions = {
  fetchDashboard({commit}, params = {}) {
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
  }
}
