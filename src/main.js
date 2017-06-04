// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

/*import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
*/

import $ from 'jquery'

require.ensure(['vue'], function(){
        var Vue = require('vue');
    }, 'vue'); // 第三个参数设置打包名称