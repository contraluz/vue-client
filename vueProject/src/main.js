import Vue from 'vue'
import VueRouter from 'vue-router';
import App from './App.vue'
import {routes} from './routes';

import iView from 'iview';
import 'iview/dist/styles/iview.css';    // 使用 CSS

const router = new VueRouter({
	routes:routes, // 可以直接写成routes
	mode:'history' // mode设置成history，那么地址就可以请求http://localhost:8080/user
});

Vue.use(VueRouter);
Vue.use(iView);

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
