import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from "./routes";

Vue.use(VueRouter);

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
	scrollBehavior(to, from, savedPosition) {
		// setTimeout(() => {
		// 	if (savedPosition) {
		// 		window.scrollTo(0, savedPosition.y);
		// 		//return savedPosition;
		// 	} else {
		// 		return { x: 0, y: 0 };
		// 	}
		// }, 250);
	}
});

router.beforeEach((to, from, next) => {
	//setTimeout(() => {
	next();
	//}, 1);
});


router.afterEach((to, from) => {


});

export default router;