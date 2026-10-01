import { Organization, Facility } from '../types';

export const CURRENT_ORGANIZATION: Organization = {
  id: 'org-mamoru-hq',
  name: '株式会社MAMORUヘルスケア (自社・本部統轄)',
  plan: 'Enterprise',
  contactEmail: 'admin@mamoru-care.jp',
  totalFacilitiesCount: 3,
  totalSensorsCount: 98,
};

export const INITIAL_FACILITIES: Facility[] = [
  {
    id: 'fac-001',
    organizationId: 'org-mamoru-hq',
    name: 'さくら介護老人保健施設',
    type: '老健',
    address: '東京都杉並区高井戸東2-14-5',
    phone: '03-3333-1111',
    managerName: '木村 恵美 (施設長)',
    floors: ['1F デイケア', '2F 一般療養棟', '3F 認知症専門棟'],
    totalBeds: 50,
    activeSensors: 48,
  },
  {
    id: 'fac-002',
    organizationId: 'org-mamoru-hq',
    name: 'ひまわり訪問看護ステーション',
    type: '訪問看護ステーション',
    address: '東京都世田谷区北沢3-2-1',
    phone: '03-5454-2222',
    managerName: '斉藤 陽子 (所長/看護師)',
    floors: ['世田谷中央エリア', '北沢・代沢エリア'],
    totalBeds: 30,
    activeSensors: 30,
  },
  {
    id: 'fac-003',
    organizationId: 'org-mamoru-hq',
    name: 'グループホーム MAMORU吉祥寺',
    type: 'グループホーム',
    address: '東京都武蔵野市吉祥寺本町1-8-9',
    phone: '0422-22-3333',
    managerName: '高橋 健治 (管理者)',
    floors: ['1ユニット (花)', '2ユニット (月)'],
    totalBeds: 18,
    activeSensors: 18,
  }
];
