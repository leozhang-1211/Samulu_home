import { Household, VisitRecord } from '../types';
import { INITIAL_HOUSEHOLDS, INITIAL_RECORDS } from '../constants';

const STORAGE_KEY_HOUSEHOLDS = 'club_households';
const STORAGE_KEY_RECORDS = 'club_records';

// 🌟 重要設定：切換此變數為 true，即可讓前端改為呼叫 backend/server.js
const USE_BACKEND = false;
const API_URL = 'http://localhost:3001/api';

// 初始化本地資料 (僅在 USE_BACKEND = false 時有用)
const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEY_HOUSEHOLDS)) {
    localStorage.setItem(STORAGE_KEY_HOUSEHOLDS, JSON.stringify(INITIAL_HOUSEHOLDS));
  }
  if (!localStorage.getItem(STORAGE_KEY_RECORDS)) {
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(INITIAL_RECORDS));
  }
};

initializeData();

export const dataService = {
  getHouseholds: async (): Promise<Household[]> => {
    if (USE_BACKEND) {
      try {
        const res = await fetch(`${API_URL}/households`);
        return await res.json();
      } catch (error) {
        console.error("無法連線到後端，請確認 backend/server.js 是否已啟動", error);
        return [];
      }
    }
    const data = localStorage.getItem(STORAGE_KEY_HOUSEHOLDS);
    return data ? JSON.parse(data) : [];
  },

  saveHousehold: async (household: Household): Promise<void> => {
    if (USE_BACKEND) {
      await fetch(`${API_URL}/households`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(household)
      });
      return;
    }
    const households = await dataService.getHouseholds();
    const index = households.findIndex(h => h.id === household.id);
    if (index >= 0) {
      households[index] = household;
    } else {
      households.push(household);
    }
    localStorage.setItem(STORAGE_KEY_HOUSEHOLDS, JSON.stringify(households));
  },

  getRecords: async (householdId?: number): Promise<VisitRecord[]> => {
    if (USE_BACKEND) {
      const url = householdId ? `${API_URL}/records?householdId=${householdId}` : `${API_URL}/records`;
      const res = await fetch(url);
      return await res.json();
    }
    const data = localStorage.getItem(STORAGE_KEY_RECORDS);
    const records: VisitRecord[] = data ? JSON.parse(data) : [];
    if (householdId !== undefined) {
      return records.filter(r => r.householdId === householdId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  addRecord: async (record: Omit<VisitRecord, 'id'>): Promise<void> => {
    if (USE_BACKEND) {
      await fetch(`${API_URL}/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
      return;
    }
    const records = await dataService.getRecords();
    const newRecord: VisitRecord = {
      ...record,
      id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    records.push(newRecord);
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
  }
};
