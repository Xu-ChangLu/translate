import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
		token:'',
		translateHistory:[],
		translateHistory5:[]
	},
    mutations: {
		'M_SET_TOKEN'(state,token){
			state.token = token
		},
		// 'M_SET_TRANSLATE_HISTORY'(state,value){
		// 	state.translateHistory = value;
		// 	uni.setStorageSync('translate-history', value);
			
		// 	this.commit('M_GET_TRANSLATE_HISTORY5')
		// },
		// 'M_GET_TRANSLATE_HISTORY5'(state){
		// 	let value = uni.getStorageSync('translate-history');
		// 	state.translateHistory = value
		// 	let data = []
		// 	if(value.length >=5){
		// 		for (var i = 0; i < 5; i++) {
		// 			data.push(this.resultList[this.resultList.length - i - 1]);
		// 		}
		// 		state.translateHistory5 = data
		// 	}else if(this.resultList.length == 0){
		// 		state.translateHistory5 = [];
		// 	}else if(this.resultList.length <= 5) {
		// 		state.translateHistory5 = data;
		// 	}
		// },
		// 'M_GET_TRANSLATE_HISTORY'(state){
			
			
		// }
	},
    actions: {
		
	}
})
export default store