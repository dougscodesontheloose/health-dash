import { ChangeEvent, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChartsPanel } from './components/ChartsPanel';
import { ClinicalReportModal } from './components/ClinicalReportModal';
import { KpiPanels } from './components/KpiPanels';
import { pythonStrategies } from './engines/pythonEngine';
import { useBiometricData } from './hooks/useBiometricData';
import { BiometricRecord } from './types/biometric';
import { parseCSV } from './utils/csv';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [records, setRecords] = useState<BiometricRecord[]>([]);
  const [openReport, setOpenReport] = useState(false);

  const { derived, summary, runtime } = useBiometricData(records);

  const trendColor = useMemo(() => (summary.weeklyRhythm <= 0 ? 'text-tech' : 'text-amber'), [summary.weeklyRhythm]);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = parseCSV(text);
      setRecords(parsed); // substituição total do dataset em memória
      setError(null);
    } catch (uploadError) {
      setRecords([]);
      setError(uploadError instanceof Error ? uploadError.message : 'Erro inesperado ao carregar CSV.');
    }
  };

  return (
    <main className={`${darkMode ? 'text-ice' : 'text-slate-900 bg-slate-100'} min-h-screen p-6 space-y-5`}>
      <header className="glass p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">BioMetric v5.9.1 AI</h1>
          <p className={`text-sm ${trendColor}`}>Tendência atual: {summary.weeklyRhythm <= 0 ? 'favorável' : 'atenção'} ({summary.weeklyRhythm.toFixed(2)} kg/sem)</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setDarkMode((value) => !value)} className="rounded-lg px-3 py-2 bg-white/10 hover:bg-white/20">
            {darkMode ? 'Light' : 'Dark'}
          </button>
          <label className="rounded-lg px-3 py-2 bg-tech/20 border border-tech/40 cursor-pointer">
            Upload CSV
            <input type="file" accept=".csv" onChange={handleUpload} className="hidden" />
          </label>
          <button onClick={() => setOpenReport(true)} className="rounded-lg px-3 py-2 bg-amber/20 border border-amber/40">Relatório IA</button>
        </div>
      </header>

      {error && <p className="text-red-300 text-sm">{error}</p>}

      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <KpiPanels data={derived} summary={summary} />
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <ChartsPanel data={derived} />
      </motion.section>

      <section className="glass p-4 text-sm space-y-2">
        <h3 className="font-semibold">Arquitetura WASM + Python Engine</h3>
        <p>WASM runtime ativo: <strong>{runtime.toUpperCase()}</strong>. Recomendação de implementação real: Rust + wasm-bindgen com fallback JS para datasets &lt; 2.000 pontos.</p>
        <p>Estratégias Python embutidas:</p>
        <ul className="list-disc pl-6">
          {pythonStrategies.map((strategy) => (
            <li key={strategy.mode}><strong>{strategy.mode}</strong>: {strategy.summary}</li>
          ))}
        </ul>
      </section>

      <ClinicalReportModal open={openReport} onClose={() => setOpenReport(false)} summary={summary} data={derived} />
    </main>
  );
}

export default App;
