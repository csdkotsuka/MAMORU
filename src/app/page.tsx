'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { subscribeToResidents, getResidents } from '@/lib/mock/stream';
import { INITIAL_FACILITIES } from '@/lib/mock/facilities';
import { Resident, Facility } from '@/lib/types';
import { VitalCard } from '@/components/dashboard/VitalCard';
import { AlertBanner } from '@/components/dashboard/AlertBanner';
import { StreamSimulator } from '@/components/simulation/StreamSimulator';
import { Users, AlertCircle, AlertTriangle, Building2, Radio, MapPin, Phone, UserCheck } from 'lucide-react';

function DashboardContent() {
  const searchParams = useSearchParams();
  const initialFacilityId = searchParams.get('facilityId') || 'ALL';

  const [residents, setResidents] = useState<Resident[]>([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(initialFacilityId);
  const [filter, setFilter] = useState<'ALL' | 'ALERT_ONLY' | 'OUT_OF_BED'>('ALL');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setResidents(getResidents());
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
          <span>MAMORU 3層ストリーム通信を確立中...</span>
        </div>
      </div>
    );
  }

  // 事業所絞り込み
  const currentFacility = INITIAL_FACILITIES.find((f) => f.id === selectedFacilityId);
  const facilityFilteredResidents = selectedFacilityId === 'ALL'
    ? residents
    : residents.filter((r) => r.facilityId === selectedFacilityId);

  // ステータス絞り込み
  const displayedResidents = facilityFilteredResidents.filter((r) => {
    if (filter === 'ALERT_ONLY') {
      return r.currentVital.status === 'CRITICAL' || r.currentVital.status === 'CAUTION';
    }
    if (filter === 'OUT_OF_BED') {
      return r.currentVital.bedStatus === 'OUT_OF_BED' || r.currentVital.bedStatus === 'SITTING_EDGE';
    }
    return true;
  });

  const criticalCount = facilityFilteredResidents.filter((r) => r.currentVital.status === 'CRITICAL').length;
  const cautionCount = facilityFilteredResidents.filter((r) => r.currentVital.status === 'CAUTION').length;
  const outOfBedCount = facilityFilteredResidents.filter((r) => r.currentVital.bedStatus === 'OUT_OF_BED').length;

  return (
    <div>
      {/* 第2層：事業所セレクター ＆ 施設情報バナー */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                <span>第2層：事業所選択</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                  {selectedFacilityId === 'ALL' ? '全域横断' : currentFacility?.type}
                </span>
              </div>
              <div className="text-lg font-black text-slate-900 mt-0.5">
                {selectedFacilityId === 'ALL' ? '全事業所 横断モニタリング' : currentFacility?.name}
              </div>
            </div>
          </div>

          {/* セレクター切り替え */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedFacilityId('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedFacilityId === 'ALL'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              全事業所 ({residents.length}名)
            </button>
            {INITIAL_FACILITIES.map((fac) => (
              <button
                key={fac.id}
                onClick={() => setSelectedFacilityId(fac.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedFacilityId === fac.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {fac.name}
              </button>
            ))}
          </div>
        </div>

        {/* 施設詳細（選択時のみ） */}
        {currentFacility && selectedFacilityId !== 'ALL' && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentFacility.address}</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentFacility.phone}</span>
            </div>
            <div className="flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentFacility.managerName}</span>
            </div>
            <div className="ml-auto font-semibold text-blue-700">
              稼働センサー: {currentFacility.activeSensors}台 / 定員: {currentFacility.totalBeds}
            </div>
          </div>
        )}
      </div>

      {/* ページタイトル＆リアルタイムインジケーター */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              第3層：利用者バイタル＆離床リアルタイム監視
            </h1>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span>LIVE 3s</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            各部屋・居宅のIoTセンサーより受信した時系列生体データを監視
          </p>
        </div>

        {/* 状態サマリーカード */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-2 flex-shrink-0">
            <Users className="w-4 h-4 text-slate-500" />
            <div className="text-xs">
              <span className="text-slate-500">対象: </span>
              <span className="font-bold text-slate-800">{facilityFilteredResidents.length}名</span>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 shadow-sm flex items-center gap-2 flex-shrink-0">
            <AlertCircle className="w-4 h-4 text-red-500 animate-bounce" />
            <div className="text-xs">
              <span className="text-red-600">警告: </span>
              <span className="font-bold text-red-700">{criticalCount}名</span>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 shadow-sm flex items-center gap-2 flex-shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <div className="text-xs">
              <span className="text-amber-600">要観察: </span>
              <span className="font-bold text-amber-700">{cautionCount}名</span>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 shadow-sm flex items-center gap-2 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
            <div className="text-xs">
              <span className="text-purple-600">離床中: </span>
              <span className="font-bold text-purple-700">{outOfBedCount}名</span>
            </div>
          </div>
        </div>
      </div>

      {/* 異常値アラートバナー */}
      <AlertBanner residents={facilityFilteredResidents} />

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
            全員表示 ({facilityFilteredResidents.length})
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
      </div>

      {/* 利用者カード一覧グリッド */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayedResidents.map((resident) => (
          <VitalCard key={resident.id} resident={resident} />
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">読み込み中...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
