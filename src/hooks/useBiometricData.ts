import { useEffect, useMemo, useState } from 'react';
import { loadStatsModule } from '../analytics/wasmBridge';
import { BiometricRecord, DerivedRecord, MetricSummary } from '../types/biometric';

export const useBiometricData = (records: BiometricRecord[]) => {
  const [runtime, setRuntime] = useState<'wasm' | 'js'>('js');

  useEffect(() => {
    loadStatsModule().then(({ runtime: selected }) => setRuntime(selected));
  }, []);

  const derived = useMemo<DerivedRecord[]>(() => {
    const weights = records.map((record) => record.weight);

    return records.map((record, index) => {
      const maSlice = weights.slice(Math.max(0, index - 6), index + 1);
      const ma7 = maSlice.reduce((sum, value) => sum + value, 0) / maSlice.length;
      const dailyDelta = index > 0 ? record.weight - records[index - 1].weight : null;
      const monthlyIndex = Math.max(0, index - 30);
      const monthlyDelta = index > 0 ? record.weight - records[monthlyIndex].weight : null;

      return {
        ...record,
        ma7,
        dailyDelta,
        monthlyDelta
      };
    });
  }, [records]);

  const summary = useMemo<MetricSummary>(() => {
    if (!derived.length) {
      return {
        weeklyRhythm: 0,
        stdDevWeight: 0,
        yearlyAmplitude: 0,
        consistencyRate: 0,
        avgBmiLast10: 0
      };
    }

    const latest = derived.at(-1);
    const last28 = derived.slice(-28);
    const weeklyRhythm = last28.length > 1 ? (last28.at(-1)!.weight - last28[0].weight) / 4 : 0;

    const weights = derived.map((entry) => entry.weight);
    const mean = weights.reduce((sum, value) => sum + value, 0) / weights.length;
    const stdDevWeight = Math.sqrt(
      weights.reduce((sum, value) => sum + (value - mean) ** 2, 0) / weights.length
    );

    const currentYear = latest?.date.getFullYear() ?? new Date().getFullYear();
    const currentYearWeights = derived.filter((entry) => entry.date.getFullYear() === currentYear).map((e) => e.weight);
    const yearlyAmplitude = currentYearWeights.length
      ? Math.max(...currentYearWeights) - Math.min(...currentYearWeights)
      : 0;

    const periodDays = Math.max(
      1,
      Math.floor((derived.at(-1)!.date.getTime() - derived[0].date.getTime()) / (1000 * 60 * 60 * 24)) + 1
    );
    const consistencyRate = (derived.length / periodDays) * 100;

    const last10Bmi = derived.slice(-10).map((entry) => entry.bmi);
    const avgBmiLast10 = last10Bmi.reduce((sum, value) => sum + value, 0) / last10Bmi.length;

    return {
      latest,
      weeklyRhythm,
      stdDevWeight,
      yearlyAmplitude,
      consistencyRate,
      avgBmiLast10
    };
  }, [derived]);

  return { derived, summary, runtime };
};
