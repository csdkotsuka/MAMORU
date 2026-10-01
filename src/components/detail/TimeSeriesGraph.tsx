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
  const [viewMode, setViewMode] = useState<'vital' | 'lifestyle'>('vital');

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

  const getVitalityEmoji = (score?: number) => {
    switch (score) {
      case 5: return { emoji: '😆', text: '非常に活気あり (5)' };
      case 4: return { emoji: '😊', text: '良好・普段通り (4)' };
      case 3: return { emoji: '😐', text: 'やや低下・普通 (3)' };
      case 2: return { emoji: '🙁', text: '不活発・傾眠 (2)' };
      case 1: return { emoji: '😴', text: 'ぐったり・反応鈍 (1)' };
      default: return { emoji: '😐', text: '未評価' };
    }
  };

  // カスタムツールチップ
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const point: VitalTimeSeriesPoint = payload[0].payload;
      const vitalityInfo = getVitalityEmoji(point.vitalityScore);

      if (viewMode === 'lifestyle') {
        return (
          <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-2 min-w-[210px]">
            <div className="font-bold text-slate-300 border-b border-slate-700 pb-1 flex items-center justify-between">
              <span>{point.timeLabel}</span>
              <span className="text-[10px] text-slate-400 font-mono">{point.timestamp.slice(0, 10)}</span>
            </div>

            <div className="flex items-center justify-between text-amber-300 font-medium">
              <span>🍚 食事摂取量:</span>
              <span className="font-bold">{point.mealPercentage ?? '--'} %</span>
            </div>

            <div className="flex items-center justify-between text-sky-300 font-medium">
              <span>💧 水分摂取量:</span>
              <span className="font-bold">{point.waterIntakeMl ?? '--'} ml</span>
            </div>

            <div className="flex items-center justify-between text-pink-300 font-medium">
              <span>表情・活気度:</span>
              <span className="font-bold flex items-center gap-1">
                <span>{vitalityInfo.emoji}</span>
                <span>{vitalityInfo.text}</span>
              </span>
            </div>

            {point.mealPercentage !== undefined && point.mealPercentage < 50 && (
              <div className="mt-1 pt-1 border-t border-slate-700 text-[11px] text-amber-300 font-bold bg-amber-950/60 p-1 rounded">
                ⚠️ 食事量50%未満（食欲不振・要観察）
              </div>
            )}
            {point.waterIntakeMl !== undefined && point.waterIntakeMl < 1000 && (
              <div className="text-[11px] text-cyan-300 font-bold bg-cyan-950/60 p-1 rounded">
                💧 水分不足注意（脱水警戒ライン）
              </div>
            )}
          </div>
        );
      }

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
      {/* グラフヘッダー & タブ切り替え & 期間セレクタ */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span>時系列モニタリンググラフ</span>
            </h3>
            {/* モード切替バッジ */}
            <div className="inline-flex p-0.5 bg-slate-100 rounded-lg text-xs font-bold">
              <button
                onClick={() => setViewMode('vital')}
                className={`px-3 py-1 rounded-md transition-all ${
                  viewMode === 'vital'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                生体バイタル (心拍・呼吸・体動)
              </button>
              <button
                onClick={() => setViewMode('lifestyle')}
                className={`px-3 py-1 rounded-md transition-all ${
                  viewMode === 'lifestyle'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                生活バイタル (食事・水分・活気度)
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {viewMode === 'vital'
              ? `平常安静時ベースライン（心拍 ${resident.baseline.heartRate}bpm）との乖離および日内変動の可視化`
              : '日々の食事摂取割合(%)・水分量(ml)および表情・活気度（5段階）の長期的経過トレンド'}
          </p>
        </div>

        {/* 期間切替ボタン */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold self-start lg:self-auto">
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
      {viewMode === 'vital' ? (
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
      ) : (
        <div className="flex flex-wrap items-center gap-4 mb-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="w-3 h-3 rounded bg-amber-500 inline-block" />
            <span className="font-medium">食事量 (%) [左軸 0-100%]</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="w-3 h-3 rounded-full bg-sky-500 inline-block" />
            <span className="font-medium">水分量 (ml) [右軸 0-2000ml]</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="w-3 h-3 rounded-full bg-pink-500 inline-block" />
            <span className="font-medium">活気・表情スコア (1〜5) [左軸]</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-sky-400 inline-block" />
            <span>推奨水分目安 (1,200 ml)</span>
          </div>
        </div>
      )}

      {/* Recharts グラフ本体 */}
      <div className="w-full h-80 pt-2 flex items-center justify-center">
        {!mounted ? (
          <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
            <span className="text-xs">時系列グラフをレンダリング中...</span>
          </div>
        ) : viewMode === 'vital' ? (
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
        ) : (
          /* 生活バイタルグラフ (食事・水分・活気) */
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="timeLabel"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              {/* 左Y軸：食事割合 (0〜100%) */}
              <YAxis
                yAxisId="left"
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                unit="%"
              />
              {/* 右Y軸：水分量 (0〜2000ml) */}
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 2000]}
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                unit="ml"
              />
              <Tooltip content={<CustomTooltip />} />

              {/* 水分推奨ライン 1200ml */}
              <ReferenceLine
                yAxisId="right"
                y={1200}
                stroke="#38bdf8"
                strokeDasharray="4 4"
                label={{
                  value: '推奨水分 1200ml',
                  fill: '#0284c7',
                  fontSize: 10,
                  position: 'insideTopRight',
                }}
              />

              {/* 食事量バー (琥珀色) */}
              <Bar
                yAxisId="left"
                dataKey="mealPercentage"
                fill="#f59e0b"
                opacity={0.7}
                radius={[4, 4, 0, 0]}
                maxBarSize={18}
              />

              {/* 水分量ライン (水色) */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="waterIntakeMl"
                stroke="#0284c7"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#0284c7' }}
                activeDot={{ r: 6 }}
              />

              {/* 活気度ライン (1〜5を左軸0〜100%に合わせるため ×20 でスケールまたはポイント表示) */}
              {/* 活気度は別で分かりやすくするため、食事量軸に合わせてスケーリング(×20)するか、別で表示 */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey={(d) => (d.vitalityScore ? d.vitalityScore * 20 : 60)}
                stroke="#ec4899"
                strokeWidth={2}
                strokeDasharray="3 3"
                dot={{ r: 4, fill: '#ec4899' }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400">
        <div>
          {viewMode === 'lifestyle' ? (
            <span>※ ピンク破線は活気度スコア（1〜5を百分率換算表示）。ツールチップで表情アイコン 😊 を確認できます</span>
          ) : (
            <span>※ グラフ上の各ポイントにカーソルを合わせると詳細バイタルとイベント注記が表示されます</span>
          )}
        </div>
        <div className="text-right">
          <span>日々の記録は上部の「バイタル・記録を入力」から登録可能です</span>
        </div>
      </div>
    </div>
  );
};
