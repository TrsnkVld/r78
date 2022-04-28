import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';

axios.defaults.baseURL = '//91.210.171.171/api/v1';

Vue.use(VueAxios, axios);