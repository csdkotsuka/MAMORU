export type CareLevel = '要支援1' | '要支援2' | '要介護1' | '要介護2' | '要介護3' | '要介護4' | '要介護5';

export type VitalStatus = 'STABLE' | 'CAUTION' | 'CRITICAL';

export type BedStatus = 
  | 'IN_BED'         // 在床（安静中）
  | 'SITTING_EDGE'   // 端座位（起き上がり・見守り要）
  | 'OUT_OF_BED'     // 離床（転倒リスク・徘徊アラート）
  | 'NO_MOVEMENT';   // 体動停止（無呼吸・急変疑い）

export interface VitalBaseline {
  heartRate: number;        // 平常安静時心拍 (例: 68)
  respirationRate: number;  // 平常呼吸数 (例: 16)
  temperature: number;      // 平常体温 (例: 36.4)
}

export interface CurrentVital {
  heartRate: number;
  respirationRate: number;
  temperature: number;
  bedStatus: BedStatus;
  outOfBedDurationSec: number; // 離床継続秒数
  status: VitalStatus;
  updatedAt: string;
  hasApneaWarning?: boolean;   // 無呼吸アラートフラグ
}

export interface AlertEvent {
  id: string;
  timestamp: string;
  type: 'HEART_RATE_HIGH' | 'HEART_RATE_LOW' | 'APNEA' | 'OUT_OF_BED_PROLONGED' | 'FEVER_SUSPECTED';
  message: string;
  severity: 'WARNING' | 'CRITICAL';
}

export interface Resident {
  id: string;
  name: string;
  nameKana: string;
  age: number;
  gender: '男性' | '女性';
  roomNumber: string;
  careLevel: CareLevel;
  primaryDiagnosis: string[];   // 既往症（慢性心不全、脳梗塞、誤嚥性肺炎等）
  mobilityStatus: string;       // PT視点の移動能力（独歩、車椅子自走、要全介助等）
  notes: string;
  avatarUrl?: string;
  baseline: VitalBaseline;
  currentVital: CurrentVital;
  recentAlerts: AlertEvent[];
}

export interface VitalTimeSeriesPoint {
  timestamp: string;      // "2026-09-30 02:00"
  timeLabel: string;      // "02:00"
  heartRate: number;
  respirationRate: number;
  temperature: number;
  activityLevel: number;  // 0 - 100
  isOutOfBed: boolean;
  eventNote?: string;     // アラート注記
}

export interface AIAssessmentResponse {
  residentId: string;
  residentName: string;
  analyzedAt: string;
  riskLevel: '低' | '中' | '高';
  changeAnalysis: string;
  suspectedConditionAndAction: string;
  nursingRecordText: string;
  isMockFallback?: boolean;
}
