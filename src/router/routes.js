import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const Home = () => import('../views/Home');
const Route = () => import('../views/Route');
// const Error = () => import('../views/Error');

const routes = [


    {
        path: '/',
        name: 'Home',
        alias: ['/order', '/order/:slug', '/user-order', '/user-order/:slug'],
        component: Home,
        children: [
            {
                path: '/route/:code',
                name: 'Route',
                component: Route
            },
        ]
    },

    // {
    //     path: '/order',
    //     name: 'Order',
    //     component: Home,
    //     children: [
    //         {
    //             path: '/order/:slug',
    //             name: 'OrderItem',
    //             component: Home
    //         },
    //     ]
    // },
    // {
    //     path: "/*",
    //     name: "error",
    //     component: Error
    // },
];

export default routes;