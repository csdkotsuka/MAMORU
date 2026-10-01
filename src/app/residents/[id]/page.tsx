import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getResidentById, getResidents } from '@/lib/mock/stream';
import { PatientProfile } from '@/components/detail/PatientProfile';
import { TimeSeriesGraph } from '@/components/detail/TimeSeriesGraph';
import { CareRecordTimeline } from '@/components/detail/CareRecordTimeline';
import { AIAnalyzer } from '@/components/detail/AIAnalyzer';
import { ArrowLeft } from 'lucide-react';

export const dynamicParams = true;

interface ResidentPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const residents = getResidents();
  return residents.map((r) => ({ id: r.id }));
}

export default async function ResidentDetailPage({ params }: ResidentPageProps) {
  const { id } = await params;
  const resident = getResidentById(id);

  if (!resident) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* ナビゲーションバー / パンくず */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-blue-600 hover:border-blue-300 shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>監視ダッシュボード一覧へ戻る</span>
        </Link>

        <div className="text-xs text-slate-400 font-mono">
          ID: {resident.id} | 更新: {resident.currentVital.updatedAt}
        </div>
      </div>

      {/* 患者プロファイルヘッダー */}
      <PatientProfile resident={resident} />

      {/* 詳細セクション群 */}
      <div className="space-y-6">
        {/* 機能②：時系列データグラフ表示 */}
        <TimeSeriesGraph resident={resident} />

        {/* 日々のバイタル実測＆介護経過記録（日誌） */}
        <CareRecordTimeline resident={resident} />

        {/* 機能③：AIによる時系列アセスメント（予兆検知）生成エンジン */}
        <AIAnalyzer resident={resident} />
      </div>
    </div>
  );
}
