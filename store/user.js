/**
 * @file 用户信息状态 / ES module
 * @module store/category
 * @author Ronger <https://github.com/ronger-x>
 */

export const USER_API_PATH = '/api/user'

export const state = () => {
  return {
    fetching: false,
    data: [],
    articles: {
      fetching: false,
      articles: [],
      pagination: {}
    },
    portfolios:  {
      fetching: false,
      portfolios: [],
      pagination: {}
    }
  }
}

export const mutations = {
  updateFetching(state, action) {
    state.fetching = action
  },
  updateDetailData(state, action) {
    state.data = action
  },
  updateArticleList(state, action) {
    state.articles = action
  },
  updatePortfolioList(state, action) {
    state.portfolios = action
  }
}

export const actions = {
  fetchDetail({ commit }, params) {
    commit('updateFetching', true);
    return this.$axios
      .$get(`${USER_API_PATH}/${params.nickname}`)
      .then(response => {
        commit('updateDetailData', response)
        commit('updateFetching', false)
      })
      .catch(error => {
        commit('updateFetching', false)
      })
  },
  fetchArticleList({commit}, params) {
    return this.$axios
      .$get(`${USER_API_PATH}/${params.nickname}/articles`, {
        params: {
          page: params.page
        }
      })
      .then(response => {
        commit('updateArticleList', response)
        commit('updateFetching', false)
      })
      .catch(error => {
        commit('updateFetching', false)
      })
  },
  fetchPortfolioList({commit}, params) {
    return this.$axios
      .$get(`${USER_API_PATH}/${params.nickname}/portfolios`, {
        params: {
          page: params.page
        }
      })
      .then(response => {
        commit('updatePortfolioList', response)
        commit('updateFetching', false)
      })
      .catch(error => {
        commit('updateFetching', false)
      })
  }
}
