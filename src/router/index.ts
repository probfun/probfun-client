import { createRouter, createWebHistory } from 'vue-router';
import AiPanel from '@/components/ai/AiPanel.vue';
import AnalysisPanel from '@/components/analysis/AnalysisPanel.vue';
import Callback from '@/components/auth/Callback.vue';
import ClassAnalysisPanel from '@/components/class/ClassAnalysisPanel.vue';
import DashBoard from '@/components/dashboard/DashBoard.vue';
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
import WeekThinkingPanel from '@/components/week-thinking/WeekThinkingPanel.vue';
import AuthPage from '@/pages/AuthPage.vue';
import MainPage from '@/pages/MainPage.vue';
import { useUserStore } from '@/store';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: AuthPage,
    },
    {
      path: '/signup',
      component: AuthPage,
    },
    {
      path: '/callback',
      component: Callback,
    },
    {
      path: '/',
      component: MainPage,
      children: [
        {
          path: '',
          component: DashBoard,
        },
        //   probability
        {
          path: '/experiment/buffon',
          component: BuffonNeedle,
        },
        {
          path: '/experiment/three-doors',
          component: ThreeDoors,
        },
        {
          path: '/experiment/positive-test',
          component: PositiveTest,
        },
        {
          path: '/experiment/birthday-attack',
          component: BirthdayAttack,
        },
        {
          path: '/experiment/birthday-problem',
          component: BirthdayProblem,
        },
        {
          path: '/experiment/normal-distribution',
          component: NormalDistribution,
        },
        {
          path: '/experiment/event-relationship',
          component: () => import('@/components/experiment/chapter1/EventRelationship.vue'),
        },
        {
          path: '/experiment/discrete-pmf',
          component: () => import('@/components/experiment/chapter2/DiscretePMF.vue'),
        },
        {
          path: '/experiment/pdf-cdf',
          component: () => import('@/components/experiment/chapter2/PdfCdf.vue'),
        },
        {
          path: '/experiment/binomial-distribution',
          component: () => import('@/components/experiment/distribution/BinomialDistribution.vue'),
        },
        {
          path: '/experiment/poisson-distribution',
          component: PoissonDistribution,
        },
        {
          path: '/experiment/geometric-distribution',
          component: GeometricDistribution,
        },
        {
          path: '/experiment/uniform-distribution',
          component: UniformDistribution,
        },
        {
          path: '/experiment/exponential-distribution',
          component: () => import('@/components/experiment/distribution/ExponentialDistribution.vue'),
        },
        {
          path: '/experiment/binomial-poisson',
          component: () => import('@/components/experiment/distribution/comparison/BP.vue'),
        },
        {
          path: '/experiment/binomial-normal',
          component: () => import('@/components/experiment/distribution/comparison/BN.vue'),
        },
        {
          path: '/experiment/poisson-exponential',
          component: () => import('@/components/experiment/distribution/comparison/PE.vue'),
        },
        {
          path: '/experiment/poisson-normal',
          component: () => import('@/components/experiment/distribution/comparison/PN.vue'),
        },
        {
          path: '/experiment/2d-uniform-distribution',
          component: () => import('@/components/experiment/chapter3/uniform-distribution/threeUniformDistribution.vue'),
        },
        {
          path: '/experiment/2d-normal-distribution',
          component: threeNormalDistribution,
        },
        {
          path: '/experiment/central-limit-theorem',
          component: () => import('@/components/experiment/chapter5/central-limit-theorem/clt.vue'),
        },
        {
          path: '/experiment/expectation-test',
          component: () => import('@/components/experiment/chapter4/ExpectationTest.vue'),
        },
        {
          path: '/experiment/bertrand',
          component: () => import('@/components/experiment/chapter1/bertrand/bertrand.vue'),
        },
        {
          path: '/experiment/distribution-clt',
          component: () => import('@/components/experiment/chapter5/distribution-clt/DistributionClt.vue'),
        },
        // {
        //   path: '/experiment/coin-tossing',
        //   component: () => import('@/components/experiment/chapter7/CoinTossing.vue'),
        // },
        // {
        //   path: '/experiment/black-scholes',
        //   component: () => import('@/components/experiment/chapter7/BlackScholesModel.vue'),
        // },
        // {
        //   path: '/experiment/american-option',
        //   component: () => import('@/components/experiment/chapter7/PricingofAmericanPutOptions.vue'),
        // },
        // {
        //   path: '/experiment/asset-captial',
        //   component: () => import('@/components/experiment/chapter7/AssetCapitalPricing.vue'),
        // },
        // {
        //   path: '/experiment/monte-carlo',
        //   component: () => import('@/components/experiment/chapter7/MonteCarlo.vue'),
        // },
        // {
        //   path: '/experiment/arithmetic-mean',
        //   component: () => import('@/components/experiment/chapter7/ArithmeticMeanAsianOption.vue'),
        // },
        // {
        //   path: '/experiment/obstacle-options',
        //   component: () => import('@/components/experiment/chapter7/ObstacleOptions.vue'),
        // },
        {
          path: '/experiment/t-distribution',
          component: () => import('@/components/experiment/chapter7/new experiment/TDistribution.vue'),
        },
        {
          path: '/experiment/chi-square-distribution',
          component: () => import('@/components/experiment/chapter7/new experiment/ChiSquareDistribution.vue'),
        },
        {
          path: '/experiment/t-distribution-quantile',
          component: () => import('@/components/experiment/chapter7/TDistributionQuantile.vue'),
        },
        {
          path: '/experiment/chi-square-distribution-quantile',
          component: () => import('@/components/experiment/chapter7/ChiSquareDistributionQuantile.vue'),
        },
        {
          path: '/experiment/brownian-motion',
          component: () => import('@/components/experiment/chapter6/Brownian.vue'),
        },
        {
          path: '/experiment/geometric-brownian-motion',
          component: () => import('@/components/experiment/chapter6/GeometricBrownian.vue'),
        },
        {
          path: '/experiment/poisson-process',
          component: () => import('@/components/experiment/chapter6/PoissonProcess.vue'),
        },
        {
          path: '/experiment/vector',
          component: () => import('@/components/experiment/chapter6/Vector.vue'),
        },
        {
          path: '/experiment/group-detection',
          component: () => import('@/components/experiment/chapter4/GroupDetection.vue'),
        },
        {
          path: '/experiment/portfolio',
          component: () => import('@/components/experiment/chapter4/Portfolio.vue'),
        },
        {
          path: '/experiment/NetworkTrafficCharacteristics',
          component: () => import('@/components/experiment/chapter4/NetworkTrafficCharacteristics.vue'),
        },
        {
          path: '/experiment/CoinFliping',
          component: () => import('@/components/experiment/chapter5/CoinFliping.vue'),
        },
        {
          path: '/experiment/EstimationOfPai',
          component: () => import('@/components/experiment/chapter5/EstimationOfPai.vue'),
        },
        //   advanced-math-1
        {
          path: '/experiment/sequence-limit',
          component: () => import('@/components/experiment/calculusA/SequenceLimit.vue'),
        },
        {
          path: '/experiment/function-limit',
          component: () => import('@/components/experiment/calculusA/FunctionLimit.vue'),
        },
        {
          path: '/experiment/derivative-geometry',
          component: () => import('@/components/experiment/calculusA/DerivativeGeometry.vue'),
        },
        {
          path: '/experiment/taylor-expansion',
          component: () => import('@/components/experiment/calculusA/TaylorExpansion.vue'),
        },
        {
          path: '/experiment/integrability-conditions',
          component: () => import('@/components/experiment/calculusA/IntegrabilityConditions.vue'),
        },
        {
          path: '//experiment/lagrange-mvt',
          component: () => import('@/components/experiment/calculusA/LagrangeMVT.vue'),
        },
        {
          path: '/experiment/gabriel-horn',
          component: () => import('@/components/experiment/calculusA/GabrielHorn.vue'),
        },
        //   advanced-math-2
        {
          path: '/experiment/partial-derivative',
          component: () => import('@/components/experiment/calculusB/PartialDerivative.vue'),
        },
        {
          path: '/experiment/total-derivative',
          component: () => import('@/components/experiment/calculusB/TotalDerivative.vue'),
        },
        {
          path: '/experiment/neighborhood',
          component: () => import('@/components/experiment/calculusB/Neighborhood.vue'),
        },
        {
          path: '/experiment/linear-equation',
          component: () => import('@/components/experiment/linearAlgebra/LinearEquation.vue'),
        },
        {
          path: '/experiment/linear-equation-3',
          component: () => import('@/components/experiment/linearAlgebra/LinearEquation3.vue'),
        },
        {
          path: '/experiment/false-positive',
          component: () => import('@/components/experiment/chapter1/FalsePositive.vue'),
        },
        {
          path: '/experiment/mutually-exclusive-and-independent',
          component: () => import('@/components/experiment/chapter1/MutuallyExclusiveAndIndependent.vue'),
        },
        {
          path: '/experiment/spam-filtering',
          component: () => import('@/components/experiment/chapter1/SpamFiltering.vue'),
        },
        {
          path: '/experiment/height-stats',
          component: () => import('@/components/experiment/chapter2/HeightStats.vue'),
        },
        {
          path: '/experiment/double-integral',
          component: () => import('@/components/experiment/calculusB/DoubleIntegral.vue'),
        },
        {
          path: '/experiment/space-curve',
          component: () => import('@/components/experiment/calculusB/SpaceCurve.vue'),
        },
        {
          path: '/experiment/linear-combination',
          component: () => import('@/components/experiment/linearAlgebra/LinearCombination.vue'),
        },
        {
          path: '/experiment/matrix-eigen',
          component: () => import('@/components/experiment/linearAlgebra/MatrixEigen.vue'),
        },
        {
          path: '/analysis',
          component: AnalysisPanel,
        },
        {
          path: '/ai',
          component: AiPanel,
        },
        {
          path: '/favorite',
          component: FavoritePanel,
        },
        {
          path: '/week-thinking',
          component: WeekThinkingPanel,
        },
        {
          path: '/class-analysis',
          component: ClassAnalysisPanel,
        },
        {
          path: '/mindmap/distribution',
          component: DistributionDiagram,
        },
        {
          path: '/mindmap/chapter-1',
          component: Chatper1Diagram,
        },
        {
          path: '/mindmap/chapter-4',
          component: Chatper4Diagram,
        },
        {
          path: '/question/:chapterId',
          name: 'DoQuestion',
          component: DoQuestionPanel,
        },
        {
          path: '/mindmap/question/:chapterId',
          name: 'QuestionDiagram',
          component: QuestionDiagram,
        },
      ],
    },

    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.path === '/') {
    if (token) {
      next();
    }
    else {
      next('/login');
    }
    return;
  }
  else if (to.path === '/class-analysis') {
    if ((useUserStore().user?.role ?? 0) <= 1) {
      next('/');
    }
    else {
      next();
    }
  }
  next();
});

export default router;
