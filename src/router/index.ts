import AiPanel from '@/components/ai/AiPanel.vue';
import Callback from '@/components/auth/Callback.vue'
import CasLoginCard from '@/components/auth/CasLoginCard.vue';
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
import threeNormalDistribution from '@/components/experiment/chapter3/normal-distribution/threeNormalDistribution.vue';
import GeometricDistribution from '@/components/experiment/distribution/geometric-distribution/GeometricDistribution.vue';
import NormalDistribution from '@/components/experiment/distribution/normal-distribution/NormalDistribution.vue';
import PoissonDistribution from '@/components/experiment/distribution/poisson-distribution/PoissonDistribution.vue';
import UniformDistribution from '@/components/experiment/distribution/UniformDistribution.vue';

import FavoritePanel from '@/components/favorite/FavoritePanel.vue';
import HomePage from '@/components/home/HomePage.vue';
import StudentPanel from '@/components/user/StudentPanel.vue';

import TeacherPanel from '@/components/user/TeacherPanel.vue';
import AuthPage from '@/pages/AuthPage.vue';
import DashboardProb from '@/pages/DashBoardProb.vue';
import DashboardAdvmath from '@/pages/DashboardAdvmath.vue';
import DashboardLinalg from '@/pages/DashboardLinalg.vue';
import { isVisitor } from '@/utils/auth.ts';
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
          component: CasLoginCard,
        },
        {
          path: '/login-test',
          component: LoginCard,
        },
        {
          path: '/register-test',
          component: RegisterCard,
        },
        {
          path: '/callback',
          component: Callback,
        },
      ],
    },
    {
      path: '/dashboard-prob',
      component: DashboardProb,
      children: [
        {
          path: '/dashboard-prob',
          component: HomePage,
        },
        {
          path: '/dashboard-prob/experiment/buffon',
          component: BuffonNeedle,
        },
        {
          path: '/dashboard-prob/experiment/three-doors',
          component: ThreeDoors,
        },
        {
          path: '/dashboard-prob/experiment/positive-test',
          component: PositiveTest,
        },
        {
          path: '/dashboard-prob/experiment/birthday-attack',
          component: BirthdayAttack,
        },
        {
          path: '/dashboard-prob/experiment/birthday-problem',
          component: BirthdayProblem,
        },
        {
          path: '/dashboard-prob/experiment/normal-distribution',
          component: NormalDistribution,
        },
        {
          path: '/dashboard-prob/experiment/binomial-distribution',
          component: () => import('@/components/experiment/distribution/BinomialDistribution.vue'),
        },
        {
          path: '/dashboard-prob/experiment/poisson-distribution',
          component: PoissonDistribution,
        },
        {
          path: '/dashboard-prob/experiment/geometric-distribution',
          component: GeometricDistribution,
        },
        {
          path: '/dashboard-prob/experiment/uniform-distribution',
          component: UniformDistribution,
        },
        {
          path: '/dashboard-prob/experiment/exponential-distribution',
          component: () => import('@/components/experiment/distribution/ExponentialDistribution.vue'),
        },
        {
          path: '/dashboard-prob/experiment/binomial-poisson',
          component: () => import('@/components/experiment/distribution/comparison/BP.vue'),
        },
        {
          path: '/dashboard-prob/experiment/binomial-normal',
          component: () => import('@/components/experiment/distribution/comparison/BN.vue'),
        },
        {
          path: '/dashboard-prob/experiment/poisson-exponential',
          component: () => import('@/components/experiment/distribution/comparison/PE.vue'),
        },
        {
          path: '/dashboard-prob/experiment/poisson-normal',
          component: () => import('@/components/experiment/distribution/comparison/PN.vue'),
        },
        {
          path: '/dashboard-prob/experiment/2d-uniform-distribution',
          component: () => import('@/components/experiment/chapter3/uniform-distribution/threeUniformDistribution.vue'),
        },
        {
          path: '/dashboard-prob/experiment/2d-normal-distribution',
          component: threeNormalDistribution,
        },
        {
          path: '/dashboard-prob/experiment/central-limit-theorem',
          component: () => import('@/components/experiment/chapter5/central-limit-theorem/clt.vue'),
        },
        {
          path: '/dashboard-prob/experiment/expectation-test',
          component: () => import('@/components/experiment/chapter4/ExpectationTest.vue'),
        },
        {
          path: '/dashboard-prob/experiment/bertrand',
          component: () => import('@/components/experiment/chapter1/bertrand/bertrand.vue'),
        },
        {
          path: '/dashboard-prob/experiment/distribution-clt',
          component: () => import('@/components/experiment/chapter5/distribution-clt/DistributionClt.vue'),
        },
        {
          path: '/dashboard-prob/experiment/coin-tossing',
          component: () => import('@/components/experiment/chapter7/CoinTossing.vue'),
        },
        {
          path: '/dashboard-prob/experiment/black-scholes',
          component: () => import('@/components/experiment/chapter7/BlackScholesModel.vue'),
        },
        {
          path: '/dashboard-prob/experiment/american-option',
          component: () => import('@/components/experiment/chapter7/PricingofAmericanPutOptions.vue'),
        },
        {
          path: '/dashboard-prob/experiment/asset-captial',
          component: () => import('@/components/experiment/chapter7/AssetCapitalPricing.vue'),
        },
        {
          path: '/dashboard-prob/experiment/monte-carlo',
          component: () => import('@/components/experiment/chapter7/MonteCarlo.vue'),
        },
        {
          path: '/dashboard-prob/experiment/arithmetic-mean',
          component: () => import('@/components/experiment/chapter7/ArithmeticMeanAsianOption.vue'),
        },
        {
          path: '/dashboard-prob/experiment/obstacle-options',
          component: () => import('@/components/experiment/chapter7/ObstacleOptions.vue'),
        },
        {
          path: '/dashboard-prob/experiment/brownian-motion',
          component: () => import('@/components/experiment/chapter6/Brownian.vue'),
        },
        {
          path: '/dashboard-prob/experiment/geometric-brownian-motion',
          component: () => import('@/components/experiment/chapter6/GeometricBrownian.vue'),
        },
        {
          path: '/dashboard-prob/experiment/poisson-process',
          component: () => import('@/components/experiment/chapter6/PoissonProcess.vue'),
        },
        {
          path: '/dashboard-prob/experiment/vector',
          component: () => import('@/components/experiment/chapter6/Vector.vue'),
        },
        {
          path: '/dashboard-prob/info0',
          component: StudentPanel,
        },
        {
          path: '/dashboard-prob/info1',
          component: TeacherPanel,
        },
        {
          path: '/dashboard-prob/ai',
          component: AiPanel,
        },
        {
          path: '/dashboard-prob/favorite',
          component: FavoritePanel,
        },
        {
          path: '/dashboard-prob/mindmap/distribution',
          component: DistributionDiagram,
        },
        {
          path: '/dashboard-prob/mindmap/chapter-1',
          component: Chatper1Diagram,
        },
        {
          path: '/dashboard-prob/mindmap/chapter-4',
          component: Chatper4Diagram,
        },
        {
          path: '/:pathMatch(.*)*',
          redirect: '/dashboard-prob',
        },
      ],
    },
    {
      path: '/dashboard-advmath',
      component: DashboardAdvmath,
    },
    {
      path: '/dashboard-linalg',
      component: DashboardLinalg,
    },

  ],
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.path === '/') {
    if (token || isVisitor()) {
      next('/dashboard-prob');
    }
    else {
      next('/login');
    }
    return;
  }
  if (to.path === '/dashboard-prob') {
    if (token || isVisitor()) {
      next();
    }
    else {
      next('/login');
    }
    return;
  }
  next();
});

export default router;
