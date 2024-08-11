import { createRouter, createWebHistory } from 'vue-router';
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: () => import('@/pages/DashBoard.vue')
    },
    {
      path: '/experiment',
      component: () => import('@/components/experiment/ExperimentBoard.vue'),
      children: [
        {
          path: 'chapter1/buffon',
          component: () => import('@/components/experiment/chapter1/BuffonNeedle.vue'),
        },
        {
          path: 'distribution',
          component: () => import('@/components/experiment/distribution/DistributionBoard.vue'),
        }
      ],
    }
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
