import { createRouter, createWebHistory } from 'vue-router';
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      component: () => import('@/pages/DashBoard.vue'),
      children: [
        {
          path: '/dashboard/experiment/chapter1/buffon',
          component: () => import('@/components/experiment/chapter1/BuffonNeedle.vue'),
        },
        {
          path: '/dashboard/experiment/distribution',
          component: () => import('@/components/experiment/distribution/DistributionBoard.vue'),
        },
        {
          path: '/dashboard/setting',
          component: () => import('@/components/experiment/distribution/DistributionBoard.vue'),
        },
        {
          path: '/dashboard/chat',
          component: () => import('@/components/experiment/distribution/DistributionBoard.vue'),
        },
        {
          path: '/dashboard/favorite',
          component: () => import('@/components/experiment/distribution/DistributionBoard.vue'),
        },
      ],
    },
    {
      path: '/login',
      component: () => import('@/pages/Login.vue')
    },
    {
      path: '/register',
      component: () => import('@/pages/Register.vue')
    },
    // {
    //   path: '/terms',
    //   component: () => import('@/pages/TermsPage.vue')
    // },
    // {
    //   path: '/privacy',
    //   component: () => import('@/pages/PrivacyPage.vue')
    // },
  ]
});

// router.beforeEach((to, from, next) => {
//   const user = localStorage.getItem('user') ?? '{}';
//   const role = JSON.parse(user)?.role ?? 0;
//   // const role = 0;
//   const requiresRoles = to.meta.requiresRole as number[] | undefined;
//
//   if (requiresRoles && !requiresRoles.includes(role)) {
//     next({ path: '/login' });
//   } else {
//     next();
//   }
// });

export default router;
