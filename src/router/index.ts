import AiPanel from '@/components/ai/AiPanel.vue';
import LoginCard from '@/components/auth/LoginCard.vue';
import RegisterCard from '@/components/auth/RegisterCard.vue';
import BirthdayProblem from '@/components/experiment/chapter1/birthday-problem/BirthdayProblem.vue';
import BirthdayAttack from '@/components/experiment/chapter1/BirthdayAttack.vue';
import BuffonNeedle from '@/components/experiment/chapter1/BuffonNeedle.vue';
import PositiveTest from '@/components/experiment/chapter1/PositiveTest.vue';
import ThreeDoors from '@/components/experiment/chapter1/three-doors/ThreeDoors.vue';
import GeometricDistribution from '@/components/experiment/distribution/GeometricDistribution.vue';
import NormalDistribution from '@/components/experiment/distribution/NormalDistribution.vue';
import PoissonDistribution from '@/components/experiment/distribution/PoissonDistribution.vue';
import UniformDistribution from '@/components/experiment/distribution/UniformDistribution.vue';
import HomePage from '@/components/home/HomePage.vue';
import StarPanel from '@/components/star/StarPanel.vue';
import UserPanel from '@/components/user/UserPanel.vue';
import AuthPage from '@/pages/AuthPage.vue';
import DashBoard from '@/pages/DashBoard.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: AuthPage,
      children: [
        {
          path: '/login',
          component: LoginCard,
        },
        {
          path: '/register',
          component: RegisterCard,
        },
      ],
    },
    {
      path: '/dashboard',
      redirect: '/dashboard/home',
      component: DashBoard,
      children: [
        {
          path: '/dashboard/home',
          component: HomePage,
        },
        {
          path: '/dashboard/experiment/chapter1/buffon',
          component: BuffonNeedle,
        },
        {
          path: '/dashboard/experiment/chapter1/three-doors',
          component: ThreeDoors,
        },
        {
          path: '/dashboard/experiment/chapter1/positive-test',
          component: PositiveTest,
        },
        {
          path: '/dashboard/experiment/chapter1/birthday-attack',
          component: BirthdayAttack,
        },
        {
          path: '/dashboard/experiment/chapter1/birthday-problem',
          component: BirthdayProblem,
        },
        {
          path: '/dashboard/experiment/normalDistribution',
          component: NormalDistribution,
        },
        {
          path: '/dashboard/experiment/binomialDistribution',
          component: () => import('@/components/experiment/distribution/BinomialDistribution.vue'),
        },
        {
          path: '/dashboard/experiment/poissonDistribution',
          component: PoissonDistribution,
        },
        {
          path: '/dashboard/experiment/geometricDistribution',
          component: GeometricDistribution,
        },
        {
          path: '/dashboard/experiment/evenDistribution',
          component: UniformDistribution,
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
        {
          path: '/dashboard/info',
          component: UserPanel,
        },
        {
          path: '/dashboard/ai',
          component: AiPanel,
        },
        {
          path: '/dashboard/star',
          component: StarPanel,
        },
      ],
    },
    // {
    //   path: '/terms',
    //   component: () => import('@/pages/TermsPage.vue')
    // },
    // {
    //   path: '/privacy',
    //   component: () => import('@/pages/PrivacyPage.vue')
    // },
  ],
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.path === '/') {
    if (token) {
      next('/dashboard');
    }
    else {
      next('/login');
    }
    return;
  }
  // if (to.path === '/login' || to.path === '/register') {
  //   if (token) {
  //     next('/dashboard');
  //   }
  //   else {
  //     next();
  //   }
  //   return;
  // }
  if (to.path === '/dashboard') {
    if (token) {
      next();
    }
    else {
      next('/login');
    }
  }
  next();
});

export default router;
