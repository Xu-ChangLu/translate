import Vue from 'vue'
import App from './App'
import store from './store'
import mixin from './mixin.js'
Vue.prototype.$store = store
Vue.config.productionTip = false
App.mpType = 'app'
import uView from "uview-ui";
Vue.mixin(mixin)
Vue.use(uView);
const app = new Vue({
    ...App,
	store,
})
app.$mount()
