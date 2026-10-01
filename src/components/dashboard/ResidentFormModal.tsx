'use client';

import React, { useState } from 'react';
import { X, UserPlus, Heart, Wind, Thermometer, Building2, Activity, Check } from 'lucide-react';
import { Resident, CareLevel, Facility } from '@/lib/types';
import { INITIAL_FACILITIES } from '@/lib/mock/facilities';

interface ResidentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (resident: Resident) => void;
  initialData?: Resident | null;
}

export const ResidentFormModal: React.FC<ResidentFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [nameKana, setNameKana] = useState(initialData?.nameKana || '');
  const [age, setAge] = useState(initialData?.age || 80);
  const [gender, setGender] = useState<'男性' | '女性'>(initialData?.gender || '女性');
  const [roomNumber, setRoomNumber] = useState(initialData?.roomNumber || '201号室');
  const [facilityId, setFacilityId] = useState(initialData?.facilityId || 'fac-001');
  const [careLevel, setCareLevel] = useState<CareLevel>(initialData?.careLevel || '要介護2');
  const [diagnosisInput, setDiagnosisInput] = useState(initialData?.primaryDiagnosis.join(', ') || '高血圧症, 軽度認知症');
  const [mobilityStatus, setMobilityStatus] = useState(initialData?.mobilityStatus || '歩行器歩行見守り。起立時ふらつき注意。');
  const [notes, setNotes] = useState(initialData?.notes || '夜間頻尿あり。センサー反応時は訪室推奨。');

  // 平常時ベースライン
  const [baselineHr, setBaselineHr] = useState(initialData?.baseline.heartRate || 68);
  const [baselineRr, setBaselineRr] = useState(initialData?.baseline.respirationRate || 16);
  const [baselineTemp, setBaselineTemp] = useState(initialData?.baseline.temperature || 36.4);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const diagnoses = diagnosisInput.split(/[,、]/).map((d) => d.trim()).filter(Boolean);

    const residentData: Resident = {
      id: initialData?.id || `res-${Date.now().toString().slice(-4)}`,
      facilityId,
      name,
      nameKana,
      age: Number(age),
      gender,
      roomNumber,
      careLevel,
      primaryDiagnosis: diagnoses.length > 0 ? diagnoses : ['特記なし'],
      mobilityStatus,
      notes,
      baseline: {
        heartRate: Number(baselineHr),
        respirationRate: Number(baselineRr),
        temperature: Number(baselineTemp),
      },
      currentVital: initialData?.currentVital || {
        heartRate: Number(baselineHr),
        respirationRate: Number(baselineRr),
        temperature: Number(baselineTemp),
        bedStatus: 'IN_BED',
        outOfBedDurationSec: 0,
        status: 'STABLE',
        updatedAt: 'たった今',
        hasApneaWarning: false,
      },
      recentAlerts: initialData?.recentAlerts || [],
    };

    onSave(residentData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
        {/* モーダルヘッダー */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">
                {initialData ? '利用者情報の編集' : '新規利用者の登録'}
              </h3>
              <p className="text-xs text-slate-500">
                バイタル基準値（平常時ベースライン）と介護・リハビリ特記事項を設定
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

        {/* 入力フォーム */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本情報 */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">1. 基本情報</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">氏名 *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例: 佐藤 正男"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ふりがな</label>
                <input
                  type="text"
                  value={nameKana}
                  onChange={(e) => setNameKana(e.target.value)}
                  placeholder="例: さとう まさお"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">年齢</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">性別</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="男性">男性</option>
                  <option value="女性">女性</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">居室/部屋番号</label>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="例: 203号室"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">要介護度</label>
                <select
                  value={careLevel}
                  onChange={(e) => setCareLevel(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="要支援1">要支援1</option>
                  <option value="要支援2">要支援2</option>
                  <option value="要介護1">要介護1</option>
                  <option value="要介護2">要介護2</option>
                  <option value="要介護3">要介護3</option>
                  <option value="要介護4">要介護4</option>
                  <option value="要介護5">要介護5</option>
                </select>
              </div>
            </div>

            {/* 所属事業所 */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">所属事業所（第2層）</label>
              <select
                value={facilityId}
                onChange={(e) => setFacilityId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {INITIAL_FACILITIES.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 平常安静時ベースライン（AI解析の基準） */}
          <div className="space-y-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
            <div className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-blue-600" />
              <h4 className="text-xs font-bold text-blue-900">
                2. 平常安静時ベースライン（AI予兆検知の基準値）
              </h4>
            </div>
            <p className="text-[11px] text-slate-500">
              ※ 夜間AI解析は、この「平常時の数値」からの乖離幅（+15%など）を検出して急変アラートを出します。
            </p>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-500" /> 平常心拍数 (bpm)
                </label>
                <input
                  type="number"
                  value={baselineHr}
                  onChange={(e) => setBaselineHr(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <Wind className="w-3 h-3 text-cyan-500" /> 平常呼吸数 (/分)
                </label>
                <input
                  type="number"
                  value={baselineRr}
                  onChange={(e) => setBaselineRr(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-orange-400" /> 平熱 (℃)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={baselineTemp}
                  onChange={(e) => setBaselineTemp(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold"
                />
              </div>
            </div>
          </div>

          {/* 臨床・リハビリ特記 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">3. 臨床・PT移動能力</h4>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">主病名・既往歴（カンマ区切り）</label>
              <input
                type="text"
                value={diagnosisInput}
                onChange={(e) => setDiagnosisInput(e.target.value)}
                placeholder="例: うっ血性心不全, 脳梗塞後遺症, 誤嚥性肺炎既往"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">PT視点の移動能力・立位歩行状況</label>
              <input
                type="text"
                value={mobilityStatus}
                onChange={(e) => setMobilityStatus(e.target.value)}
                placeholder="例: 車椅子自走、起立時ふらつきあり見守り要"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">特記事項・夜間見守りメモ</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="例: 独力で立ち上がろうとする傾向あり。センサー反応時は即時訪室。"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* ボタン */}
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
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Check className="w-4 h-4" />
              <span>{initialData ? '変更を保存する' : '登録を完了する'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
