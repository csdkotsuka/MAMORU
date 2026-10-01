'use client';

import React, { useState } from 'react';
import { DailyCareRecord, Resident } from '@/lib/types';
import { VitalRecordModal } from './VitalRecordModal';
import { FileText, Plus, Heart, Thermometer, Droplets, Calendar, User, Clock, CheckCircle } from 'lucide-react';
import { updateResident } from '@/lib/mock/stream';

interface CareRecordTimelineProps {
  resident: Resident;
}

export const CareRecordTimeline: React.FC<CareRecordTimelineProps> = ({ resident }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [records, setRecords] = useState<DailyCareRecord[]>([
    {
      id: 'rec-01',
      residentId: resident.id,
      recordedAt: '10/01 10:15',
      staffName: '大塚 PT',
      temperature: 36.6,
      bloodPressureSys: 126,
      bloodPressureDia: 74,
      heartRate: 72,
      respirationRate: 16,
      spo2: 98,
      mealIntake: '朝食全量摂取',
      waterIntakeMl: 250,
      excretionNote: '排尿あり',
      notes: '午前リハビリテーション実施。平行棒内での立位保持バランス良好。ふらつき認めず笑顔みられる。',
    },
    {
      id: 'rec-02',
      residentId: resident.id,
      recordedAt: '09/30 18:30',
      staffName: '佐々木 看護師',
      temperature: 36.8,
      bloodPressureSys: 132,
      bloodPressureDia: 78,
      heartRate: 80,
      respirationRate: 18,
      spo2: 97,
      mealIntake: '夕食主食8割/副食全量',
      waterIntakeMl: 200,
      excretionNote: '排便あり（軟便少量）',
      notes: '夕方やや活気あり。水分摂取を促し快く応じられる。夜間就寝前のトイレ誘導予定。',
    }
  ]);

  const handleSaveRecord = (newRecord: DailyCareRecord) => {
    setRecords([newRecord, ...records]);

    // 最新バイタルを更新
    if (newRecord.heartRate || newRecord.temperature || newRecord.respirationRate) {
      const updated = {
        ...resident,
        currentVital: {
          ...resident.currentVital,
          heartRate: newRecord.heartRate ?? resident.currentVital.heartRate,
          temperature: newRecord.temperature ?? resident.currentVital.temperature,
          respirationRate: newRecord.respirationRate ?? resident.currentVital.respirationRate,
          updatedAt: 'たった今(実測)',
        },
      };
      updateResident(updated);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <span>日々のバイタル実測＆介護経過記録（日誌）</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            ケアスタッフや看護・リハ職が訪室時に測定したバイタル値と日々の観察記録
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>日々の記録・実測バイタルを入力</span>
        </button>
      </div>

      {/* タイムラインリスト */}
      <div className="space-y-4">
        {records.map((rec) => (
          <div
            key={rec.id}
            className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5 hover:bg-white hover:border-emerald-300 transition-all"
          >
            {/* 記録日時 & 記録者 */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {rec.recordedAt}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                  {rec.staffName}
                </span>
              </div>
            </div>

            {/* 実測バイタルバッジ一覧 */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {rec.bloodPressureSys && rec.bloodPressureDia && (
                <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold">
                  血圧: {rec.bloodPressureSys}/{rec.bloodPressureDia} mmHg
                </span>
              )}
              {rec.heartRate && (
                <span className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-bold flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-500" />
                  {rec.heartRate} bpm
                </span>
              )}
              {rec.temperature && (
                <span className="px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 font-bold flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-orange-500" />
                  {rec.temperature} ℃
                </span>
              )}
              {rec.spo2 && (
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-bold flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-blue-500" />
                  SpO2: {rec.spo2}%
                </span>
              )}
              {rec.respirationRate && (
                <span className="px-2.5 py-1 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-700 font-bold">
                  呼吸: {rec.respirationRate}/分
                </span>
              )}
            </div>

            {/* 食事・排泄状況 */}
            {(rec.mealIntake || rec.waterIntakeMl || rec.excretionNote) && (
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
                {rec.mealIntake && <span>🍽️ {rec.mealIntake}</span>}
                {rec.waterIntakeMl && <span>💧 水分: {rec.waterIntakeMl}ml</span>}
                {rec.excretionNote && <span>🚽 {rec.excretionNote}</span>}
              </div>
            )}

            {/* 経過観察・メモ */}
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              {rec.notes}
            </p>
          </div>
        ))}
      </div>

      {/* 入力モーダル */}
      <VitalRecordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resident={resident}
        onSave={handleSaveRecord}
      />
    </div>
  );
};
