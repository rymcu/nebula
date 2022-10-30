/**
 * Created on 2022/3/14 13:54.
 * @author ronger
 * @email ronger-x@outlook.com
 */
export const OPEN_DATA_API_PATH = '/api/open-data'


const getDefaultDashboardData = () => {
  return {
    countUserNum: 0,
    countArticleNum: 0
  }
}

const getDefaultLastThirtyDaysData = () => {
  return {
    dates: [],
    visits: [],
    visitIps: []
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
  }
}

export const actions = {
  fetchDashboard({commit}, params = {}) {
    // 清空已有数据
    commit('updateDashboardData', getDefaultDashboardData())
    commit('updateDashboardFetching', true)

    return this.$axios
      .$get(`${OPEN_DATA_API_PATH}/dashboard`)
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
      .$get(`${OPEN_DATA_API_PATH}/last-thirty-days`)
      .then(response => {
        commit('updateDashboardFetching', false);
        commit('updateLastThirtyDaysData', response);
      })
      .catch(error => {
        console.log(error);
        commit('updateDashboardFetching', false);
      });
  }
}
