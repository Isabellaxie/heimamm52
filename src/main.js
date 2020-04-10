import Vue from 'vue'
import App from './App.vue'
//导入element-ui插件
import ElementUI from 'element-ui';
// 导入 element-ui样式
import 'element-ui/lib/theme-chalk/index.css';

// 注册element-ui
Vue.use(ElementUI);

Vue.config.productionTip = false

import router from '@/router/router.js'

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
