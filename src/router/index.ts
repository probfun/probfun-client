import { createRouter, createWebHistory } from 'vue-router';
import AiPanel from '@/components/ai/AiPanel.vue';
import Callback from '@/components/auth/Callback.vue';
import CasLoginCard from '@/components/auth/CasLoginCard.vue';
import LoginCard from '@/components/auth/LoginCard.vue';
import RegisterCard from '@/components/auth/RegisterCard.vue';
import Chatper1Diagram from '@/components/diagram/chapter-1/Chapter1Diagram.vue';
import Chatper4Diagram from '@/components/diagram/chapter-4/Chapter4Diagram.vue';
import DistributionDiagram from '@/components/diagram/distribution-diagram/DistributionDiagram.vue';
import QuestionDiagram from '@/components/diagram/question-diagram/QuestionDiagram.vue';
import DoQuestionPanel from '@/components/do-question/DoQuestionPanel.vue';
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
import DashBoard from '@/pages/DashBoard.vue';
import { isVisitor } from '@/utils/auth.ts';

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
      path: '/dashboard',
      component: DashBoard,
      children: [
        {
          path: '/dashboard',
          component: HomePage,
        },
        //   probability
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
          path: '/dashboard/experiment/normal-distribution',
          component: NormalDistribution,
        },
        {
          path: '/dashboard/experiment/binomial-distribution',
          component: () => import('@/components/experiment/distribution/BinomialDistribution.vue'),
        },
        {
          path: '/dashboard/experiment/poisson-distribution',
          component: PoissonDistribution,
        },
        {
          path: '/dashboard/experiment/geometric-distribution',
          component: GeometricDistribution,
        },
        {
          path: '/dashboard/experiment/uniform-distribution',
          component: UniformDistribution,
        },
        {
          path: '/dashboard/experiment/exponential-distribution',
          component: () => import('@/components/experiment/distribution/ExponentialDistribution.vue'),
        },
        {
          path: '/dashboard/experiment/binomial-poisson',
          component: () => import('@/components/experiment/distribution/comparison/BP.vue'),
        },
        {
          path: '/dashboard/experiment/binomial-normal',
          component: () => import('@/components/experiment/distribution/comparison/BN.vue'),
        },
        {
          path: '/dashboard/experiment/poisson-exponential',
          component: () => import('@/components/experiment/distribution/comparison/PE.vue'),
        },
        {
          path: '/dashboard/experiment/poisson-normal',
          component: () => import('@/components/experiment/distribution/comparison/PN.vue'),
        },
        {
          path: '/dashboard/experiment/2d-uniform-distribution',
          component: () => import('@/components/experiment/chapter3/uniform-distribution/threeUniformDistribution.vue'),
        },
        {
          path: '/dashboard/experiment/2d-normal-distribution',
          component: threeNormalDistribution,
        },
        {
          path: '/dashboard/experiment/central-limit-theorem',
          component: () => import('@/components/experiment/chapter5/central-limit-theorem/clt.vue'),
        },
        {
          path: '/dashboard/experiment/expectation-test',
          component: () => import('@/components/experiment/chapter4/ExpectationTest.vue'),
        },
        {
          path: '/dashboard/experiment/bertrand',
          component: () => import('@/components/experiment/chapter1/bertrand/bertrand.vue'),
        },
        {
          path: '/dashboard/experiment/distribution-clt',
          component: () => import('@/components/experiment/chapter5/distribution-clt/DistributionClt.vue'),
        },
        // {
        //   path: '/dashboard/experiment/coin-tossing',
        //   component: () => import('@/components/experiment/chapter7/CoinTossing.vue'),
        // },
        // {
        //   path: '/dashboard/experiment/black-scholes',
        //   component: () => import('@/components/experiment/chapter7/BlackScholesModel.vue'),
        // },
        // {
        //   path: '/dashboard/experiment/american-option',
        //   component: () => import('@/components/experiment/chapter7/PricingofAmericanPutOptions.vue'),
        // },
        // {
        //   path: '/dashboard/experiment/asset-captial',
        //   component: () => import('@/components/experiment/chapter7/AssetCapitalPricing.vue'),
        // },
        // {
        //   path: '/dashboard/experiment/monte-carlo',
        //   component: () => import('@/components/experiment/chapter7/MonteCarlo.vue'),
        // },
        // {
        //   path: '/dashboard/experiment/arithmetic-mean',
        //   component: () => import('@/components/experiment/chapter7/ArithmeticMeanAsianOption.vue'),
        // },
        // {
        //   path: '/dashboard/experiment/obstacle-options',
        //   component: () => import('@/components/experiment/chapter7/ObstacleOptions.vue'),
        // },
        // {
        //   path: '/dashboard/experiment/t-distribution',
        //   component: () => import('@/components/experiment/chapter7/TDistribution.vue'),
        // },
        // {
        //   path: '/dashboard/experiment/chi-square-distribution',
        //   component: () => import('@/components/experiment/chapter7/ChiSquareDistribution.vue'),
        // },
        {
          path: '/dashboard/experiment/t-distribution-quantile',
          component: () => import('@/components/experiment/chapter7/TDistributionQuantile.vue'),
        },
        {
          path: '/dashboard/experiment/chi-square-distribution-quantile',
          component: () => import('@/components/experiment/chapter7/ChiSquareDistributionQuantile.vue'),
        },
        {
          path: '/dashboard/experiment/brownian-motion',
          component: () => import('@/components/experiment/chapter6/Brownian.vue'),
        },
        {
          path: '/dashboard/experiment/geometric-brownian-motion',
          component: () => import('@/components/experiment/chapter6/GeometricBrownian.vue'),
        },
        {
          path: '/dashboard/experiment/poisson-process',
          component: () => import('@/components/experiment/chapter6/PoissonProcess.vue'),
        },
        {
          path: '/dashboard/experiment/vector',
          component: () => import('@/components/experiment/chapter6/Vector.vue'),
        },
        {
          path: '/dashboard/experiment/group-detection',
          component: () => import('@/components/experiment/chapter4/GroupDetection.vue'),
        },
        {
          path: '/dashboard/experiment/portfolio',
          component: () => import('@/components/experiment/chapter4/Portfolio.vue'),
        },
        {
          path: '/dashboard/experiment/NetworkTrafficCharacteristics',
          component: () => import('@/components/experiment/chapter4/NetworkTrafficCharacteristics.vue'),
        },
        {
          path: '/dashboard/experiment/CoinFliping',
          component: () => import('@/components/experiment/chapter5/CoinFliping.vue'),
        },
        {
          path: '/dashboard/experiment/EstimationOfPai',
          component: () => import('@/components/experiment/chapter5/EstimationOfPai.vue'),
        },
        //   advanced-math-1
        {
          path: '/dashboard/experiment/sequence-limit',
          component: () => import('@/components/experiment/calculusA/SequenceLimit.vue'),
        },
        {
          path: '/dashboard/experiment/function-limit',
          component: () => import('@/components/experiment/calculusA/FunctionLimit.vue'),
        },
        {
          path: '/dashboard/experiment/derivative-geometry',
          component: () => import('@/components/experiment/calculusA/DerivativeGeometry.vue'),
        },
        {
          path: '/dashboard/experiment/taylor-expansion',
          component: () => import('@/components/experiment/calculusA/TaylorExpansion.vue'),
        },
        {
          path: '/dashboard/experiment/integrability-conditions',
          component: () => import('@/components/experiment/calculusA/IntegrabilityConditions.vue'),
        },
        {
          path: '/dashboard//experiment/lagrange-mvt',
          component: () => import('@/components/experiment/calculusA/LagrangeMVT.vue'),
        },
        {
          path: '/dashboard/experiment/gabriel-horn',
          component: () => import('@/components/experiment/calculusA/GabrielHorn.vue'),
        },
        //   advanced-math-2
        {
          path: '/dashboard/experiment/partial-derivative',
          component: () => import('@/components/experiment/calculusB/PartialDerivative.vue'),
        },
        {
          path: '/dashboard/experiment/total-derivative',
          component: () => import('@/components/experiment/calculusB/TotalDerivative.vue'),
        },
        {
          path: '/dashboard/experiment/neighborhood',
          component: () => import('@/components/experiment/calculusB/Neighborhood.vue'),
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
          path: '/dashboard/favorite',
          component: FavoritePanel,
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
        {
          path: '/dashboard/question/:chapterId',
          name: 'DoQuestion',
          component: DoQuestionPanel,
        },
        {
          path: '/dashboard/mindmap/question/:chapterId',
          name: 'QuestionDiagram',
          component: QuestionDiagram,
        },
        {
          path: '/:pathMatch(.*)*',
          redirect: '/dashboard',
        },
      ],
    },

  ],
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.path === '/') {
    if (token || isVisitor()) {
      next('/dashboard');
    }
    else {
      next('/login');
    }
    return;
  }
  if (to.path === '/dashboard') {
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
