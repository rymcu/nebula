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
    userExtend: {},
    articles: {
      articles: [],
      pagination: {}
    },
    portfolios:  {
      portfolios: [],
      pagination: {}
    },
    followers:  {
      users: [],
      pagination: {}
    },
    followings:  {
      users: [],
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
  updateUserExtendData(state, action) {
    state.userExtend = action
  },
  updateArticleList(state, action) {
    state.articles = action
  },
  updatePortfolioList(state, action) {
    state.portfolios = action
  },
  updateFollowerList(state, action) {
    state.followers = action
  },
  updateFollowingList(state, action) {
    state.followings = action
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
  fetchUserExtend({ commit }, params) {
    commit('updateFetching', true);
    return this.$axios
      .$get(`${USER_API_PATH}/${params.nickname}/user-extend`)
      .then(response => {
        commit('updateUserExtendData', response)
        commit('updateFetching', false)
      })
      .catch(error => {
        commit('updateFetching', false)
      })
  },
  fetchArticleList({commit}, params) {
    commit('updateFetching', true);
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
    commit('updateFetching', true);
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
  },
  fetchFollowerList({commit}, params) {
    commit('updateFetching', true);
    commit('updateFollowerList', {
      users: [],
      pagination: {}
    })
    return this.$axios
      .$get(`${USER_API_PATH}/${params.nickname}/followers`, {
        params: {
          page: params.page
        }
      })
      .then(response => {
        commit('updateFollowerList', response)
        commit('updateFetching', false)
      })
      .catch(error => {
        commit('updateFetching', false)
      })
  },
  fetchFollowingList({commit}, params) {
    commit('updateFetching', true);
    commit('updateFollowingList', {
      users: [],
      pagination: {}
    })
    return this.$axios
      .$get(`${USER_API_PATH}/${params.nickname}/followings`, {
        params: {
          page: params.page
        }
      })
      .then(response => {
        commit('updateFollowingList', response)
        commit('updateFetching', false)
      })
      .catch(error => {
        commit('updateFetching', false)
      })
  }
}
