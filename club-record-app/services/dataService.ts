import { Household } from '../types';

// 🌟 這裡使用您原本的 GAS 網址
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby6uHJCyR5xwHNeVnQ_HUjoHmI6xbZZ5XC_3iZqTciQqjOMGBMCAI97z_dHvg3nbx93/exec'; 

export const dataService = {
  // 1. 取得住戶所有資料 (包含基本資料與所有分頁歷史)
  getHouseholds: async (): Promise<Household[]> => {
    try {
      // 加入 cache: 'no-store' 確保每次重整都抓到最新資料，不被瀏覽器暫存干擾
      const res = await fetch(SCRIPT_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error('讀取資料失敗');
      
      const data = await res.json();
      
      // 直接回傳完整資料，不要再把 history 濾掉了
      return data;
    } catch (error) {
      console.error("載入住戶資料失敗", error);
      return [];
    }
  },

  // 2. 儲存/更新住戶資料 (同時更新基本資料與新增的歷史紀錄)
  saveHousehold: async (household: Household): Promise<boolean> => {
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        // 直接將包含最新 history 的整包資料轉為 JSON 送給後端
        body: JSON.stringify(household)
      });
      
      const result = await response.json();
      
      if (result.status === 'error') {
        console.error('GAS 後端回報錯誤:', result.message);
        return false;
      }
      return true;
    } catch (error) {
      console.error("儲存資料失敗", error);
      return false;
    }
  }
};