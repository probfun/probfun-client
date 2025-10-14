export interface ChatMessage {
  role: 'user' | 'assistant' | 'system' | 'function';
  content: string;
  name?: string;
}

export interface ChatData {
  type: 'text' | 'tool';
  text?: string;
  tool?: Tool;
}

export interface ChatBlock {
  role: 'user' | 'ai';
  data: ChatData[];
  blockId: string;
}

export interface Chat {
  chatBlocks: ChatBlock[];
  chatId: string;
  chatTitle: string;
  lastChatTime: string;
  conversationId?: string;
}

export interface NormalDistributionArgs {
  mean: number;
  stdDev: number;
}

export interface GeometricDistributionArgs {
  p: number;
  n: number;
}

export interface BinomialDistributionArgs {
  n: number;
  p: number;
}

export interface ExponentialDistributionArgs {
  rate: number;
}

export interface UniformDistributionArgs {
  a: number;
  b: number;
}

export interface TwoDUniformDistributionArgs {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface TwoDNormalDistributionArgs {
  mean1: number;
  stdDev1: number;
  mean2: number;
  stdDev2: number;
  density: number;
  isChart3: boolean;
  fixedX: number;
  fixedY: number;
}

export interface PoissonDistributionArgs {
  lambda: number;
}

export interface ThreeDoorsArgs {
  selectedStrategy: 'never' | 'always' | 'random';
}

export interface DistributionArgs {
  type: 'normal' | 'uniform' | 'geometric' | 'poisson' | 'binomial' | 'exponential' | '2d-uniform' | '2d-normal';
  args: NormalDistributionArgs | GeometricDistributionArgs | BinomialDistributionArgs | ExponentialDistributionArgs | UniformDistributionArgs | PoissonDistributionArgs | TwoDUniformDistributionArgs | TwoDNormalDistributionArgs;
}

export interface BuffonNeedleArgs {
  needleLength: number;
  floorLineSpacing: number;
  needleAmount: number;
}

export interface ToolArgs extends DistributionArgs, BuffonNeedleArgs, ThreeDoorsArgs {}

export interface Tool {
  name: string;
  args: ToolArgs;
}

export enum ReceiveDataType {
  TEXT = 'text',
  CONVERSATION_INFO = 'conversation_info',
  TITLE_GENERATION = 'title_generation',
  THINKING = 'thinking',
  TOOL = 'tool',
  ERROR = 'error',
}

interface BaseReceiveData {
  type: ReceiveDataType;
  content: string;
}

export interface TextReceiveData extends BaseReceiveData {
  type: ReceiveDataType.TEXT;
}

export interface ConversationInfoReceiveData extends BaseReceiveData {
  type: ReceiveDataType.CONVERSATION_INFO;
}

export interface TitleGenerationReceiveData extends BaseReceiveData {
  type: ReceiveDataType.TITLE_GENERATION;
}

export interface ThinkingReceiveData extends BaseReceiveData {
  type: ReceiveDataType.THINKING;
}

export interface ToolReceiveData extends BaseReceiveData {
  type: ReceiveDataType.TOOL;
}

export interface ErrorReceiveData extends BaseReceiveData {
  type: ReceiveDataType.ERROR;
}

export type ReceiveData = TextReceiveData | ConversationInfoReceiveData | TitleGenerationReceiveData | ThinkingReceiveData | ToolReceiveData | ErrorReceiveData;

export interface ReceiveChunk {
  data: ReceiveData;
  done: boolean;
}
