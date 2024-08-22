import { createRouter, createWebHistory } from 'vue-router';
import DashBoard from "@/pages/DashBoard.vue";
import BuffonNeedle from "@/components/experiment/chapter1/BuffonNeedle.vue";
import DistributionBoard from "@/components/experiment/distribution/DistributionBoard.vue";
import ThreeDoors from "@/components/experiment/chapter1/ThreeDoors.vue";
import BinomialDistribution from '@/components/experiment/distribution/BinomialDistribution.vue';
import PoissonDistribution from '@/components/experiment/distribution/PoissonDistribution.vue';
import GeometricDistribution from '@/components/experiment/distribution/GeometricDistribution.vue';
import GeometricDistribution1 from '@/components/experiment/distribution/GeometricDistribution1.vue';
import EvenDistribution from '@/components/experiment/distribution/UniformDistribution.vue';
import ExponentialDistribution from '@/components/experiment/distribution/ExponentialDistribution.vue';
import Login from "@/pages/Login.vue";
import Register from "@/pages/Register.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      component: DashBoard,
      children: [
        {
          path: '/dashboard/experiment/chapter1/buffon',
          component: () => import('@/components/experiment/chapter1/BuffonNeedle.vue'),
        },
        {
          path: '/dashboard/experiment/chapter1/three-doors',
          component: () => import('@/components/experiment/chapter1/ThreeDoors.vue'),
        },
        {
          path: '/dashboard/experiment/normalDistribution',
          component: () => import('@/components/experiment/distribution/DistributionBoard.vue'),
        },
        {
          path: '/dashboard/experiment/binomialDistribution',
          component: () => import('@/components/experiment/distribution/BinomialDistribution.vue'),
        },
        {
          path: '/dashboard/experiment/poissonDistribution',
          component: () => import('@/components/experiment/distribution/PoissonDistribution.vue'),
        },
        {
          path: '/dashboard/experiment/geometricDistribution',
          component: GeometricDistribution,
        },
        {
          path: '/dashboard/experiment/geometricDistribution1',
          component: GeometricDistribution1,
        },
        {
          path: '/dashboard/experiment/evenDistribution',
          component: () => import('@/components/experiment/distribution/UniformDistribution.vue'),
        },
        {
          path: '/dashboard/experiment/exponentialDistribution',
          component: () => import('@/components/experiment/distribution/ExponentialDistribution.vue'),
        },
        // {
        //   path: '/dashboard/setting',
        //   component: DistributionBoard,
        // },
        // {
        //   path: '/dashboard/chat',
        //   component: DistributionBoard,
        // },
        // {
        //   path: '/dashboard/favorite',
        //   component: DistributionBoard,
        // },
      ],
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/register',
      component: Register
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
