export interface Household {
  id: number; // 對應地圖上的編號 1-41
  name: string; // 戶長姓名或代稱
  phone: string;
  address: string;
  notes: string;
}

export interface VisitRecord {
  id: string;
  householdId: number;
  date: string;
  visitors: string; // 訪視人員
  content: string; // 訪視內容
}

export interface MapCoordinate {
  id: number;
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
}