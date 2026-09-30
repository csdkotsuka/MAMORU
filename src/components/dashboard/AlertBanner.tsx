'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, AlertTriangle, ArrowRight, BellRing } from 'lucide-react';
import { Resident } from '@/lib/types';

interface AlertBannerProps {
  residents: Resident[];
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ residents }) => {
  // CRITICAL または CAUTION のアラートを抽出
  const criticalResidents = residents.filter(r => r.currentVital.status === 'CRITICAL');
  const cautionResidents = residents.filter(r => r.currentVital.status === 'CAUTION');

  if (criticalResidents.length === 0 && cautionResidents.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 mb-6">
      {/* 緊急アラート（CRITICAL） */}
      {criticalResidents.map(res => (
        <div
          key={`crit-${res.id}`}
          className="bg-red-50 border-2 border-red-500 rounded-xl p-4 shadow-md animate-glow-critical flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-red-900"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center flex-shrink-0 animate-bounce">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm bg-red-600 text-white px-2 py-0.5 rounded text-[11px] tracking-wide">
                  緊急アラート
                </span>
                <span className="font-extrabold text-base">
                  {res.roomNumber} {res.name} 様
                </span>
                <span className="text-xs text-red-700">({res.age}歳・{res.careLevel})</span>
              </div>
              <p className="text-sm font-semibold text-red-800 mt-0.5">
                {res.recentAlerts[0]?.message || 
                  (res.currentVital.bedStatus === 'OUT_OF_BED' 
                    ? `離床センサー作動中 (${res.currentVital.outOfBedDurationSec}秒経過・転倒危険)` 
                    : res.currentVital.heartRate >= 120 
                    ? `頻脈警告: 心拍数 ${res.currentVital.heartRate} bpm` 
                    : 'バイタル異常検知')}
              </p>
            </div>
          </div>

          <Link
            href={`/residents/${res.id}`}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow transition-colors flex-shrink-0 self-end sm:self-center"
          >
            <span>AIアセスメント・詳細へ</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ))}

      {/* 要観察アラート（CAUTION） */}
      {cautionResidents.map(res => (
        <div
          key={`caut-${res.id}`}
          className="bg-amber-50 border border-amber-300 rounded-xl p-3 shadow-sm flex items-center justify-between gap-3 text-amber-900 text-xs sm:text-sm"
        >
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <span className="font-bold text-amber-800 mr-2">【要観察】{res.roomNumber} {res.name} 様:</span>
              <span className="text-amber-900 font-medium">
                {res.recentAlerts[0]?.message || `安静時心拍数上昇中 (${res.currentVital.heartRate}bpm / 平常${res.baseline.heartRate}bpm)`}
              </span>
            </div>
          </div>
          <Link
            href={`/residents/${res.id}`}
            className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1 underline underline-offset-2 flex-shrink-0"
          >
            確認する
          </Link>
        </div>
      ))}
    </div>
  );
};
