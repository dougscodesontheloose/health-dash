# BioMetric v5.9.1 AI

Dashboard biométrico longitudinal client-side com upload de CSV como única fonte de dados.

## Regras críticas
- Cada novo upload substitui 100% o dataset em memória.
- Nenhum histórico anterior é preservado.
- Parsing, validação e métricas são executados client-side.

## Stack
- React + TypeScript + Vite
- TailwindCSS + Framer Motion
- Recharts
- Camada WASM (stub com fallback JS)
- Estratégias Python (Pyodide/FastAPI)

## Estrutura
- `src/utils/csv.ts`: parser robusto de CSV com 9 colunas fixas.
- `src/hooks/useBiometricData.ts`: métricas derivadas (MA7, deltas, consistência, etc.).
- `src/components/*`: dashboard modular.
- `src/analytics/wasmBridge.ts`: integração JS ↔ WASM com fallback.
- `src/engines/pythonEngine.ts`: definição de estratégias analíticas Python.

## Rodar
```bash
npm install
npm run dev
```
