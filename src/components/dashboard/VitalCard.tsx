'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Wind, Thermometer, User, BedDouble, AlertOctagon, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { Resident, BedStatus, VitalStatus } from '@/lib/types';

interface VitalCardProps {
  resident: Resident;
}

export const VitalCard: React.FC<VitalCardProps> = ({ resident }) => {
  const { currentVital, baseline } = resident;

  // ステータスに応じたボーダー & バッジのスタイル
  const getStatusBadge = (status: VitalStatus) => {
    switch (status) {
      case 'CRITICAL':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-300 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            警告・急変疑い
          </span>
        );
      case 'CAUTION':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            要観察
          </span>
        );
      case 'STABLE':
      default:
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            安定
          </span>
        );
    }
  };

  // 離床センサーの表示設定
  const getBedStatusBadge = (bedStatus: BedStatus, durationSec: number) => {
    switch (bedStatus) {
      case 'OUT_OF_BED':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500 text-white font-bold text-xs animate-bounce">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>離床中 ({durationSec}s)</span>
          </div>
        );
      case 'SITTING_EDGE':
        return (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-semibold text-xs border border-amber-300">
            <BedDouble className="w-3.5 h-3.5" />
            <span>端座位 (起き上がり)</span>
          </div>
        );
      case 'NO_MOVEMENT':
        return (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-bold text-xs border border-purple-300 animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>体動停止 (無呼吸疑い)</span>
          </div>
        );
      case 'IN_BED':
      default:
        return (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
            <BedDouble className="w-3.5 h-3.5 text-slate-500" />
            <span>在床 (安静)</span>
          </div>
        );
    }
  };

  // 心拍数乖離計算
  const hrDiff = currentVital.heartRate - baseline.heartRate;

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl ${
        currentVital.status === 'CRITICAL'
          ? 'border-red-400 ring-2 ring-red-300 bg-red-50/20'
          : currentVital.status === 'CAUTION'
          ? 'border-amber-300 ring-1 ring-amber-200'
          : 'border-slate-200 hover:border-blue-400'
      }`}
    >
      <Link href={`/residents/${resident.id}`} className="block p-5">
        {/* カードヘッダー */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-bold rounded bg-slate-100 text-slate-700">
                {resident.roomNumber}
              </span>
              <span className="text-xs text-slate-500">
                {resident.age}歳・{resident.gender}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mt-0.5 flex items-center gap-1.5">
              <span>{resident.name}</span>
              <span className="text-xs font-normal text-slate-400">様</span>
              <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-blue-600" />
            </h3>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            {getStatusBadge(currentVital.status)}
            <span className="text-[11px] font-semibold text-slate-500">
              {resident.careLevel}
            </span>
          </div>
        </div>

        {/* 離床センサーステータス */}
        <div className="mb-4 flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <span className="text-xs font-medium text-slate-500">ベッドセンサー:</span>
          {getBedStatusBadge(currentVital.bedStatus, currentVital.outOfBedDurationSec)}
        </div>

        {/* バイタル3連グリッド */}
        <div className="grid grid-cols-3 gap-2.5 text-center mb-4">
          {/* 心拍数 */}
          <div
            className={`p-2.5 rounded-xl border ${
              currentVital.heartRate >= 120 || currentVital.heartRate <= 50
                ? 'bg-red-50 border-red-300 text-red-800'
                : hrDiff >= 15
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-slate-50/70 border-slate-100 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-500 mb-0.5">
              <Heart
                className={`w-3.5 h-3.5 ${
                  currentVital.heartRate >= 100
                    ? 'text-red-500 animate-heartbeat'
                    : 'text-rose-400'
                }`}
              />
              <span>心拍数</span>
            </div>
            <div className="text-xl font-black tracking-tight">
              {currentVital.heartRate}
              <span className="text-[10px] font-normal text-slate-500 ml-0.5">bpm</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              平: {baseline.heartRate} ({hrDiff >= 0 ? `+${hrDiff}` : hrDiff})
            </div>
          </div>

          {/* 呼吸数 */}
          <div
            className={`p-2.5 rounded-xl border ${
              currentVital.respirationRate <= 10 || currentVital.respirationRate >= 26
                ? 'bg-red-50 border-red-300 text-red-800'
                : 'bg-slate-50/70 border-slate-100 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-500 mb-0.5">
              <Wind className="w-3.5 h-3.5 text-sky-500" />
              <span>呼吸数</span>
            </div>
            <div className="text-xl font-black tracking-tight">
              {currentVital.respirationRate}
              <span className="text-[10px] font-normal text-slate-500 ml-0.5">/分</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              平: {baseline.respirationRate}
            </div>
          </div>

          {/* 体温 */}
          <div
            className={`p-2.5 rounded-xl border ${
              currentVital.temperature >= 37.3
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-slate-50/70 border-slate-100 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-500 mb-0.5">
              <Thermometer className="w-3.5 h-3.5 text-orange-400" />
              <span>体温</span>
            </div>
            <div className="text-xl font-black tracking-tight">
              {currentVital.temperature.toFixed(1)}
              <span className="text-[10px] font-normal text-slate-500 ml-0.5">℃</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              平: {baseline.temperature.toFixed(1)}
            </div>
          </div>
        </div>

        {/* 既往症タグ */}
        <div className="flex flex-wrap gap-1 mb-2">
          {resident.primaryDiagnosis.slice(0, 2).map((diag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100"
            >
              {diag}
            </span>
          ))}
          {resident.primaryDiagnosis.length > 2 && (
            <span className="text-[10px] text-slate-400 px-1 py-0.5">
              +{resident.primaryDiagnosis.length - 2}
            </span>
          )}
        </div>

        {/* フッター：更新時刻 */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-2.5 mt-2">
          <span>{resident.mobilityStatus.slice(0, 16)}...</span>
          <span className="font-mono text-emerald-600 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            {currentVital.updatedAt}
          </span>
        </div>
      </Link>
    </div>
  );
};
