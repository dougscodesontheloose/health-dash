import { motion } from 'framer-motion';
import { DerivedRecord, MetricSummary } from '../types/biometric';

interface Props {
  open: boolean;
  onClose: () => void;
  summary: MetricSummary;
  data: DerivedRecord[];
}

export const ClinicalReportModal = ({ open, onClose, summary, data }: Props) => {
  if (!open) return null;

  const latest = summary.latest;
  const flags = [
    summary.weeklyRhythm < 0 ? 'Ritmo semanal favorece perda de peso.' : null,
    latest && latest.waist < 90 ? 'Cintura em faixa favorável.' : null,
    summary.consistencyRate > 60 ? 'Consistência alta de medições.' : null
  ].filter(Boolean);

  const risks = [
    latest && latest.bmi >= 30 ? 'Risco metabólico aumentado por IMC.' : null,
    summary.weeklyRhythm > 0.3 ? 'Tendência recente de ganho ponderal.' : null,
    data.length > 7 && Math.abs(data.at(-1)!.weight - data.at(-7)!.weight) > 2 ? 'Possível retenção hídrica.' : null
  ].filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 bg-black/65 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-3xl p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Relatório Clínico Local (Rule-based IA)</h2>
        <p className="text-sm text-slate-300 mb-3">Processamento simulado: 1.7s • Fonte: dataset em memória atual.</p>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <section>
            <h3 className="font-medium text-tech mb-2">Flags Positivas</h3>
            <ul className="list-disc pl-6 space-y-1">{flags.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
          <section>
            <h3 className="font-medium text-amber mb-2">Alertas de Risco</h3>
            <ul className="list-disc pl-6 space-y-1">{risks.length ? risks.map((item) => <li key={item}>{item}</li>) : <li>Nenhum alerta relevante.</li>}</ul>
          </section>
        </div>
        <div className="mt-4 text-sm text-slate-200">
          <p>Resumo: sinais de {summary.weeklyRhythm <= 0 ? 'estabilidade/redução' : 'elevação'} ponderal, com desvio padrão {summary.stdDevWeight.toFixed(2)} kg e consistência {summary.consistencyRate.toFixed(1)}%.</p>
        </div>
        <button onClick={onClose} className="mt-5 rounded-lg bg-white/10 px-4 py-2 hover:bg-white/20">Fechar</button>
      </motion.div>
    </div>
  );
};
