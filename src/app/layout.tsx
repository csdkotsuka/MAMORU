import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { Activity, ShieldCheck, UserCheck, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'MAMORU - IoTセンサー連携＆時系列AIバイタル監視システム',
  description: '在宅介護・施設向けリアルタイムバイタル監視＆時系列AI予兆検知プラットフォーム',
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
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-800 to-cyan-600 bg-clip-text text-transparent">
                    MAMORU
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    IoT & AI Care
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium leading-none">
                  バイタル監視＆急変予兆検知システム
                </p>
              </div>
            </Link>

            {/* ステータスバッジ & スタッフ情報 */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>IoTセンサー稼働中 (6台正常受信)</span>
              </div>

              <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200 text-sm">
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                  PT
                </div>
                <div className="hidden md:block text-left text-xs">
                  <div className="font-semibold text-slate-800">大塚 理学療法士</div>
                  <div className="text-[11px] text-slate-500">2F・3F 見守り担当</div>
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
          <p>© 2026 MAMORU - IoT & AI Clinical Monitoring System. Clinical PT Insights.</p>
        </footer>
      </body>
    </html>
  );
}
