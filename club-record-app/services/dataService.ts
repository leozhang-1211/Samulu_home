// dataService.ts
import { Household, VisitRecord } from '../types';

// 🌟 重要設定：請將下方的網址替換成您 Google Apps Script 的「網頁應用程式網址」
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyxEQhT_cs87LwL3P6wezlxZ7SAXYICBCGlZ2UdXvPJMOJb3ZGNtR4Nn02UCiw1gayeqA/exec'; 

export const dataService = {
  // 1. 取得住戶基本資料
  getHouseholds: async (): Promise<Household[]> => {
    try {
      const res = await fetch(SCRIPT_URL);
      const data = await res.json();
      
      // 將 GAS 回傳的資料，對應到我們新的 Household 格式
      return data.map((item: any) => ({
        id: String(item.id),
        name: item.name || '',
        adults: item.adults || '',
        kids: item.kids || '',
        teens: item.teens || ''
      }));
    } catch (error) {
      console.error("載入住戶資料失敗", error);
      return [];
    }
  },

  // 2. 儲存/更新住戶基本資料
  saveHousehold: async (household: Household): Promise<void> => {
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          id: String(household.id),
          name: household.name,
          adults: household.adults,
          kids: household.kids,
          teens: household.teens,
          history: [] // 僅更新基本資料，不觸碰歷史紀錄
        })
      });
    } catch (error) {
      console.error("儲存住戶資料失敗", error);
    }
  },

  // 3. 取得家訪紀錄
  getRecords: async (householdId?: string | number): Promise<VisitRecord[]> => {
    try {
      const res = await fetch(SCRIPT_URL);
      const data = await res.json();
      let records: VisitRecord[] = [];

      // 將每一戶後方的動態欄位 (history) 壓平，變成 VisitRecord 陣列
      data.forEach((item: any) => {
        if (item.history && Array.isArray(item.history)) {
          item.history.forEach((hist: any, index: number) => {
            records.push({
              id: `${item.id}_${index}`,
              householdId: String(item.id),
              date: hist.title, // Excel 表頭名稱
              visitors: '',     // 預設留空
              content: hist.content
            });
          });
        }
      });

      // 如果有指定 householdId 就過濾，否則回傳全部
      if (householdId !== undefined) {
        return records.filter(r => r.householdId === String(householdId));
      }
      return records;
    } catch (error) {
      console.error("載入紀錄失敗", error);
      return [];
    }
  },

  // 4. 新增一筆家訪紀錄
  addRecord: async (record: Omit<VisitRecord, 'id'>): Promise<void> => {
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          id: String(record.householdId),
          history: [{
            title: record.date, // 利用前端輸入的日期/標題，做為 Excel 新的一欄
            content: record.content
          }]
        })
      });
    } catch (error) {
      console.error("新增紀錄失敗", error);
    }
  }
};