import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const routes = [

    {
      path: '/apply/:processTemplateId',
      name: 'Apply',
      component: () =>
        import('../views/processMgr/startProcess/apply.vue')
    }
  ];
  
  const router2 = new VueRouter({
    routes,
  });
  
  export default router2;