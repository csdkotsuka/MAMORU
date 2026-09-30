'use client';

import React from 'react';
import { Resident } from '@/lib/types';
import { User, Activity, Heart, Wind, Thermometer, BedDouble, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

interface PatientProfileProps {
  resident: Resident;
}

export const PatientProfile: React.FC<PatientProfileProps> = ({ resident }) => {
  const { currentVital, baseline } = resident;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* 左側：基本情報 */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-extrabold text-xl shadow-md shadow-blue-500/20 flex-shrink-0">
            {resident.name.slice(0, 1)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 font-bold text-xs text-slate-700">
                {resident.roomNumber}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-xs">
                {resident.careLevel}
              </span>
              <span className="text-xs text-slate-500">
                {resident.nameKana} ({resident.age}歳・{resident.gender})
              </span>
            </div>

            <h2 className="text-2xl font-black text-slate-900 mt-1">
              {resident.name} <span className="text-sm font-normal text-slate-400">様</span>
            </h2>

            {/* 既往歴 */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-xs text-slate-400 font-medium">既往症:</span>
              {resident.primaryDiagnosis.map((diag, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium"
                >
                  {diag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 右側：平常ベースライン vs 現在値 */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
          <div className="text-xs text-slate-500 font-semibold pr-2 border-r border-slate-200 hidden sm:block">
            バイタル<br />サマリー
          </div>

          {/* 心拍数 */}
          <div className="text-center px-2">
            <div className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
              <Heart className="w-3 h-3 text-rose-500" />
              <span>心拍数</span>
            </div>
            <div className="text-lg font-black text-slate-900">
              {currentVital.heartRate}
              <span className="text-[10px] font-normal text-slate-400 ml-0.5">bpm</span>
            </div>
            <div className="text-[10px] text-slate-400">
              平: {baseline.heartRate}
            </div>
          </div>

          {/* 呼吸数 */}
          <div className="text-center px-2 border-l border-slate-200">
            <div className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
              <Wind className="w-3 h-3 text-cyan-500" />
              <span>呼吸数</span>
            </div>
            <div className="text-lg font-black text-slate-900">
              {currentVital.respirationRate}
              <span className="text-[10px] font-normal text-slate-400 ml-0.5">/分</span>
            </div>
            <div className="text-[10px] text-slate-400">
              平: {baseline.respirationRate}
            </div>
          </div>

          {/* 体温 */}
          <div className="text-center px-2 border-l border-slate-200">
            <div className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
              <Thermometer className="w-3 h-3 text-orange-400" />
              <span>体温</span>
            </div>
            <div className="text-lg font-black text-slate-900">
              {currentVital.temperature.toFixed(1)}
              <span className="text-[10px] font-normal text-slate-400 ml-0.5">℃</span>
            </div>
            <div className="text-[10px] text-slate-400">
              平: {baseline.temperature.toFixed(1)}
            </div>
          </div>

          {/* 離床ステータス */}
          <div className="text-center px-2 border-l border-slate-200">
            <div className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
              <BedDouble className="w-3 h-3 text-indigo-500" />
              <span>在床判定</span>
            </div>
            <div className="text-xs font-bold text-slate-800 mt-1">
              {currentVital.bedStatus === 'IN_BED'
                ? '在床中'
                : currentVital.bedStatus === 'OUT_OF_BED'
                ? '離床中'
                : currentVital.bedStatus === 'SITTING_EDGE'
                ? '端座位'
                : '体動なし'}
            </div>
          </div>
        </div>
      </div>

      {/* PT・リハビリ視点のアセスメント注意事項 */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            PT移動能力
          </span>
          <span className="font-medium">{resident.mobilityStatus}</span>
        </div>
        <div className="text-slate-500">
          <span className="font-semibold text-slate-600">特記: </span>
          <span>{resident.notes}</span>
        </div>
      </div>
    </div>
  );
};
