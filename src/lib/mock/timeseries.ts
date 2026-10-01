import { VitalTimeSeriesPoint } from '../types';

export type TimeRange = '24h' | '3d' | '7d';

export function generateTimeSeriesData(residentId: string, range: TimeRange): VitalTimeSeriesPoint[] {
  const points: VitalTimeSeriesPoint[] = [];
  const now = new Date('2026-09-30T12:00:00');

  let hoursCount = 24;
  let intervalHours = 1;

  if (range === '3d') {
    hoursCount = 72;
    intervalHours = 3;
  } else if (range === '7d') {
    hoursCount = 168;
    intervalHours = 6;
  }

  const isSato = residentId === 'res-001';
  const isTanaka = residentId === 'res-002';
  const isKobayashi = residentId === 'res-005';

  for (let i = hoursCount; i >= 0; i -= intervalHours) {
    const d = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = d.getHours();
    const day = d.getDate();
    const month = d.getMonth() + 1;

    let timeLabel = `${String(hour).padStart(2, '0')}:00`;
    if (range !== '24h') {
      timeLabel = `${month}/${day} ${String(hour).padStart(2, '0')}:00`;
    }

    const timestamp = d.toISOString();

    // デフォルト安静時ベースライン
    let hr = 68;
    let rr = 16;
    let temp = 36.4;
    let activity = (hour >= 7 && hour <= 20) ? Math.floor(25 + Math.sin(hour) * 20) : Math.floor(5 + Math.random() * 8);
    let isOutOfBed = false;
    let eventNote: string | undefined = undefined;

    // 佐藤様：深夜2時〜4時に心拍数が+15〜22bpm上昇（心不全初期 or 脱水兆候）
    if (isSato) {
      hr = 66;
      rr = 16;
      temp = 36.3;
      if (hour >= 2 && hour <= 4) {
        hr = 85 + Math.floor(Math.random() * 8); // 85-92bpm
        rr = 20 + Math.floor(Math.random() * 3);
        activity = 12;
        eventNote = '夜間帯：安静時心拍上昇 (+19bpm)';
      } else if (hour >= 10 && hour <= 12) {
        hr = 74;
        activity = 38;
      }
    } else if (isTanaka) {
      // 田中様：深夜の起き上がり・離床頻発
      hr = 72;
      rr = 18;
      temp = 36.5;
      if (hour === 1 || hour === 3 || hour === 5) {
        isOutOfBed = true;
        activity = 65;
        hr = 95 + Math.floor(Math.random() * 6);
        eventNote = '夜間離床センサー作動';
      }
    } else if (isKobayashi) {
      // 小林様：直近半日で心拍数・体温急増（発熱・頻脈）
      hr = 78;
      rr = 18;
      temp = 36.6;
      if (i <= 6) {
        hr = 118 + Math.floor(Math.random() * 8);
        rr = 25 + Math.floor(Math.random() * 3);
        temp = 37.4;
      }
    } else {
      // その他安定
      const noise = Math.floor(Math.sin(i) * 4);
      hr += noise;
      rr += Math.floor(Math.sin(i * 0.5) * 2);
    }

    // 生活バイタル（食事・水分・活気度）の計算
    // 日数が経過する（直近に近づく i が小さくなる）につれての臨床トレンド
    let meal = 80;
    let water = 1250;
    let vitality = 4;

    if (isSato) {
      // 佐藤様：水分・食事・活気が直近に向かって低下傾向
      const daysAgo = i / 24;
      if (daysAgo <= 1) {
        meal = 45 + (hour === 8 || hour === 12 || hour === 18 ? 5 : 0);
        water = 820;
        vitality = 2; // 反応鈍い・やや傾眠
      } else if (daysAgo <= 2) {
        meal = 65;
        water = 1050;
        vitality = 3; // やや活気低下
      } else {
        meal = 85;
        water = 1350;
        vitality = 4; // 普段通り
      }
    } else if (isKobayashi) {
      // 小林様：直近の発熱に伴い活気・食事急低下
      if (i <= 12) {
        meal = 20;
        water = 600;
        vitality = 1; // ぐったり
      } else {
        meal = 60;
        water = 1000;
        vitality = 3;
      }
    } else {
      // 通常
      meal = Math.max(50, Math.min(100, Math.floor(75 + Math.sin(i * 0.2) * 15)));
      water = Math.max(900, Math.min(1600, Math.floor(1300 + Math.sin(i * 0.3) * 250)));
      vitality = Math.max(3, Math.min(5, Math.floor(4 + Math.sin(i * 0.1))));
    }

    points.push({
      timestamp,
      timeLabel,
      heartRate: hr,
      respirationRate: rr,
      temperature: Number(temp.toFixed(1)),
      activityLevel: activity,
      isOutOfBed,
      eventNote,
      mealPercentage: meal,
      waterIntakeMl: water,
      vitalityScore: vitality,
    });
  }

  return points;
}
