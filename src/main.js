import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';

import '@/plugins/bootstrap';
import '@/plugins/value-slider';
import '@/plugins/svgicons';
import '@/plugins/vue-axios';
import '@/plugins/smooth-scroll';

import '@/scss/index.scss';

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app');
