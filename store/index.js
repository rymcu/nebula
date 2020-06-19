export const state = () => ({
  locale: 'zh_CN',
  version: '1.0.0',
  isInit: false,
  isLogin: false,
  token: '',
  nickname: '',
  idUser: '',
  blogTitle: '',
  avatarURL: '',
  blogURL: '/',
  role: 0, // 0-no login, 1-admin, 2-blog admin, 3-blog author, 4-blog user, 5-visitor
  blogs: [{
    title: '',
    id: ''
  }],
  snackMsg: '',
  snackBar: false,
  snackModify: 'error',
  menu: [],
  tagsItems: [],
  bodySide: '',
  login: false,
  activeMenu: 'home',
  activeAdminMenu: 'admin-dashboard',
  activeTopic: '51mcu',
  activeTag: 'news',
  uploadHeaders: '',
  theme: '',
  isMobile: false
})

export const mutations = () => ({
  setLogin(state, data) {
    state.login = data
  },
  setActiveMenu(state, data) {
    state.activeMenu = data
  },
  setActiveAdminMenu(state, data) {
    state.activeAdminMenu = data
  },
  setActiveTopic(state, data) {
    state.activeTopic = data
  },
  setActiveTag(state, data) {
    state.activeTag = data
  },
  setUserInfo(state, data) {
    state.avatarURL = data.avatarUrl;
    state.nickname = data.nickname;
    localStorage.setItem('avatarURL', data.avatarUrl);
    localStorage.setItem('nickname', data.nickname);
  },
  initLogin(state, data) {
    state.isLogin = true;
    state.avatarURL = data.avatarUrl;
    state.nickname = data.nickname;
    state.token = data.token;
    state.account = data.account;
    state.role = data.weights;
    state.idUser = data.idUser;
    localStorage.setItem('isLogin', 'true');
    localStorage.setItem('avatarURL', data.avatarUrl);
    localStorage.setItem('nickname', data.nickname);
    localStorage.setItem('account', data.account);
    localStorage.setItem('idUser', data.idUser);
    localStorage.setItem('x-auth-token', data.token);
    localStorage.setItem('role', data.weights);
  },
  logout(state) {
    state.isLogin = false;
    state.avatarURL = '';
    state.nickname = '';
    state.token = '';
    state.account = '';
    state.role = '';
    state.idUser = '';
    localStorage.removeItem('isLogin');
    localStorage.removeItem('avatarURL');
    localStorage.removeItem('nickname');
    localStorage.removeItem('account');
    localStorage.removeItem('idUser');
    localStorage.removeItem('x-auth-token');
    localStorage.removeItem('role');
  },
  setUploadHeaders(state, data) {
    state.uploadHeaders = data
  }
})

export const actions = () => ({})

export const getters = () => ({
  uploadHeaders(state) {
    return state.uploadHeaders;
  },
  isLogin(state) {
    if (!state.isLogin) {
      state.isLogin = localStorage.getItem('isLogin');   //从localStorage中读取状态
      state.nickname = localStorage.getItem('nickname');
      state.avatarURL = localStorage.getItem('avatarURL') !== 'undefined' ? localStorage.getItem('avatarURL') : "";
      state.token = localStorage.getItem('x-auth-token');
      state.account = localStorage.getItem('account');
      state.idUser = localStorage.getItem('idUser');
      state.role = Number(localStorage.getItem('role'));
    }
    return state.isLogin
  },
  hasPermissions: (state) => (scenes) => {
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
          window.app.$store.commit('logout');
      }
    }
    return hasPermissions;
  },
  isAuthor: (state) => (scenes) => {
    return state.nickname === scenes ? true : false;
  }
})
