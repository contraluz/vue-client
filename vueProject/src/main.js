import Vue from 'vue'
import VueRouter from 'vue-router';
import App from './App.vue'
import {routes} from './routes';

import iView from 'iview';
import 'iview/dist/styles/iview.css';    // 使用 CSS

import axios from 'axios';
import VueAxios from 'vue-axios';


const router = new VueRouter({
	routes:routes, // 可以直接写成routes
	mode:'history' // mode设置成history，那么地址就可以请求http://localhost:8080/user
});

Vue.use(VueRouter);
Vue.use(iView);
Vue.use(VueAxios, axios)

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
