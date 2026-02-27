import { DerivedRecord, MetricSummary } from '../types/biometric';

interface Props {
  data: DerivedRecord[];
  summary: MetricSummary;
}

const trendArrow = (value: number) => (value > 0 ? '▲' : value < 0 ? '▼' : '•');

export const KpiPanels = ({ data, summary }: Props) => {
  const latest = summary.latest;
  const monthly = latest?.monthlyDelta ?? 0;
  const last10 = data.slice(-10).reverse();
  const currentYear = latest?.date.getFullYear();
  const yearData = data.filter((entry) => entry.date.getFullYear() === currentYear);
  const allWeights = data.map((entry) => entry.weight);

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <section className="glass p-4 space-y-3">
        <h3 className="font-semibold">Métricas Primárias</h3>
        <p>Peso atual: <strong>{latest?.weight.toFixed(1) ?? '--'} kg</strong></p>
        <p>Variação 30 dias: <strong>{trendArrow(monthly)} {monthly.toFixed(2)} kg</strong></p>
        <p>IMC médio (10): <strong>{summary.avgBmiLast10.toFixed(2)}</strong></p>
      </section>

      <section className="glass p-4 space-y-3">
        <h3 className="font-semibold">Histórico e Medidas</h3>
        <p>Extremos anuais: {yearData.length ? `${Math.min(...yearData.map((x) => x.weight)).toFixed(1)} / ${Math.max(...yearData.map((x) => x.weight)).toFixed(1)} kg` : '--'}</p>
        <p>All-Time: {allWeights.length ? `${Math.min(...allWeights).toFixed(1)} / ${Math.max(...allWeights).toFixed(1)} kg` : '--'}</p>
        <p>Cintura/quadril: {latest ? `${latest.waist.toFixed(1)} / ${latest.hip.toFixed(1)} cm` : '--'}</p>
        <div>
          <p className="text-sm">Meta anual (visual)</p>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-2 bg-tech" style={{ width: `${Math.min(100, summary.consistencyRate)}%` }} />
          </div>
        </div>
      </section>

      <section className="glass p-4 space-y-3">
        <h3 className="font-semibold">Velocidade e Micro-histórico</h3>
        <p>Ritmo semanal: {summary.weeklyRhythm.toFixed(2)} kg/sem</p>
        <p>Consistência: {summary.consistencyRate.toFixed(1)}%</p>
        <ul className="text-xs space-y-1 max-h-40 overflow-auto pr-1">
          {last10.map((entry) => (
            <li key={entry.dateISO} className="flex justify-between">
              <span>{entry.dateISO}</span>
              <span>{entry.weight.toFixed(1)}kg {entry.dailyDelta ? trendArrow(entry.dailyDelta) : ''}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
