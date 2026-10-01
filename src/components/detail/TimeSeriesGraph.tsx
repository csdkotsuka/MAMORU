'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { VitalTimeSeriesPoint, Resident } from '@/lib/types';
import { generateTimeSeriesData, TimeRange } from '@/lib/mock/timeseries';
import { Activity, Clock, Heart, Wind, Calendar, RefreshCw } from 'lucide-react';

interface TimeSeriesGraphProps {
  resident: Resident;
  onDataChange?: (data: VitalTimeSeriesPoint[], range: TimeRange) => void;
}

export const TimeSeriesGraph: React.FC<TimeSeriesGraphProps> = ({ resident, onDataChange }) => {
  const [mounted, setMounted] = React.useState(false);
  const [range, setRange] = useState<TimeRange>('3d');
  const [activeMetric, setActiveMetric] = useState<'all' | 'vitalOnly' | 'activityOnly'>('all');

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const data = generateTimeSeriesData(resident.id, range);

  const handleRangeChange = (newRange: TimeRange) => {
    setRange(newRange);
    if (onDataChange) {
      onDataChange(generateTimeSeriesData(resident.id, newRange), newRange);
    }
  };

  // カスタムツールチップ
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const point: VitalTimeSeriesPoint = payload[0].payload;
      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1.5 min-w-[200px]">
          <div className="font-bold text-slate-300 border-b border-slate-700 pb-1 flex items-center justify-between">
            <span>{point.timeLabel}</span>
            <span className="text-[10px] text-slate-400 font-mono">{point.timestamp.slice(0, 10)}</span>
          </div>

          <div className="flex items-center justify-between text-rose-400 font-medium">
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" /> 心拍数:
            </span>
            <span className="font-bold">{point.heartRate} bpm</span>
          </div>

          <div className="flex items-center justify-between text-cyan-400 font-medium">
            <span className="flex items-center gap-1">
              <Wind className="w-3.5 h-3.5" /> 呼吸数:
            </span>
            <span className="font-bold">{point.respirationRate} 回/分</span>
          </div>

          <div className="flex items-center justify-between text-amber-300 font-medium">
            <span className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> 活動指数:
            </span>
            <span className="font-bold">{point.activityLevel}</span>
          </div>

          {point.eventNote && (
            <div className="mt-1 pt-1 border-t border-slate-700/80 text-[11px] text-amber-300 font-bold bg-amber-950/60 p-1.5 rounded">
              ⚠️ {point.eventNote}
            </div>
          )}

          {point.isOutOfBed && (
            <div className="text-[11px] text-purple-300 font-bold bg-purple-950/60 p-1 rounded">
              🛏️ 離床イベント検知
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
      {/* グラフヘッダー & 期間セレクタ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <span>時系列バイタル推移＆活動量グラフ</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            平常安静時ベースライン（心拍 {resident.baseline.heartRate}bpm）との乖離および日内変動の可視化
          </p>
        </div>

        {/* 期間切替ボタン */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => handleRangeChange('24h')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              range === '24h'
                ? 'bg-white text-blue-600 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            過去24時間
          </button>
          <button
            onClick={() => handleRangeChange('3d')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              range === '3d'
                ? 'bg-white text-blue-600 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            過去3日間
          </button>
          <button
            onClick={() => handleRangeChange('7d')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              range === '7d'
                ? 'bg-white text-blue-600 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            過去7日間
          </button>
        </div>
      </div>

      {/* 凡例バッジ */}
      <div className="flex flex-wrap items-center gap-4 mb-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-700">
          <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
          <span className="font-medium">心拍数 (bpm)</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-700">
          <span className="w-3 h-3 rounded-full bg-cyan-600 inline-block" />
          <span className="font-medium">呼吸数 (回/分) [右軸]</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-700">
          <span className="w-3 h-2 rounded bg-amber-400 inline-block" />
          <span className="font-medium">活動量 / 体動指数</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500">
          <span className="w-3 h-0.5 border-t-2 border-dashed border-rose-300 inline-block" />
          <span>平常心拍ベースライン ({resident.baseline.heartRate} bpm)</span>
        </div>
      </div>

      {/* Recharts グラフ本体 */}
      <div className="w-full h-80 pt-2 flex items-center justify-center">
        {!mounted ? (
          <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
            <span className="text-xs">時系列グラフをレンダリング中...</span>
          </div>
        ) : (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="timeLabel"
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            {/* 左Y軸：心拍数 */}
            <YAxis
              yAxisId="left"
              domain={[40, 140]}
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            {/* 右Y軸：呼吸数 */}
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 40]}
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* 平常心拍ベースライン */}
            <ReferenceLine
              yAxisId="left"
              y={resident.baseline.heartRate}
              stroke="#fb7185"
              strokeDasharray="4 4"
              label={{
                value: `平常心拍 ${resident.baseline.heartRate}`,
                fill: '#fb7185',
                fontSize: 10,
                position: 'insideBottomLeft',
              }}
            />

            {/* 頻脈危険ライン 120bpm */}
            <ReferenceLine
              yAxisId="left"
              y={120}
              stroke="#ef4444"
              strokeDasharray="2 2"
              label={{
                value: '警告閾値 120bpm',
                fill: '#ef4444',
                fontSize: 10,
                position: 'insideTopLeft',
              }}
            />

            {/* 活動量バー */}
            <Bar
              yAxisId="right"
              dataKey="activityLevel"
              fill="#fef3c7"
              radius={[4, 4, 0, 0]}
              maxBarSize={16}
            />

            {/* 呼吸数ライン */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="respirationRate"
              stroke="#0891b2"
              strokeWidth={2}
              dot={{ r: 2, fill: '#0891b2' }}
              activeDot={{ r: 5 }}
            />

            {/* 心拍数ライン */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="heartRate"
              stroke="#e11d48"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#e11d48' }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
        )}
      </div>

      <div className="mt-3 text-right">
        <span className="text-[11px] text-slate-400">
          ※ グラフ上の各ポイントにカーソルを合わせると詳細バイタルとイベント注記が表示されます
        </span>
      </div>
    </div>
  );
};
