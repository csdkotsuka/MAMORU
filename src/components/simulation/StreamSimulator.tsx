'use client';

import React, { useState } from 'react';
import { Play, RotateCcw, AlertTriangle, Activity, UserX, HeartPulse } from 'lucide-react';
import { simulateEvent } from '@/lib/mock/stream';

export const StreamSimulator: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const handleSimulate = (residentId: string, eventType: any, description: string) => {
    simulateEvent(residentId, eventType);
    setLastAction(`【${description}】を発動しました（リアルタイム通知を検証中）`);
    setTimeout(() => setLastAction(null), 6000);
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-blue-900/50 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <span>IoTセンサー＆バイタル急変シミュレーター</span>
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-blue-500/30 text-blue-300 border border-blue-400/30">
                Demo & Evaluation
              </span>
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              実証デモ用：ボタンを押すとダミーのリアルタイムストリームへ異常バイタルや離床イベントが即座に注入されます。
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600/40 hover:bg-blue-600/60 border border-blue-400/40 text-blue-200 transition-colors self-start sm:self-auto"
        >
          {isOpen ? 'コントローラーを閉じる' : 'テスト発報メニューを開く'}
        </button>
      </div>

      {lastAction && (
        <div className="mt-3 px-3 py-2 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{lastAction}</span>
        </div>
      )}

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-blue-900/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* シナリオ1 */}
          <button
            onClick={() => handleSimulate('res-001', 'TACHYCARDIA', '佐藤様: 心不全/脱水 心拍126bpm 急上昇')}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-red-500/50 transition-all text-left text-xs group"
          >
            <HeartPulse className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform flex-shrink-0" />
            <div>
              <div className="font-bold text-slate-200">佐藤様：頻脈急変</div>
              <div className="text-[11px] text-slate-400">心拍126bpm（心不全/脱水兆候）</div>
            </div>
          </button>

          {/* シナリオ2 */}
          <button
            onClick={() => handleSimulate('res-002', 'OUT_OF_BED', '田中様: 離床センサー作動・転倒危険')}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 transition-all text-left text-xs group"
          >
            <UserX className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform flex-shrink-0" />
            <div>
              <div className="font-bold text-slate-200">田中様：深夜離床</div>
              <div className="text-[11px] text-slate-400">片麻痺・転倒ハイリスク</div>
            </div>
          </button>

          {/* シナリオ3 */}
          <button
            onClick={() => handleSimulate('res-003', 'APNEA', '鈴木様: 10秒無呼吸/体動停止')}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/50 transition-all text-left text-xs group"
          >
            <AlertTriangle className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform flex-shrink-0" />
            <div>
              <div className="font-bold text-slate-200">鈴木様：無呼吸発症</div>
              <div className="text-[11px] text-slate-400">10秒体動なし・呼吸0回</div>
            </div>
          </button>

          {/* シナリオ4：全リセット */}
          <button
            onClick={() => {
              ['res-001', 'res-002', 'res-003', 'res-005'].forEach(id => simulateEvent(id, 'RESET_NORMAL'));
              setLastAction('全利用者のバイタルを正常ベースライン状態にリセットしました');
              setTimeout(() => setLastAction(null), 4000);
            }}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800 hover:border-emerald-500 transition-all text-left text-xs group"
          >
            <RotateCcw className="w-4 h-4 text-emerald-400 group-hover:rotate-180 transition-transform flex-shrink-0" />
            <div>
              <div className="font-bold text-emerald-200">全平常復帰リセット</div>
              <div className="text-[11px] text-emerald-400">全バイタルをベースラインへ</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
