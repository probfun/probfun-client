import { createRouter, createWebHistory } from 'vue-router';
import DashBoard from "@/pages/DashBoard.vue";
import Login from "@/pages/Login.vue";
import Register from "@/pages/Register.vue";
import UserPanel from "@/components/UserPanel.vue";
import BuffonNeedle from "@/components/experiment/chapter1/BuffonNeedle.vue";
import ThreeDoors from "@/components/experiment/chapter1/ThreeDoors.vue";
import PositiveTest from "@/components/experiment/chapter1/PositiveTest.vue";
import BirthdayAttack from "@/components/experiment/chapter1/BirthdayAttack.vue";
import BirthdayProblem from "@/components/experiment/chapter1/BirthdayProblem.vue";
import NormalDistribution from "@/components/experiment/distribution/NormalDistribution.vue";
import PoissonDistribution from "@/components/experiment/distribution/PoissonDistribution.vue";
import Geometric1 from "@/components/experiment/distribution/Geometric1.vue";
import UniformDistribution from "@/components/experiment/distribution/UniformDistribution.vue";
import ExponentialDistribution from "@/components/experiment/distribution/ExponentialDistribution.vue";

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
          component: BuffonNeedle
        },
        {
          path: '/dashboard/experiment/chapter1/three-doors',
          component: ThreeDoors
        },
        {
          path: '/dashboard/experiment/chapter1/positive-test',
          component: PositiveTest
        },
        {
          path: '/dashboard/experiment/chapter1/birthday-attack',
          component: BirthdayAttack
        },
        {
          path: '/dashboard/experiment/chapter1/birthday-problem',
          component: BirthdayProblem
        },
        {
          path: '/dashboard/experiment/normalDistribution',
          component: NormalDistribution
        },
        {
          path: '/dashboard/experiment/binomialDistribution',
          component: () => import('@/components/experiment/distribution/BinomialDistribution.vue'),
        },
        {
          path: '/dashboard/experiment/poissonDistribution',
          component: () => PoissonDistribution
        },
        {
          path: '/dashboard/experiment/geometricDistribution',
          component: () => import('@/components/experiment/distribution/GeometricDistribution.vue')
        },
        {
          path: '/dashboard/experiment/evenDistribution',
          component: () => UniformDistribution
        },
        {
          path: '/dashboard/experiment/exponentialDistribution',
          component: () => import('@/components/experiment/distribution/ExponentialDistribution.vue'),
        },
        {
          path: '/dashboard/experiment/comparison/binomialPoisson',
          component: () => import('@/components/experiment/distribution/comparison/BP.vue'),
        },
        {
          path: '/dashboard/experiment/comparison/binomialNormal',
          component: () => import('@/components/experiment/distribution/comparison/BN.vue'),
        },
        {
          path: '/dashboard/experiment/comparison/poissonExponential',
          component: () => import('@/components/experiment/distribution/comparison/PE.vue'),
        },
        {
          path: '/dashboard/experiment/comparison/poissonNormal',
          component: () => import('@/components/experiment/distribution/comparison/PN.vue'),
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
