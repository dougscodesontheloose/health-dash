import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { DerivedRecord } from '../types/biometric';

interface Props {
  data: DerivedRecord[];
}

export const ChartsPanel = ({ data }: Props) => {
  const birthdayGains = data.filter((entry) => {
    const date = entry.date;
    return date.getDate() === 13 && date.getMonth() === 0;
  });

  return (
    <div className="glass p-4 space-y-6">
      <h3 className="font-semibold">ComposedChart — Peso + MA7</h3>
      <div className="h-72">
        <ResponsiveContainer>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff22" />
            <XAxis dataKey="dateISO" minTickGap={20} />
            <YAxis yAxisId="left" domain={['dataMin - 2', 'dataMax + 2']} />
            <Tooltip />
            <Area yAxisId="left" type="monotone" dataKey="ma7" fill="#36C69244" stroke="#36C692" />
            <Scatter yAxisId="left" dataKey="weight" fill="#E8EDF3" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <h3 className="font-semibold">Cintura longitudinal</h3>
      <div className="h-56">
        <ResponsiveContainer>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="2 2" stroke="#ffffff22" />
            <XAxis dataKey="dateISO" minTickGap={24} />
            <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
            <Tooltip />
            <Line type="monotone" dataKey="waist" stroke="#D97706" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <h3 className="font-semibold">Birthday Gains (13 de Janeiro)</h3>
      <div className="h-56">
        <ResponsiveContainer>
          <ComposedChart data={birthdayGains}>
            <CartesianGrid strokeDasharray="2 2" stroke="#ffffff22" />
            <XAxis dataKey="dateISO" />
            <YAxis />
            <Tooltip />
            <Line type="linear" dataKey="weight" stroke="#36C692" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
