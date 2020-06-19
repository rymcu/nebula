import axios from 'axios'
import VueAxios from 'vue-axios'
import Vue from 'vue'

// eslint-disable-next-line no-unused-vars
export default (ctx) => {
    const customAxios = axios.create({
        baseURL: '/api',
        timeout:'10000',
        withCredentials: true
    });

    customAxios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    customAxios.defaults.headers.common['x-requested-with'] = 'XMLHttpRequest';

    Vue.use(VueAxios, customAxios);

    customAxios.interceptors.request.use((config) => {
        if(config.url){
            let token = localStorage.getItem("x-auth-token");
            if (token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
                if (!(config.url.indexOf('console') > -1)){
                    config.headers.Authorization = `${token}`;
                }
            }
        } else {
          config.url = '/console/heartbeat'
        }

        // clear cache
        // if (config.method === 'get') {
        //   let char = '?'
        //   if (config.url.split('?').length > 1) {
        //     char = '&'
        //   }
        //   config.url += `${char}${(new Date()).getTime()}`
        // }
        return config
    }, function (error) {
        return Promise.reject(error);
    });

    customAxios.interceptors.response.use((response) => {
        let message;
        if (typeof(response.data.data) !== 'undefined') {
            message = response.data.data.message
        } else if (typeof(response.data) !== 'undefined') {
            message = response.data.message
        }
        if (response.data.success) {
            return response.data.data
        } else {
            if(response.data.code === 0){
                window.app.$message(message);
            }else if(response.data.code === 401){
                window.app.$store.commit('logout');
                window.app.$router.push({
                    name: 'login',
                    query: {
                        historyUrl: window.location.href
                    }
                })
            }else if(response.data.code === 402){
                window.app.$store.commit('logout');
                window.app.$router.push({
                    name: 'login',
                    query: {
                        historyUrl: window.location.href
                    }
                })
            }else if(response.data.code === 404){
                window.app.$message('操作失败，请稍后再试......')
            }else if(response.data.code === 500){
                window.app.$message('服务器正在开小差，请稍后再试......')
            }
            return false
        }
    }, (error) => {
        /*console.log(ctx.app.store.state.locale)
        ctx.store.commit('setSnackBar', {
            snackBar: true,
            snackMsg: ctx.app.i18n.t('requestError', ctx.app.store.state.locale)
        })*/
        return Promise.reject(error)
    })

    return customAxios
}
