import { BiometricRecord } from '../types/biometric';

const REQUIRED_COLUMNS = 9;

const parseDate = (value: string): Date | null => {
  const raw = value.trim();
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
    const [day, month, year] = raw.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const date = new Date(`${raw}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
};

const parseNumber = (value: string): number => {
  const normalized = value.trim().replace(',', '.');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
};

const toISODate = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseCSV = (rawCsv: string): BiometricRecord[] => {
  const lines = rawCsv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error('CSV sem dados suficientes.');
  }

  const dataRows = lines.slice(1);

  const parsed = dataRows.map((line, index) => {
    const cols = line.split(';').length === REQUIRED_COLUMNS ? line.split(';') : line.split(',');

    if (cols.length !== REQUIRED_COLUMNS) {
      throw new Error(`Linha ${index + 2} inválida: esperado 9 colunas.`);
    }

    const [dateStr, weight, waist, abdomen, hip, thigh, bmi, bmiClass, age] = cols;
    const parsedDate = parseDate(dateStr);

    if (!parsedDate) {
      throw new Error(`Linha ${index + 2} possui data inválida.`);
    }

    const record: BiometricRecord = {
      date: parsedDate,
      dateISO: toISODate(parsedDate),
      weight: parseNumber(weight),
      waist: parseNumber(waist),
      abdomen: parseNumber(abdomen),
      hip: parseNumber(hip),
      thigh: parseNumber(thigh),
      bmi: parseNumber(bmi),
      bmiClass: bmiClass.trim(),
      age: parseNumber(age)
    };

    const hasInvalidNumber = [
      record.weight,
      record.waist,
      record.abdomen,
      record.hip,
      record.thigh,
      record.bmi,
      record.age
    ].some((num) => Number.isNaN(num));

    if (hasInvalidNumber) {
      throw new Error(`Linha ${index + 2} possui valores numéricos inválidos.`);
    }

    return record;
  });

  return parsed.sort((a, b) => a.date.getTime() - b.date.getTime());
};
