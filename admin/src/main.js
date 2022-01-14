import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import http from '../model/axios'
import router from './router'
import './plugins/element.js'
import './style/style.css'

Vue.config.productionTip = false
Vue.prototype.baseurl = 'http://192.168.1.30:3000'
Vue.prototype.$http = http

Vue.mixin({
  computed: {
    uploadUrl(){
      return this.$http.defaults.baseURL +'/upload'
    }
  },
  methods: {
    getAuthHeaders() {
      return {
        Authorization: `Bearer ${localStorage.token || ''}`
      }
    }
  },
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')