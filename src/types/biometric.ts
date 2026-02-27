export type BMIClass = 'Normal' | 'Sobrepeso' | 'Obesidade' | string;

export interface BiometricRecord {
  date: Date;
  dateISO: string;
  weight: number;
  waist: number;
  abdomen: number;
  hip: number;
  thigh: number;
  bmi: number;
  bmiClass: BMIClass;
  age: number;
}

export interface DerivedRecord extends BiometricRecord {
  ma7: number | null;
  dailyDelta: number | null;
  monthlyDelta: number | null;
}

export interface MetricSummary {
  latest?: DerivedRecord;
  weeklyRhythm: number;
  stdDevWeight: number;
  yearlyAmplitude: number;
  consistencyRate: number;
  avgBmiLast10: number;
}
