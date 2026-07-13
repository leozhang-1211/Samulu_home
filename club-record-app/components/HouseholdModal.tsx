import React, { useState, useEffect } from 'react';
import { X, Plus, History, User, Users } from 'lucide-react';
import { Household, VisitRecord } from '../types';
import { dataService } from '../services/dataService';

interface Props {
  householdId: string | number;
  onClose: () => void;
}

export const HouseholdModal: React.FC<Props> = ({ householdId, onClose }) => {
  const [household, setHousehold] = useState<Household | null>(null);
  const [records, setRecords] = useState<VisitRecord[]>([]);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [editForm, setEditForm] = useState<Partial<Household>>({});
  const [newRecordForm, setNewRecordForm] = useState({ date: new Date().toISOString().split('T')[0], visitors: '', content: '' });

  useEffect(() => {
    loadData();
  }, [householdId]);

  const loadData = async () => {
    setIsLoading(true);
    const allHouseholds = await dataService.getHouseholds();
    const found = allHouseholds.find(h => String(h.id) === String(householdId));
    
    if (found) {
      setHousehold(found);
      setEditForm(found);
    } else {
      const newHouse = { id: String(householdId), name: '', adults: '', kids: '', teens: '' };
      setHousehold(newHouse);
      setEditForm(newHouse);
      setIsEditingInfo(true);
    }
    
    const recs = await dataService.getRecords(householdId);
    setRecords(recs);
    setIsLoading(false);
  };

  const handleSaveInfo = async () => {
    if (editForm.id) {
      await dataService.saveHousehold(editForm as Household);
      setHousehold(editForm as Household);
      setIsEditingInfo(false);
    }
  };

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecordForm.date || !newRecordForm.content) return;

    await dataService.addRecord({
      householdId: String(householdId),
      date: newRecordForm.date,
      visitors: newRecordForm.visitors,
      content: newRecordForm.content
    });

    setNewRecordForm({ date: new Date().toISOString().split('T')[0], visitors: '', content: '' });
    setIsAddingRecord(false);
    loadData();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        <div className="flex justify-between items-center p-4 border-b bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">#{householdId}</span>
            {household?.name || '未命名家戶'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center p-10 text-slate-500">
            正在從試算表讀取資料，請稍候...
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-700">
                  <User size={18} /> 家庭成員資訊
                </h3>
                {!isEditingInfo && (
                  <button onClick={() => setIsEditingInfo(true)} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    編輯資訊
                  </button>
                )}
              </div>

              {isEditingInfo ? (
                <div className="bg-slate-50 p-4 rounded-lg border space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">家名/戶長</label>
                    <input type="text" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="例如: 牧師家" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">大人</label>
                    <input type="text" value={editForm.adults || ''} onChange={e => setEditForm({...editForm, adults: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="輸入大人姓名..." />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">小朋友</label>
                      <input type="text" value={editForm.kids || ''} onChange={e => setEditForm({...editForm, kids: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">大小孩</label>
                      <input type="text" value={editForm.teens || ''} onChange={e => setEditForm({...editForm, teens: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button onClick={() => { setIsEditingInfo(false); setEditForm(household || {}); }} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded">取消</button>
                    <button onClick={handleSaveInfo} className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">儲存</button>
                  </div>
                </div>
              ) : (
                <div className="bg-white border rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 md:col-span-2">
                    <Users size={16} className="text-slate-400 mt-1" />
                    <div>
                      <p className="text-sm text-slate-500">大人</p>
                      <p className="font-medium">{household?.adults || '無紀錄'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users size={16} className="text-slate-400 mt-1" />
                    <div>
                      <p className="text-sm text-slate-500">小朋友</p>
                      <p className="font-medium">{household?.kids || '無紀錄'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users size={16} className="text-slate-400 mt-1" />
                    <div>
                      <p className="text-sm text-slate-500">大小孩</p>
                      <p className="font-medium">{household?.teens || '無紀錄'}</p>
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-700">
                  <History size={18} /> 訪視紀錄
                </h3>
                {!isAddingRecord && (
                  <button onClick={() => setIsAddingRecord(true)} className="flex items-center gap-1 text-sm bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 transition-colors">
                    <Plus size={16} /> 新增紀錄
                  </button>
                )}
              </div>

              {isAddingRecord && (
                <form onSubmit={handleAddRecord} className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">紀錄標題 (對應試算表欄位)</label>
                      <input type="text" required value={newRecordForm.date} onChange={e => setNewRecordForm({...newRecordForm, date: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none" placeholder="例如: 2024-08-01" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">訪視人員 (選填)</label>
                      <input type="text" value={newRecordForm.visitors} onChange={e => setNewRecordForm({...newRecordForm, visitors: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none" placeholder="張三, 李四" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">訪視內容</label>
                    <textarea required value={newRecordForm.content} onChange={e => setNewRecordForm({...newRecordForm, content: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none" rows={3}></textarea>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setIsAddingRecord(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded">取消</button>
                    <button type="submit" className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700">儲存紀錄</button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {records.length === 0 ? (
                  <p className="text-center text-slate-500 py-4 bg-slate-50 rounded-lg border border-dashed">尚無訪視紀錄</p>
                ) : (
                  records.map(record => (
                    <div key={record.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-slate-800">{record.date}</span>
                        {record.visitors && <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">人員: {record.visitors}</span>}
                      </div>
                      <p className="text-slate-700 whitespace-pre-wrap">{record.content}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};