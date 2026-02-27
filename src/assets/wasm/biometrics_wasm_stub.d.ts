declare const stub: {
  movingAverage(values: number[], window: number): number[];
  populationStdDev(values: number[]): number;
  linearRegression(values: number[]): { slope: number; intercept: number };
};

export default stub;
