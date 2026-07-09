import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone } from 'lucide-react';
import { Household } from '../types';
import { dataService } from '../services/dataService';
import { HouseholdModal } from './HouseholdModal';

export const ListView: React.FC = () => {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHouseId, setSelectedHouseId] = useState<number | null>(null);

  const loadHouseholds = async () => {
    const data = await dataService.getHouseholds();
    setHouseholds(data);
  };

  useEffect(() => {
    loadHouseholds();
  }, [selectedHouseId]); // 當彈窗關閉時重新載入

  const filteredHouseholds = households.filter(h => 
    h.name.includes(searchTerm) || 
    h.id.toString().includes(searchTerm) ||
    h.address.includes(searchTerm)
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 min-h-[calc(100vh-120px)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">住戶列表</h2>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="搜尋姓名、編號或地址..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 border-b">
              <th className="p-3 font-medium">編號</th>
              <th className="p-3 font-medium">戶長/代稱</th>
              <th className="p-3 font-medium">聯絡電話</th>
              <th className="p-3 font-medium">地址</th>
              <th className="p-3 font-medium text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredHouseholds.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  找不到符合的住戶資料
                </td>
              </tr>
            ) : (
              filteredHouseholds.map(house => (
                <tr key={house.id} className="border-b hover:bg-slate-50 transition-colors">
                  <td className="p-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm font-medium">
                      #{house.id}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-slate-800">{house.name}</td>
                  <td className="p-3 text-slate-600">
                    <div className="flex items-center gap-1">
                      <Phone size={14} className="text-slate-400" />
                      {house.phone || '-'}
                    </div>
                  </td>
                  <td className="p-3 text-slate-600">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-slate-400" />
                      {house.address || '-'}
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <button 
                      onClick={() => setSelectedHouseId(house.id)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                    >
                      查看/編輯
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedHouseId !== null && (
        <HouseholdModal 
          householdId={selectedHouseId} 
          onClose={() => setSelectedHouseId(null)} 
        />
      )}
    </div>
  );
};
