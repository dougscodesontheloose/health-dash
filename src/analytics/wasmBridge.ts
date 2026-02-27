export interface StatsModule {
  movingAverage(values: number[], window: number): number[];
  populationStdDev(values: number[]): number;
  linearRegression(values: number[]): { slope: number; intercept: number };
}

class JsStatsFallback implements StatsModule {
  movingAverage(values: number[], window: number): number[] {
    return values.map((_, index) => {
      const start = Math.max(0, index - window + 1);
      const subset = values.slice(start, index + 1);
      return subset.reduce((sum, value) => sum + value, 0) / subset.length;
    });
  }

  populationStdDev(values: number[]): number {
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
    return Math.sqrt(variance);
  }

  linearRegression(values: number[]): { slope: number; intercept: number } {
    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((sum, value) => sum + value, 0);
    const sumXY = values.reduce((sum, value, i) => sum + i * value, 0);
    const sumX2 = values.reduce((sum, _, i) => sum + i * i, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2 || 1);
    const intercept = (sumY - slope * sumX) / n;
    return { slope, intercept };
  }
}

export const loadStatsModule = async (): Promise<{ module: StatsModule; runtime: 'wasm' | 'js' }> => {
  try {
    const wasmModule = await import('../assets/wasm/biometrics_wasm_stub.js');
    return { module: wasmModule.default as StatsModule, runtime: 'wasm' };
  } catch {
    return { module: new JsStatsFallback(), runtime: 'js' };
  }
};
