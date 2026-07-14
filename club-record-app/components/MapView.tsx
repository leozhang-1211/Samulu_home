import React, { useState, useEffect } from 'react';
import { MAP_COORDINATES } from '../constants';
import { HouseholdModal } from './HouseholdModal';
import { dataService } from '../services/dataService';
import { Household } from '../types';

const MAP_IMAGE_URL = '/map.png'; 

export const MapView: React.FC = () => {
  const [selectedHouseId, setSelectedHouseId] = useState<string | number | null>(null);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [imageError, setImageError] = useState(false);
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);

  const loadData = async () => {
    setIsGlobalLoading(true);
    const data = await dataService.getHouseholds();
    setHouseholds(data || []);
    setIsGlobalLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const hasData = (id: number | string) => households.some(h => String(h.id) === String(id));

  const getSelectedHouseholdData = () => {
    const found = households.find(h => String(h.id) === String(selectedHouseId));
    return found || {
      id: String(selectedHouseId),
      name: '',
      adults: '',
      kids: '',
      teens: '',
      history: []
    };
  };

  return (
    <div className="w-full h-[calc(100vh-120px)] bg-slate-200 rounded-xl overflow-hidden shadow-inner border border-slate-300 flex items-center justify-center p-2 relative">
      
      {isGlobalLoading && (
        <div className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex flex-col items-center justify-center text-white">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-bold mb-2">正在同步雲端資料庫...</h2>
          <p className="text-sm opacity-90">包含最新照片與歷史分頁</p>
        </div>
      )}

      <div className="relative max-w-full max-h-full flex-shrink-0">
        {!imageError && (
          <img 
            src={MAP_IMAGE_URL} 
            alt="Village Map Background" 
            className="max-w-full max-h-[calc(100vh-140px)] w-auto h-auto block z-0 pointer-events-none transition-opacity duration-500"
            onError={() => setImageError(true)}
          />
        )}

        <div className="absolute inset-0 z-10">
          {MAP_COORDINATES.map((coord) => {
            const isRecorded = hasData(coord.id);
            return (
              <button
                key={coord.id}
                onClick={() => setSelectedHouseId(coord.id)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shadow-md transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                  ${isRecorded 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-white text-slate-600 border-2 border-slate-300 hover:border-blue-400 hover:text-blue-500'
                  }
                `}
                style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
                title={`編號 ${coord.id}`}
              >
                {coord.id}
              </button>
            );
          })}
        </div>
      </div>

      {selectedHouseId !== null && (
        <HouseholdModal 
          household={getSelectedHouseholdData() as Household} 
          onClose={() => setSelectedHouseId(null)} 
          onRefresh={loadData}
        />
      )}
    </div>
  );
};