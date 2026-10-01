import { NextRequest, NextResponse } from 'next/server';
import { db, isFirebaseConfigured } from '@/lib/firebase/config';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { CURRENT_ORGANIZATION, INITIAL_FACILITIES } from '@/lib/mock/facilities';
import { INITIAL_RESIDENTS } from '@/lib/mock/residents';
import { generateTimeSeriesData } from '@/lib/mock/timeseries';

export async function POST(req: NextRequest) {
  try {
    let customConfig = null;
    try {
      const body = await req.json();
      if (body?.apiKey && body?.projectId) {
        customConfig = body;
      }
    } catch (_) {}

    let targetDb = db;

    // リクエストで直接Firebase設定が渡された場合は動的に初期化
    if (customConfig) {
      const appName = `seed-app-${Date.now()}`;
      const app = initializeApp(customConfig, appName);
      targetDb = getFirestore(app);
    } else if (!isFirebaseConfigured) {
      return NextResponse.json({
        syncedToFirebase: false,
        error: 'FIREBASE_NOT_CONFIGURED',
        message: 'Firebase接続情報が未設定です。Vercelの環境変数に設定するか、下の設定欄に直接貼り付けて「直接投入」を実行してください。',
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '(未設定)',
      }, { status: 400 });
    }

    // 1. 管理者（自社本部）の登録
    await setDoc(doc(targetDb, 'organizations', CURRENT_ORGANIZATION.id), CURRENT_ORGANIZATION, { merge: true });

    // 2. 事業所の登録
    for (const fac of INITIAL_FACILITIES) {
      await setDoc(doc(targetDb, 'facilities', fac.id), fac, { merge: true });
    }

    // 3. 利用者データの登録
    for (const res of INITIAL_RESIDENTS) {
      await setDoc(doc(targetDb, 'residents', res.id), res, { merge: true });
      
      // 直近3日間の時系列バイタルデータもサブコレクションに格納
      const timeSeries = generateTimeSeriesData(res.id, '3d');
      await setDoc(doc(targetDb, 'residents', res.id, 'vital_logs', 'recent_3d'), {
        residentId: res.id,
        updatedAt: new Date().toISOString(),
        points: timeSeries,
      }, { merge: true });
    }

    return NextResponse.json({
      syncedToFirebase: true,
      message: '🎉 Firestoreへの3層構造データ（自社本部・事業所3拠点・利用者6名・時系列ログ）の格納に成功しました！Firebaseコンソールを更新してご確認ください。',
      organization: CURRENT_ORGANIZATION,
      facilitiesCount: INITIAL_FACILITIES.length,
      residentsCount: INITIAL_RESIDENTS.length,
    });

  } catch (error: any) {
    console.error('Firebase Seed Error:', error);
    let hint = 'Firebaseの設定値を確認してください。';
    if (error.code === 'permission-denied') {
      hint = 'Firestoreのセキュリティルールで拒否されました。Firebase Console > Firestore > 「ルール」タブで「allow read, write: if true;」に変更してください。';
    } else if (error.code === 'not-found' || error.message?.includes('database')) {
      hint = 'Firestoreデータベースがまだ作成されていません。Firebase Console > 「Firestore Database」を開き、「データベースの作成」を実行してください。';
    }

    return NextResponse.json({
      syncedToFirebase: false,
      error: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'Firebaseへのデータ格納中にエラーが発生しました',
      hint,
    }, { status: 500 });
  }
}
