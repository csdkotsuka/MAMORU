'use client';

import React, { useState } from 'react';
import { Sparkles, Brain, Check, Copy, AlertTriangle, ShieldCheck, RefreshCw, FileText, ArrowRight } from 'lucide-react';
import { Resident, VitalTimeSeriesPoint, AIAssessmentResponse } from '@/lib/types';
import { generateTimeSeriesData } from '@/lib/mock/timeseries';

interface AIAnalyzerProps {
  resident: Resident;
  timeSeriesData?: VitalTimeSeriesPoint[];
  currentRange?: string;
}

export const AIAnalyzer: React.FC<AIAnalyzerProps> = ({
  resident,
  timeSeriesData,
  currentRange = '3d',
}) => {
  const [assessment, setAssessment] = useState<AIAssessmentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAssessment = async () => {
    setIsLoading(true);
    setError(null);

    const tsData = timeSeriesData || generateTimeSeriesData(resident.id, '3d');

    try {
      const res = await fetch('/api/ai/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resident,
          timeSeries: tsData,
          range: currentRange,
        }),
      });

      if (!res.ok) {
        throw new Error('AIアセスメントの生成に失敗しました');
      }

      const data: AIAssessmentResponse = await res.json();
      setAssessment(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!assessment) return;
    navigator.clipboard.writeText(assessment.nursingRecordText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getRiskBadge = (level: '低' | '中' | '高') => {
    switch (level) {
      case '高':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-700 border border-red-300">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
            【リスクレベル：高】 要即時訪室・処置
          </span>
        );
      case '中':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            【リスクレベル：中】 要経過観察・検温推奨
          </span>
        );
      case '低':
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            【リスクレベル：低】 安定・計画ケア継続
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
      {/* 医療AIヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Brain className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <span>時系列AIアセスメント＆急変予兆検知エンジン</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-50 to-indigo-50 text-indigo-700 border border-indigo-200">
                Gemini 3.8 Flash & Clinical AI
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              ベースラインとの微細な乖離（夜間心拍・離床行動）を解析し、介護記録・日誌に即転載できる形式で出力
            </p>
          </div>
        </div>

        <button
          onClick={runAssessment}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 self-start sm:self-auto"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>時系列データ解析中...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{assessment ? 'AIアセスメントを再生成' : '時系列AIアセスメントを生成'}</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 未実行状態のプレースホルダー */}
      {!assessment && !isLoading && (
        <div className="p-8 text-center bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
          <Brain className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="font-bold text-sm text-slate-700">AIアセスメントが未生成です</p>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            右上の「時系列AIアセスメントを生成」ボタンを押すと、過去の時系列バイタルデータと平常安静時ベースラインをAIが照合し、急変予兆と対策を自動作成します。
          </p>
        </div>
      )}

      {/* ローディング状態 */}
      {isLoading && (
        <div className="p-10 text-center bg-indigo-50/30 rounded-xl border border-indigo-100 space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mx-auto" />
          <div className="space-y-1">
            <p className="font-bold text-sm text-indigo-900">バイタル時系列パターンをスキャン中...</p>
            <p className="text-xs text-indigo-600">深夜帯の心拍数変化・離床イベント・安静時乖離度を病態生理学的に推論しています</p>
          </div>
        </div>
      )}

      {/* アセスメント結果表示エリア */}
      {assessment && !isLoading && (
        <div className="space-y-4 animate-fadeIn">
          {/* リスクレベルバッジ */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">判定結果:</span>
              {getRiskBadge(assessment.riskLevel)}
            </div>
            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
              <span>分析完了: {assessment.analyzedAt}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                !assessment.isMockFallback 
                  ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
              }`}>
                {assessment.modelUsed || (!assessment.isMockFallback ? 'Gemini 3.8 Flash' : '臨床推論エンジン')}
              </span>
            </div>
          </div>

          {/* 1. 変化の分析 */}
          <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-2">
              <span className="w-1.5 h-3.5 bg-blue-600 rounded-full inline-block" />
              <span>1. 【変化の分析】</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
              {assessment.changeAnalysis}
            </p>
          </div>

          {/* 2. 推測される状態・対策 */}
          <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-200/60">
            <h4 className="font-bold text-xs uppercase tracking-wider text-amber-800 flex items-center gap-1.5 mb-2">
              <span className="w-1.5 h-3.5 bg-amber-500 rounded-full inline-block" />
              <span>2. 【推測される状態・対策】（PT・ケア視点）</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
              {assessment.suspectedConditionAndAction}
            </p>
          </div>

          {/* 3. 介護記録用テキスト */}
          <div className="bg-blue-50/60 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>3. 【介護記録用テキスト】（介護日誌・申し送り転記用）</span>
              </h4>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>コピー完了!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>日誌用にコピー</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-white p-3 rounded-lg border border-blue-100 text-xs sm:text-sm text-slate-800 font-mono leading-relaxed whitespace-pre-wrap">
              {assessment.nursingRecordText}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              ※ ボタンを押すとクリップボードにコピーされ、ケア記録システムや介護日誌、医師・看護師連絡チャットへ即座に貼り付け可能です。
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
