import { NextRequest, NextResponse } from 'next/server';
import { db, isFirebaseConfigured } from '@/lib/firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { CURRENT_ORGANIZATION, INITIAL_FACILITIES } from '@/lib/mock/facilities';
import { INITIAL_RESIDENTS } from '@/lib/mock/residents';
import { generateTimeSeriesData } from '@/lib/mock/timeseries';

export async function POST(req: NextRequest) {
  try {
    const results = {
      organization: CURRENT_ORGANIZATION,
      facilitiesCount: INITIAL_FACILITIES.length,
      residentsCount: INITIAL_RESIDENTS.length,
      syncedToFirebase: false,
      message: '',
    };

    if (isFirebaseConfigured) {
      // 1. 管理者（自社本部）の登録
      await setDoc(doc(db, 'organizations', CURRENT_ORGANIZATION.id), CURRENT_ORGANIZATION, { merge: true });

      // 2. 事業所の登録
      for (const fac of INITIAL_FACILITIES) {
        await setDoc(doc(db, 'facilities', fac.id), fac, { merge: true });
      }

      // 3. 利用者データの登録
      for (const res of INITIAL_RESIDENTS) {
        await setDoc(doc(db, 'residents', res.id), res, { merge: true });
        
        // 直近3日間の時系列バイタルデータもサブコレクションに格納
        const timeSeries = generateTimeSeriesData(res.id, '3d');
        await setDoc(doc(db, 'residents', res.id, 'vital_logs', 'recent_3d'), {
          residentId: res.id,
          updatedAt: new Date().toISOString(),
          points: timeSeries,
        }, { merge: true });
      }

      results.syncedToFirebase = true;
      results.message = 'Firestoreへの3層構造データ（自社・事業所3拠点・利用者6名）の格納に成功しました！';
    } else {
      results.message = 'Firebase環境変数が未設定のため、ローカルデータ構造の準備が完了しました。Firebaseプロジェクト接続後に自動反映されます。';
    }

    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Firebase Seed Error:', error);
    return NextResponse.json({
      error: error.message || 'Firebaseへのデータ格納中にエラーが発生しました',
      hint: 'Firebaseのプロジェクト設定やFirestoreセキュリティルールを確認してください。',
    }, { status: 500 });
  }
}
