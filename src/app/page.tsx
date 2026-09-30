'use client';

import React, { useEffect, useState } from 'react';
import { subscribeToResidents, getResidents } from '@/lib/mock/stream';
import { Resident, VitalStatus } from '@/lib/types';
import { VitalCard } from '@/components/dashboard/VitalCard';
import { AlertBanner } from '@/components/dashboard/AlertBanner';
import { StreamSimulator } from '@/components/simulation/StreamSimulator';
import { Users, AlertCircle, AlertTriangle, ShieldCheck, Filter, Radio } from 'lucide-react';

export default function DashboardPage() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'ALERT_ONLY' | 'OUT_OF_BED'>('ALL');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // 初期値設定
    setResidents(getResidents());
    // リアルタイムMockストリーム購読
    const unsubscribe = subscribeToResidents((updated) => {
      setResidents(updated);
    });
    return () => unsubscribe();
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
          <span>MAMORU センサー通信を確立中...</span>
        </div>
      </div>
    );
  }

  // フィルタリング処理
  const filteredResidents = residents.filter((r) => {
    if (filter === 'ALERT_ONLY') {
      return r.currentVital.status === 'CRITICAL' || r.currentVital.status === 'CAUTION';
    }
    if (filter === 'OUT_OF_BED') {
      return r.currentVital.bedStatus === 'OUT_OF_BED' || r.currentVital.bedStatus === 'SITTING_EDGE';
    }
    return true;
  });

  const criticalCount = residents.filter((r) => r.currentVital.status === 'CRITICAL').length;
  const cautionCount = residents.filter((r) => r.currentVital.status === 'CAUTION').length;
  const outOfBedCount = residents.filter((r) => r.currentVital.bedStatus === 'OUT_OF_BED').length;

  return (
    <div>
      {/* ページタイトル＆リアルタイムインジケーター */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              リアルタイム・バイタル監視
            </h1>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span>LIVE 3s</span>
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            2F・3F居室 IoT体動・呼吸・心拍センサー＆離床マット連動モニター
          </p>
        </div>

        {/* 状態サマリーカード */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-2 flex-shrink-0">
            <Users className="w-4 h-4 text-slate-500" />
            <div className="text-xs">
              <span className="text-slate-500">対象: </span>
              <span className="font-bold text-slate-800">{residents.length}名</span>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-red-50 border border-red-200 shadow-sm flex items-center gap-2 flex-shrink-0">
            <AlertCircle className="w-4 h-4 text-red-500 animate-bounce" />
            <div className="text-xs">
              <span className="text-red-600">警告: </span>
              <span className="font-bold text-red-700">{criticalCount}名</span>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 shadow-sm flex items-center gap-2 flex-shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <div className="text-xs">
              <span className="text-amber-600">要観察: </span>
              <span className="font-bold text-amber-700">{cautionCount}名</span>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-purple-50 border border-purple-200 shadow-sm flex items-center gap-2 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
            <div className="text-xs">
              <span className="text-purple-600">離床中: </span>
              <span className="font-bold text-purple-700">{outOfBedCount}名</span>
            </div>
          </div>
        </div>
      </div>

      {/* 異常値アラートバナー */}
      <AlertBanner residents={residents} />

      {/* 実証テスト用シミュレータ */}
      <StreamSimulator />

      {/* フィルタタブ */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'ALL'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            全員表示 ({residents.length})
          </button>
          <button
            onClick={() => setFilter('ALERT_ONLY')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'ALERT_ONLY'
                ? 'bg-white text-red-600 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            要対応・観察のみ ({criticalCount + cautionCount})
          </button>
          <button
            onClick={() => setFilter('OUT_OF_BED')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'OUT_OF_BED'
                ? 'bg-white text-purple-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            離床・起き上がり ({outOfBedCount})
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <span>※ カードクリックで時系列グラフ＆AIアセスメント表示</span>
        </div>
      </div>

      {/* 利用者カード一覧グリッド */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResidents.map((resident) => (
          <VitalCard key={resident.id} resident={resident} />
        ))}
      </div>
    </div>
  );
}
