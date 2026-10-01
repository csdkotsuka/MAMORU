'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CURRENT_ORGANIZATION, INITIAL_FACILITIES } from '@/lib/mock/facilities';
import { INITIAL_RESIDENTS } from '@/lib/mock/residents';
import { Building2, ShieldCheck, Database, CheckCircle2, AlertTriangle, ArrowRight, Radio, Users, Cpu, Layers } from 'lucide-react';

export default function AdminDashboardPage() {
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncFirebase = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const res = await fetch('/api/firebase/seed', { method: 'POST' });
      const data = await res.json();
      setSyncStatus(data.message || 'データ同期が完了しました');
    } catch (e: any) {
      setSyncStatus('同期処理中にエラーが発生しました');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ページタイトル */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              第1層：自社本部・統轄管理
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {CURRENT_ORGANIZATION.id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            {CURRENT_ORGANIZATION.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            契約事業所（老健・特養・グループホーム・訪問看護）の稼働状況および全域IoTセンサー横断モニタリング
          </p>
        </div>

        {/* Firebase同期アクション */}
        <div className="flex flex-col items-end gap-1.5">
          <button
            onClick={handleSyncFirebase}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            <Database className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Firebaseに同期中...' : 'Firestoreへ初期データを投入'}</span>
          </button>
          <span className="text-[10px] text-slate-400">
            ※ 3層構造（自社・事業所・利用者・時系列ログ）を一括格納
          </span>
        </div>
      </div>

      {syncStatus && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span className="font-medium">{syncStatus}</span>
        </div>
      )}

      {/* 組織サマリー統計 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">管理事業所数</div>
            <div className="text-2xl font-black text-slate-900">{INITIAL_FACILITIES.length} 拠点</div>
            <div className="text-[11px] text-slate-400">老健1 / 訪看1 / GH1</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">稼働IoTセンサー</div>
            <div className="text-2xl font-black text-slate-900">{CURRENT_ORGANIZATION.totalSensorsCount} 台</div>
            <div className="text-[11px] text-emerald-600 font-medium">全センサー正常オンライン</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">登録対象者総数</div>
            <div className="text-2xl font-black text-slate-900">{INITIAL_RESIDENTS.length} 名</div>
            <div className="text-[11px] text-slate-400">要観察・警告 3名</div>
          </div>
        </div>
      </div>

      {/* 第2層：契約事業所一覧 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span>管轄事業所一覧（第2層）</span>
            </h2>
            <p className="text-xs text-slate-500">
              各事業所のカードをクリックすると、その事業所の専有監視ダッシュボードに切り替わります。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {INITIAL_FACILITIES.map((fac) => {
            const facResidents = INITIAL_RESIDENTS.filter((r) => r.facilityId === fac.id);
            const criticalCount = facResidents.filter((r) => r.currentVital.status === 'CRITICAL').length;
            const cautionCount = facResidents.filter((r) => r.currentVital.status === 'CAUTION').length;

            return (
              <div
                key={fac.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 transition-all shadow-sm hover:shadow-md p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {fac.type}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{fac.id}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1">{fac.name}</h3>
                  <p className="text-xs text-slate-500 mb-3">{fac.address}</p>

                  <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 text-xs text-slate-600 border border-slate-100 mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">管理者:</span>
                      <span className="font-semibold text-slate-700">{fac.managerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">定員 / センサー:</span>
                      <span className="font-semibold text-slate-700">{fac.totalBeds}床 / {fac.activeSensors}台</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">登録利用者:</span>
                      <span className="font-semibold text-slate-700">{facResidents.length}名</span>
                    </div>
                  </div>

                  {/* アラート状況 */}
                  <div className="flex items-center gap-2 text-xs mb-4">
                    {criticalCount > 0 ? (
                      <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-red-600" />
                        警告 {criticalCount}件
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-medium">
                        緊急なし
                      </span>
                    )}
                    {cautionCount > 0 && (
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-medium">
                        要観察 {cautionCount}件
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  href={`/?facilityId=${fac.id}`}
                  className="flex items-center justify-center gap-1.5 w-full py-2 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold text-xs rounded-xl transition-all"
                >
                  <span>事業所のバイタル監視を開く</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
