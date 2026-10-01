'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  Heart,
  ShieldCheck,
  Brain,
  Building2,
  Clock,
  CheckCircle2,
  ArrowRight,
  BedDouble,
  FileText,
  Users,
  Sparkles,
  HelpCircle,
  Eye,
  Check,
  ChevronRight
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-16 py-4 max-w-5xl mx-auto text-slate-800">
      {/* ヒーローセクション：ゆとりと安心感のあるデザイン */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50/90 via-sky-50/60 to-emerald-50/70 border border-blue-100/80 p-8 sm:p-12 shadow-sm">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-blue-200/80 text-blue-800 text-xs sm:text-sm font-semibold shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>介護施設・在宅ケア向け 次世代見守りプラットフォーム</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            見守る安心を、<br className="hidden sm:inline" />
            すべての現場スタッフと<br className="hidden sm:inline" />
            利用者様へ。
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
            <strong className="text-blue-900 font-bold">MAMORU（マモル）</strong>は、非接触IoTセンサーと時系列AIを融合したバイタル監視システムです。<br />
            元理学療法士の現場視点から、多忙なケアスタッフが「直感的にリスクを把握でき、介護記録までスムーズに完結できる」優しい設計を追求しました。
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm sm:text-base shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>実際の監視デモ画面を体験する</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300/80 text-slate-700 font-bold text-sm transition-all"
            >
              <Building2 className="w-4 h-4 text-slate-500" />
              <span>本部・事業所管理画面（自社）</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 現場の3大課題とMAMORUによる解決（Before / After） */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-blue-700 tracking-wider uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            現場の課題解決
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            介護・リハビリ現場の「困った」を解消します
          </h2>
          <p className="text-sm text-slate-500">
            センサーの数値をただ画面に出すだけではなく、スタッフの不安や業務負担を減らす工夫を詰め込みました。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* 課題1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <BedDouble className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">
                夜間の転倒リスクと<br />見守り巡回の負担
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                「起き上がった瞬間に気づけず転倒してしまうかも」「何度も居室を開けて睡眠を妨げてしまう」という夜勤スタッフの不安。
              </p>
            </div>
            <div className="bg-emerald-50/70 border border-emerald-200/70 p-3.5 rounded-xl space-y-1">
              <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>MAMORUで解決</span>
              </div>
              <p className="text-xs text-emerald-950 font-medium">
                ベッド端座位・離床をリアルタイム検知。立ち上がる前の段階でスタッフにお知らせし、訪室タイミングを逃しません。
              </p>
            </div>
          </div>

          {/* 課題2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">
                バイタルの微細な変化や<br />急変予兆の見逃し
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                測定時の一時的な数値は平常に見えても、実は深夜帯に心拍数がじわじわ上昇しているなど、隠れた予兆は見落とされがちです。
              </p>
            </div>
            <div className="bg-emerald-50/70 border border-emerald-200/70 p-3.5 rounded-xl space-y-1">
              <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>MAMORUで解決</span>
              </div>
              <p className="text-xs text-emerald-950 font-medium">
                時系列AIが「深夜2時〜4時の平常ベースラインからの乖離」を自動検出。脱水や心不全、微熱の兆候を早期にアラートします。
              </p>
            </div>
          </div>

          {/* 課題3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">
                介護記録・申し送りの<br />入力業務に時間がかかる
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                データを見ながら「日誌にどう文章化するか」を考える負担が大きく、記録作成のために残業が発生してしまう現状。
              </p>
            </div>
            <div className="bg-emerald-50/70 border border-emerald-200/70 p-3.5 rounded-xl space-y-1">
              <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>MAMORUで解決</span>
              </div>
              <p className="text-xs text-emerald-950 font-medium">
                AIがそのまま介護日誌や申し送りに転載できるフォーマット文を自動作成。「日誌用にコピー」でワンクリック貼り付け可能です。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MAMORUの4大機能 */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-indigo-700 tracking-wider uppercase bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            機能の特長
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            現場で無理なく使える4つの機能
          </h2>
          <p className="text-sm text-slate-500">
            ITに不慣れなスタッフでも迷わない、目に優しく落ち着いた画面デザインです。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 特長1 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-blue-300 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  直感的な3段階トリアージ一覧
                </h3>
                <span className="text-xs text-blue-600 font-semibold">誰が今すぐ対応を必要としているか一目瞭然</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              「緑：安定」「黄：要観察（微熱・脱水疑い）」「赤：警告（高頻脈・離床・無呼吸）」の3色でわかりやすく表示。心拍数に合わせた優しい拍動アニメーションで生体反応の確認も直感的に行えます。
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                安定
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-semibold border border-amber-200">
                要観察
              </span>
              <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 font-semibold border border-red-200">
                警告・急変
              </span>
            </div>
          </div>

          {/* 特長2 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-blue-300 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  時系列バイタル推移グラフ（24h〜7日間）
                </h3>
                <span className="text-xs text-cyan-600 font-semibold">平常安静時ベースラインとの乖離を可視化</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              心拍数・呼吸数・活動量の複合推移をRechartsでグラフ化。利用者ごとの「平常時の心拍ライン」を点線で重ねて表示するため、「いつもより脈が速い」「夜間に動いている」がパッと見て分かります。
            </p>
            <div className="text-xs text-slate-500 font-medium">
              ※ 過去24時間、過去3日間、過去7日間のワンタッチ切り替え対応
            </div>
          </div>

          {/* 特長3 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-blue-300 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  時系列AI予兆検知＆介護日誌自動生成
                </h3>
                <span className="text-xs text-purple-600 font-semibold">PT知見に基づいた臨床推論と記録転記サポート</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              「過去3日間の深夜帯の心拍変化」から脱水や心不全、感染兆候を推測。ケアスタッフやリハ職への具体的な観察指示を提示し、介護日誌にそのまま貼れるテキストを自動生成します。
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-600 font-mono">
              【フォーマット】リスクレベル / 変化の分析 / 推測される状態・対策 / 介護記録テキスト
            </div>
          </div>

          {/* 特長4 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-blue-300 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  自社本部・事業所・利用者の3層管理構造
                </h3>
                <span className="text-xs text-indigo-600 font-semibold">複数施設や訪問看護ステーションを一元統轄</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              本部管理者は全事業所の稼働センサーやアラート状況を横断モニタリング。各現場スタッフは自施設の利用者のみを快適に監視できる、マルチテナント設計を採用しています。
            </p>
            <div className="text-xs text-slate-500 font-medium">
              ※ Firebase Firestoreとのシームレスな同期に対応
            </div>
          </div>
        </div>
      </section>

      {/* 導入の流れ */}
      <section className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xs space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            スムーズな導入
          </span>
          <h2 className="text-2xl font-bold text-slate-900">かんたん3ステップで導入完了</h2>
          <p className="text-xs sm:text-sm text-slate-500">大掛かりな配線工事は不要。届いたその日から稼働できます。</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
          <div className="text-center space-y-3 p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-black text-lg mx-auto flex items-center justify-center">
              1
            </div>
            <h4 className="font-bold text-sm text-slate-800">センサーを設置</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              マットレスの下やベッドサイドにセンサーを配置し、電源を入れるだけ。
            </p>
          </div>

          <div className="text-center space-y-3 p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-black text-lg mx-auto flex items-center justify-center">
              2
            </div>
            <h4 className="font-bold text-sm text-slate-800">ブラウザでアクセス</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              スタッフのPC、タブレット、スマートフォンのブラウザを開くだけで即座に連携。
            </p>
          </div>

          <div className="text-center space-y-3 p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-black text-lg mx-auto flex items-center justify-center">
              3
            </div>
            <h4 className="font-bold text-sm text-slate-800">AI見守り開始</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              リアルタイムバイタル監視と夜間のAI予兆検知が自動的にスタートします。
            </p>
          </div>
        </div>
      </section>

      {/* お問い合わせ・デモ案内CTA */}
      <section className="rounded-3xl bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-800 text-white p-8 sm:p-12 text-center space-y-5 shadow-lg shadow-blue-900/10">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          現場の業務負担軽減と安心を、今すぐ体験してください。
        </h2>
        <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto leading-relaxed">
          MAMORUは現在プロトタイプ実証実験中。模擬データによるリアルタイムストリームおよびAIアセスメント生成をWeb上でお試しいただけます。
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-blue-800 font-extrabold text-sm sm:text-base hover:bg-blue-50 transition-all shadow-md hover:scale-105 active:scale-95"
          >
            <span>監視ダッシュボードを操作してみる</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
