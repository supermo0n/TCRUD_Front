import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import jQuery from 'jquery';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'

// bootstrap-vue import
import { BootstrapVue } from 'bootstrap-vue'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

library.add(fas, far, fab);
Vue.component('font-awesome-icon', FontAwesomeIcon)

import VeeValidate from 'vee-validate';
Vue.use(VeeValidate)

Vue.config.productionTip = false

export const EventBus = new Vue()

global.jQuery = jQuery;
let $ = global.jQuery;
window.$ = $;

new Vue({
  router,
  store,
  render: h => h(App),
  VeeValidate
}).$mount('#app')

