export interface JupiterQuoteResponse {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  platformFee: string | null;
  priceImpactPct: string;
  routePlan: JupiterRoutePlan[];
  contextSlot: number;
  timeTaken: number;
}

export interface JupiterRoutePlan {
  swapInfo: JupiterSwapInfo;
  percent: number;
}

export interface JupiterSwapInfo {
  ammKey: string;
  label: string;
  inputMint: string;
  outputMint: string;
}

export interface ComputeBudget {
  microLamports: number;
  estimatedMicroLamports: number;
}

export interface PrioritizationType {
  computeBudget: ComputeBudget;
}

export interface DynamicSlippageReport {
  slippageBps: number;
  otherAmount: number;
  simulatedIncurredSlippageBps: number;
  amplificationRatio: string;
  categoryName: string;
  heuristicMaxSlippageBps: number;
}

export interface JupiterSwapTransactionResponse {
  swapTransaction: string;
  lastValidBlockHeight: number;
  prioritizationFeeLamports: number;
  computeUnitLimit: number;
  prioritizationType: PrioritizationType;
  dynamicSlippageReport: DynamicSlippageReport;
  simulationError: null | string;
}
