export type PythonMode = 'pyodide' | 'fastapi';

export interface PythonStrategy {
  mode: PythonMode;
  summary: string;
  tradeoffs: string[];
}

export const pythonStrategies: PythonStrategy[] = [
  {
    mode: 'pyodide',
    summary: 'Execução 100% client-side para privacidade máxima e zero backend.',
    tradeoffs: [
      'Cold start maior (download runtime Python).',
      'Excelente segurança para dados sensíveis locais.',
      'Escalabilidade limitada pelo dispositivo do usuário.'
    ]
  },
  {
    mode: 'fastapi',
    summary: 'Backend local para cargas pesadas, pipelines longos e persistência opcional.',
    tradeoffs: [
      'Exige serviço local ativo.',
      'Melhor throughput para séries muito grandes.',
      'Permite expansão futura com statsmodels/ARIMA/Prophet.'
    ]
  }
];

export const buildPythonPayload = (weights: number[], waists: number[]) => ({
  weights,
  waists,
  operations: [
    'linear_regression',
    'projection_12m',
    'correlation_weight_waist',
    'plateau_detection',
    'z_score',
    'confidence_interval',
    'anova_time',
    'exp_smoothing'
  ]
});
