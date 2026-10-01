import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { Activity, Building2, Layers, Database, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'MAMORU - 3層構造 IoTセンサー連携＆時系列AIバイタル監視システム',
  description: '自社本部・事業所・利用者の3層管理によるリアルタイムバイタル監視＆時系列AI予兆検知プラットフォーム',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        {/* ヘッダー */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* ロゴ */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <Activity className="w-6 h-6 text-white animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-800 to-cyan-600 bg-clip-text text-transparent">
                      MAMORU
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      3-Tier IoT Care
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium leading-none">
                    本部統轄・事業所・利用者 連携システム
                  </p>
                </div>
              </Link>

              {/* 3層ナビゲーションタブ */}
              <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                <Link
                  href="/about"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>サービス紹介 (PR)</span>
                </Link>
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-all"
                >
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  <span>本部管理（第1層）</span>
                </Link>
                <Link
                  href="/"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-all"
                >
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>事業所監視（第2・3層）</span>
                </Link>
              </nav>
            </div>

            {/* 右側：Firebase & スタッフ情報 */}
            <div className="flex items-center gap-3">
              {/* Firebaseステータスボタン */}
              <Link
                href="/admin"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-semibold transition-colors"
              >
                <Database className="w-3.5 h-3.5 text-amber-600" />
                <span>Firestore同期</span>
              </Link>

              {/* スタッフプロファイル */}
              <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200 text-sm">
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                  PT
                </div>
                <div className="hidden lg:block text-left text-xs">
                  <div className="font-semibold text-slate-800">大塚 理学療法士</div>
                  <div className="text-[11px] text-slate-500">本部リハビリ統轄</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>

        {/* フッター */}
        <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
          <p>© 2026 MAMORU 3-Tier IoT & Clinical AI Platform. Powered by Firebase & Next.js.</p>
        </footer>
      </body>
    </html>
  );
}
