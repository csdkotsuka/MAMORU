'use client';

import React, { useState, useEffect } from 'react';
import { X, ClipboardEdit, Heart, Wind, Thermometer, Activity, Droplets, Check, AlertCircle } from 'lucide-react';
import { DailyCareRecord, Resident } from '@/lib/types';

interface VitalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  resident: Resident;
  onSave: (record: DailyCareRecord) => void;
}

export const VitalRecordModal: React.FC<VitalRecordModalProps> = ({
  isOpen,
  onClose,
  resident,
  onSave,
}) => {
  const nowStr = new Date().toLocaleString('ja-JP', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  const [staffName, setStaffName] = useState('大塚 PT');
  const [temperature, setTemperature] = useState<number | ''>(resident.currentVital.temperature);
  const [bloodPressureSys, setBloodPressureSys] = useState<number | ''>(128);
  const [bloodPressureDia, setBloodPressureDia] = useState<number | ''>(76);
  const [heartRate, setHeartRate] = useState<number | ''>(resident.currentVital.heartRate);
  const [spo2, setSpo2] = useState<number | ''>(97);
  const [respirationRate, setRespirationRate] = useState<number | ''>(resident.currentVital.respirationRate);

  const [mealIntake, setMealIntake] = useState('主食全量 / 副食9割');
  const [mealPercentage, setMealPercentage] = useState<number>(90);
  const [waterIntakeMl, setWaterIntakeMl] = useState<number | ''>(200);
  const [vitalityScore, setVitalityScore] = useState<number>(4);
  const [excretionNote, setExcretionNote] = useState('排尿正常、排便あり(普通便)');
  const [notes, setNotes] = useState('リハビリ前バイタル測定。自覚症状なし。歩行器歩行訓練を無理のない範囲で実施。');

  // ESCキーで閉じる
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const record: DailyCareRecord = {
      id: `rec-${Date.now()}`,
      residentId: resident.id,
      recordedAt: nowStr,
      staffName,
      temperature: temperature === '' ? undefined : Number(temperature),
      bloodPressureSys: bloodPressureSys === '' ? undefined : Number(bloodPressureSys),
      bloodPressureDia: bloodPressureDia === '' ? undefined : Number(bloodPressureDia),
      heartRate: heartRate === '' ? undefined : Number(heartRate),
      respirationRate: respirationRate === '' ? undefined : Number(respirationRate),
      spo2: spo2 === '' ? undefined : Number(spo2),
      mealPercentage: Number(mealPercentage),
      mealIntake,
      waterIntakeMl: waterIntakeMl === '' ? undefined : Number(waterIntakeMl),
      vitalityScore: Number(vitalityScore),
      excretionNote,
      notes,
    };

    onSave(record);
    onClose();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 cursor-default"
      >
        {/* モーダルヘッダー */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ClipboardEdit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">
                日々のバイタル・介護記録の入力
              </h3>
              <p className="text-xs text-slate-500">
                {resident.roomNumber} {resident.name} 様 ({resident.careLevel})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 記録者情報 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">記録スタッフ名 *</label>
              <input
                type="text"
                required
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                placeholder="例: 佐々木 看護師 / 大塚 PT"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">記録日時</label>
              <input
                type="text"
                readOnly
                value={nowStr}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-500 outline-none"
              />
            </div>
          </div>

          {/* 1. 実測バイタル値 */}
          <div className="space-y-3 bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100">
            <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>1. 実測バイタルサイン測定値</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* 体温 */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-orange-500" /> 実測体温 (℃)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold"
                  placeholder="36.5"
                />
              </div>

              {/* 血圧 */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  血圧 (上 / 下 mmHg)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={bloodPressureSys}
                    onChange={(e) => setBloodPressureSys(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-1/2 px-2.5 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-center"
                    placeholder="120"
                  />
                  <span className="text-slate-400">/</span>
                  <input
                    type="number"
                    value={bloodPressureDia}
                    onChange={(e) => setBloodPressureDia(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-1/2 px-2.5 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-center"
                    placeholder="80"
                  />
                </div>
              </div>

              {/* 脈拍/心拍数 */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-500" /> 脈拍/心拍 (bpm)
                </label>
                <input
                  type="number"
                  value={heartRate}
                  onChange={(e) => setHeartRate(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold"
                  placeholder="72"
                />
              </div>

              {/* SpO2 */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-blue-500" /> SpO2 (%)
                </label>
                <input
                  type="number"
                  value={spo2}
                  onChange={(e) => setSpo2(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold"
                  placeholder="98"
                />
              </div>

              {/* 呼吸数 */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <Wind className="w-3 h-3 text-cyan-500" /> 呼吸数 (/分)
                </label>
                <input
                  type="number"
                  value={respirationRate}
                  onChange={(e) => setRespirationRate(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold"
                  placeholder="16"
                />
              </div>
            </div>
          </div>

          {/* 2. 食事・水分・排泄 */}
          {/* 2. 食事・水分・活気度・排泄 */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">2. 食事・水分・活気レベル・排泄</h4>

            {/* 活気・表情レベル 5段階スケール */}
            <div className="bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200/80 space-y-2">
              <label className="block text-xs font-bold text-amber-900 flex items-center justify-between">
                <span>活気・表情・反応レベル（客観スケール）*</span>
                <span className="text-[11px] text-amber-700 font-semibold">選択中: レベル {vitalityScore}</span>
              </label>
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {[
                  { score: 5, emoji: '😊', label: '笑顔・良好' },
                  { score: 4, emoji: '🙂', label: '普段通り' },
                  { score: 3, emoji: '😐', label: '傾眠・低下' },
                  { score: 2, emoji: '🙁', label: '反応鈍い' },
                  { score: 1, emoji: '😴', label: '無反応' },
                ].map((item) => (
                  <button
                    key={item.score}
                    type="button"
                    onClick={() => setVitalityScore(item.score)}
                    className={`p-2 rounded-xl text-center border transition-all ${
                      vitalityScore === item.score
                        ? 'bg-amber-500 text-white font-bold border-amber-600 shadow-sm scale-105'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50'
                    }`}
                  >
                    <div className="text-xl sm:text-2xl">{item.emoji}</div>
                    <div className="text-[10px] mt-0.5 leading-tight font-medium">{item.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>食事摂取割合 ({mealPercentage}%)</span>
                  <span className="text-[11px] text-slate-400 font-normal">0〜100%</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    value={mealPercentage}
                    onChange={(e) => setMealPercentage(Number(e.target.value))}
                    className="flex-1 accent-emerald-600"
                  />
                  <input
                    type="text"
                    value={mealIntake}
                    onChange={(e) => setMealIntake(e.target.value)}
                    placeholder="主食全量/副食8割"
                    className="w-1/2 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">水分摂取量 (ml)</label>
                <input
                  type="number"
                  value={waterIntakeMl}
                  onChange={(e) => setWaterIntakeMl(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="200"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">排泄状況</label>
              <input
                type="text"
                value={excretionNote}
                onChange={(e) => setExcretionNote(e.target.value)}
                placeholder="例: 排便あり(普通便)、尿量十分"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* 3. 経過観察・介護記録メモ */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">3. 経過観察メモ（介護日誌・申し送り）</h4>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="訪室時のご様子、会話内容、リハビリ実施状況、気になる変化などをご記入ください。"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* フッターボタン */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Check className="w-4 h-4" />
              <span>日誌・バイタルを記録する</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
