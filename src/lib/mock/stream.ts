import { Resident, CurrentVital, BedStatus, VitalStatus } from '../types';
import { INITIAL_RESIDENTS } from './residents';

// シミュレータの内部ステート（メモリ上保持）
let residentsState: Resident[] = JSON.parse(JSON.stringify(INITIAL_RESIDENTS));
let listeners: Array<(residents: Resident[]) => void> = [];
let streamInterval: NodeJS.Timeout | null = null;

export function getResidents(): Resident[] {
  return residentsState;
}

export function getResidentById(id: string): Resident | undefined {
  return residentsState.find((r) => r.id === id);
}

export function subscribeToResidents(callback: (residents: Resident[]) => void): () => void {
  listeners.push(callback);
  callback(residentsState);

  // 初回購読時にストリーム開始
  if (!streamInterval) {
    startMockStream();
  }

  return () => {
    listeners = listeners.filter((l) => l !== callback);
    if (listeners.length === 0 && streamInterval) {
      clearInterval(streamInterval);
      streamInterval = null;
    }
  };
}

function notifyListeners() {
  const cloned = JSON.parse(JSON.stringify(residentsState));
  listeners.forEach((callback) => callback(cloned));
}

function startMockStream() {
  if (streamInterval) return;

  streamInterval = setInterval(() => {
    // 各利用者のバイタルにわずかな生体ゆらぎ（±1-2bpm）を付与
    residentsState = residentsState.map((res) => {
      // 離床中の場合は秒数カウントアップ
      let outOfBedDuration = res.currentVital.outOfBedDurationSec;
      if (res.currentVital.bedStatus === 'OUT_OF_BED') {
        outOfBedDuration += 3;
      }

      // ゆらぎ計算
      const hrFluctuation = Math.floor(Math.random() * 3) - 1; // -1, 0, +1
      const rrFluctuation = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;

      const newHr = Math.max(45, Math.min(140, res.currentVital.heartRate + hrFluctuation));
      const newRr = Math.max(8, Math.min(35, res.currentVital.respirationRate + rrFluctuation));

      // ステータス再判定
      let status: VitalStatus = 'STABLE';
      if (newHr >= 120 || newHr <= 50 || res.currentVital.hasApneaWarning || (res.currentVital.bedStatus === 'OUT_OF_BED' && outOfBedDuration >= 10)) {
        status = 'CRITICAL';
      } else if (newHr >= 85 || newRr >= 22 || res.currentVital.bedStatus === 'SITTING_EDGE' || res.currentVital.temperature >= 37.0) {
        status = 'CAUTION';
      }

      return {
        ...res,
        currentVital: {
          ...res.currentVital,
          heartRate: newHr,
          respirationRate: newRr,
          outOfBedDurationSec: outOfBedDuration,
          status,
          updatedAt: 'たった今',
        },
      };
    });

    notifyListeners();
  }, 3000);
}

// デモ・実証用：シミュレーション操作関数
export function simulateEvent(
  residentId: string, 
  eventType: 'TACHYCARDIA' | 'OUT_OF_BED' | 'APNEA' | 'RESET_NORMAL'
) {
  residentsState = residentsState.map((res) => {
    if (res.id !== residentId) return res;

    let updatedVital: CurrentVital = { ...res.currentVital };
    let updatedAlerts = [...res.recentAlerts];
    const nowTime = new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });

    if (eventType === 'TACHYCARDIA') {
      // 心拍数125bpm（高頻脈緊急アラート）
      updatedVital.heartRate = 126;
      updatedVital.status = 'CRITICAL';
      updatedAlerts.unshift({
        id: `alt-${Date.now()}`,
        timestamp: nowTime,
        type: 'HEART_RATE_HIGH',
        message: '心拍数急変: 126bpm（120以上・頻脈警告）',
        severity: 'CRITICAL',
      });
    } else if (eventType === 'OUT_OF_BED') {
      // 離床（転倒リスク）
      updatedVital.bedStatus = 'OUT_OF_BED';
      updatedVital.outOfBedDurationSec = 15;
      updatedVital.status = 'CRITICAL';
      updatedAlerts.unshift({
        id: `alt-${Date.now()}`,
        timestamp: nowTime,
        type: 'OUT_OF_BED_PROLONGED',
        message: '夜間離床検知（15秒経過・転倒危険）',
        severity: 'CRITICAL',
      });
    } else if (eventType === 'APNEA') {
      // 無呼吸検知
      updatedVital.respirationRate = 0;
      updatedVital.bedStatus = 'NO_MOVEMENT';
      updatedVital.hasApneaWarning = true;
      updatedVital.status = 'CRITICAL';
      updatedAlerts.unshift({
        id: `alt-${Date.now()}`,
        timestamp: nowTime,
        type: 'APNEA',
        message: '無呼吸/体動停止検知（10秒以上停止・至急訪室）',
        severity: 'CRITICAL',
      });
    } else if (eventType === 'RESET_NORMAL') {
      // 正常復帰
      updatedVital = {
        heartRate: res.baseline.heartRate,
        respirationRate: res.baseline.respirationRate,
        temperature: res.baseline.temperature,
        bedStatus: 'IN_BED',
        outOfBedDurationSec: 0,
        status: 'STABLE',
        updatedAt: 'たった今',
        hasApneaWarning: false,
      };
      updatedAlerts = [];
    }

    return {
      ...res,
      currentVital: updatedVital,
      recentAlerts: updatedAlerts,
    };
  });

  notifyListeners();
}

// 新規利用者の追加
export function addResident(newResident: Resident) {
  residentsState.unshift(newResident);
  notifyListeners();

  // Firestore連携が有効なら非同期で同期
  if (typeof window !== 'undefined') {
    import('@/lib/firebase/config').then(({ db, isFirebaseConfigured }) => {
      if (isFirebaseConfigured) {
        import('firebase/firestore').then(({ doc, setDoc }) => {
          setDoc(doc(db, 'residents', newResident.id), newResident, { merge: true }).catch(console.error);
        });
      }
    }).catch(console.error);
  }
}

// 利用者情報の更新
export function updateResident(updatedResident: Resident) {
  residentsState = residentsState.map((r) => (r.id === updatedResident.id ? updatedResident : r));
  notifyListeners();

  if (typeof window !== 'undefined') {
    import('@/lib/firebase/config').then(({ db, isFirebaseConfigured }) => {
      if (isFirebaseConfigured) {
        import('firebase/firestore').then(({ doc, setDoc }) => {
          setDoc(doc(db, 'residents', updatedResident.id), updatedResident, { merge: true }).catch(console.error);
        });
      }
    }).catch(console.error);
  }
}

