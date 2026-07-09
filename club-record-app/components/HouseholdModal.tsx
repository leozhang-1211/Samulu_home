import React, { useState, useEffect } from 'react';
import { X, Plus, History, User, Phone, MapPin, FileText } from 'lucide-react';
import { Household, VisitRecord } from '../types';
import { dataService } from '../services/dataService';

interface Props {
  householdId: number;
  onClose: () => void;
}

export const HouseholdModal: React.FC<Props> = ({ householdId, onClose }) => {
  const [household, setHousehold] = useState<Household | null>(null);
  const [records, setRecords] = useState<VisitRecord[]>([]);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isAddingRecord, setIsAddingRecord] = useState(false);

  // Form states
  const [editForm, setEditForm] = useState<Partial<Household>>({});
  const [newRecordForm, setNewRecordForm] = useState({ date: new Date().toISOString().split('T')[0], visitors: '', content: '' });

  useEffect(() => {
    loadData();
  }, [householdId]);

  const loadData = async () => {
    const allHouseholds = await dataService.getHouseholds();
    const found = allHouseholds.find(h => h.id === householdId);
    
    if (found) {
      setHousehold(found);
      setEditForm(found);
    } else {
      // 如果是新的點，初始化一個空的
      const newHouse = { id: householdId, name: '', phone: '', address: '', notes: '' };
      setHousehold(newHouse);
      setEditForm(newHouse);
      setIsEditingInfo(true); // 強制進入編輯模式
    }
    
    const recs = await dataService.getRecords(householdId);
    setRecords(recs);
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
      householdId,
      date: newRecordForm.date,
      visitors: newRecordForm.visitors,
      content: newRecordForm.content
    });

    setNewRecordForm({ date: new Date().toISOString().split('T')[0], visitors: '', content: '' });
    setIsAddingRecord(false);
    loadData(); // Reload records
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">#{householdId}</span>
            {household?.name || '未命名住戶'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Household Info Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-700">
                <User size={18} /> 基本資訊
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
                  <label className="block text-sm font-medium text-slate-600 mb-1">戶長/代稱</label>
                  <input type="text" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="例如: 王大明" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">電話</label>
                    <input type="text" value={editForm.phone || ''} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">地址/位置描述</label>
                    <input type="text" value={editForm.address || ''} onChange={e => setEditForm({...editForm, address: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">備註</label>
                  <textarea value={editForm.notes || ''} onChange={e => setEditForm({...editForm, notes: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" rows={2}></textarea>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => { setIsEditingInfo(false); setEditForm(household || {}); }} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded">取消</button>
                  <button onClick={handleSaveInfo} className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">儲存</button>
                </div>
              </div>
            ) : (
              <div className="bg-white border rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-slate-400 mt-1" />
                  <div>
                    <p className="text-sm text-slate-500">聯絡電話</p>
                    <p className="font-medium">{household?.phone || '無紀錄'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-slate-400 mt-1" />
                  <div>
                    <p className="text-sm text-slate-500">地址</p>
                    <p className="font-medium">{household?.address || '無紀錄'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 md:col-span-2">
                  <FileText size={16} className="text-slate-400 mt-1" />
                  <div>
                    <p className="text-sm text-slate-500">備註</p>
                    <p className="font-medium whitespace-pre-wrap">{household?.notes || '無'}</p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Visit Records Section */}
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
                    <label className="block text-sm font-medium text-slate-600 mb-1">日期</label>
                    <input type="date" required value={newRecordForm.date} onChange={e => setNewRecordForm({...newRecordForm, date: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">訪視人員</label>
                    <input type="text" required value={newRecordForm.visitors} onChange={e => setNewRecordForm({...newRecordForm, visitors: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none" placeholder="例如: 張三, 李四" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">訪視內容與狀況</label>
                  <textarea required value={newRecordForm.content} onChange={e => setNewRecordForm({...newRecordForm, content: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none" rows={3} placeholder="記錄今天訪視的狀況..."></textarea>
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
                      <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">人員: {record.visitors}</span>
                    </div>
                    <p className="text-slate-700 whitespace-pre-wrap">{record.content}</p>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
