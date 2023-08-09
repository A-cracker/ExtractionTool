import './assets/main.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';


import vue3TreeOrg from 'vue3-tree-org';
import "vue3-tree-org/lib/vue3-tree-org.css";

const init = () => {
  createApp(App).use(vue3TreeOrg).use(router).mount('#app');
};

if (process.env.NODE_ENV === 'development') {
  // 本地开发需要等待全局变量初始化
  setTimeout(() => {
    init();
  }, 2000);
} else {
  console.log('初始化app');
  init();
}
