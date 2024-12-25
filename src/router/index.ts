import AiPanel from '@/components/ai/AiPanel.vue';
import LoginCard from '@/components/auth/LoginCard.vue';
import RegisterCard from '@/components/auth/RegisterCard.vue';
import Chatper1Diagram from '@/components/diagram/chapter-1/Chapter1Diagram.vue';
import Chatper4Diagram from '@/components/diagram/chapter-4/Chapter4Diagram.vue';
import DistributionDiagram from '@/components/diagram/distribution-diagram/DistributionDiagram.vue';
import BirthdayProblem from '@/components/experiment/chapter1/birthday-problem/BirthdayProblem.vue';
import BirthdayAttack from '@/components/experiment/chapter1/BirthdayAttack.vue';
import BuffonNeedle from '@/components/experiment/chapter1/buffon-needle/BuffonNeedle.vue';
import PositiveTest from '@/components/experiment/chapter1/PositiveTest.vue';
import ThreeDoors from '@/components/experiment/chapter1/three-doors/ThreeDoors.vue';
import GeometricDistribution from '@/components/experiment/distribution/geometric-distribution/GeometricDistribution.vue';
import NormalDistribution from '@/components/experiment/distribution/normal-distribution/NormalDistribution.vue';
import PoissonDistribution from '@/components/experiment/distribution/poisson-distribution/PoissonDistribution.vue';
import UniformDistribution from '@/components/experiment/distribution/UniformDistribution.vue';
import HomePage from '@/components/home/HomePage.vue';

import StarPanel from '@/components/star/StarPanel.vue';
import StudentPanel from '@/components/user/StudentPanel.vue';
import TeacherPanel from '@/components/user/TeacherPanel.vue';

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
      component: DashBoard,
      children: [
        {
          path: '/dashboard',
          component: HomePage,
        },
        {
          path: '/dashboard/experiment/buffon',
          component: BuffonNeedle,
        },
        {
          path: '/dashboard/experiment/three-doors',
          component: ThreeDoors,
        },
        {
          path: '/dashboard/experiment/positive-test',
          component: PositiveTest,
        },
        {
          path: '/dashboard/experiment/birthday-attack',
          component: BirthdayAttack,
        },
        {
          path: '/dashboard/experiment/birthday-problem',
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
          path: '/dashboard/experiment/uniformDistribution',
          component: UniformDistribution,
        },
        {
          path: '/dashboard/experiment/exponentialDistribution',
          component: () => import('@/components/experiment/distribution/ExponentialDistribution.vue'),
        },
        {
          path: '/dashboard/experiment/binomialPoisson',
          component: () => import('@/components/experiment/distribution/comparison/BP.vue'),
        },
        {
          path: '/dashboard/experiment/binomialNormal',
          component: () => import('@/components/experiment/distribution/comparison/BN.vue'),
        },
        {
          path: '/dashboard/experiment/poissonExponential',
          component: () => import('@/components/experiment/distribution/comparison/PE.vue'),
        },
        {
          path: '/dashboard/experiment/poissonNormal',
          component: () => import('@/components/experiment/distribution/comparison/PN.vue'),
        },
        {
          path: '/dashboard/experiment/2DuniformDistribution',
          component: () => import('@/components/experiment/chapter3/uniform-distribution/UniformDistribution.vue'),
        },
        {
          path: '/dashboard/experiment/2DnormalDistribution',
          component: () => import('@/components/experiment/chapter3/normal-distribution/NormalDistribution.vue'),
        },
        {
          path: '/dashboard/info0',
          component: StudentPanel,
        },
        {
          path: '/dashboard/info1',
          component: TeacherPanel,
        },
        {
          path: '/dashboard/ai',
          component: AiPanel,
        },
        {
          path: '/dashboard/star',
          component: StarPanel,
        },
        {
          path: '/dashboard/mindmap/distribution',
          component: DistributionDiagram,
        },
        {
          path: '/dashboard/mindmap/chapter-1',
          component: Chatper1Diagram,
        },
        {
          path: '/dashboard/mindmap/chapter-4',
          component: Chatper4Diagram,
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
