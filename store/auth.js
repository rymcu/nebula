export const state = () => {
  return {
    isLogin: false,
    token: '',
    nickname: '',
    idUser: '',
    avatarURL: '',
    role: 0, // 0-no login, 1-admin, 2-blog admin, 3-blog author, 4-blog user, 5-visitor
    login: false
  }
}

export const mutations = {
  updateUserInfo(state, data) {
    state.isLogin = true;
    state.avatarURL = data.avatarUrl;
    state.nickname = data.nickname;
    state.token = data.token;
    state.account = data.account;
    state.role = data.weights;
    state.idUser = data.idUser;
  }

}
export const actions = {
  setLogin(state, data){
    state.login = data
  },
  setUserInfo(state, data) {
    state.avatarURL = data.avatarUrl;
    state.nickname = data.nickname;
  },
  initLogin({commit}, data = {}){
    commit('updateUserInfo', data)
  },
  logout(state){
    state.isLogin = false;
    state.avatarURL = '';
    state.nickname = '';
    state.token = '';
    state.account = '';
    state.role = '';
    state.idUser = '';
  }
}

export const getters = {
  isLogin(state){
    return state.isLogin
  },
  hasPermissions:(state)=>(scenes)=>{
    let hasPermissions = false;
    if (state.role) {
      switch (scenes) {
        case 'user':
          hasPermissions = state.role < 5;
          break;
        case 'role':
          hasPermissions = state.role < 2;
          break;
        case 'topic':
          hasPermissions = state.role < 3;
          break;
        case 'tag':
          hasPermissions = state.role < 3;
          break;
        case 'admin':
          hasPermissions = state.role < 2;
          break;
        case 'blog_admin':
          hasPermissions = state.role < 3;
          break;
        default:
          hasPermissions = false;
          this.commit('logout');
      }
    }
    return hasPermissions;
  },
  isAuthor: (state)=>(scenes)=> {
    return state.nickname === scenes ? true : false;
  }
}
