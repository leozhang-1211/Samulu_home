// types.ts

export interface Household {
  id: string | number; // 🔥 支援 "牧師家" 或數字
  name: string;        // 對應「家名」
  adults: string;      // 對應「大人」 (取代原本的 phone)
  kids: string;        // 對應「小朋友」(取代原本的 address)
  teens: string;       // 對應「大小孩」(取代原本的 notes)
}

export interface VisitRecord {
  id: string;
  householdId: string | number; // 🔥 配合 Household 改為支援字串
  date: string;     // 💡 我們將這個欄位當作 Excel 右側延伸的「標題」(如: "第一週家訪")
  visitors: string; // 訪視人員 (若 Excel 沒有這欄，可以併入內容或留空)
  content: string;  // 對應家訪的文字內容
}

export interface MapCoordinate {
  id: string | number; // 🔥 配合修改
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
}