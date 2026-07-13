import React, { useState, useEffect } from 'react';
import { MAP_COORDINATES } from '../constants';
import { HouseholdModal } from './HouseholdModal';
import { dataService } from '../services/dataService';
import { Household } from '../types';

// =====================================================================
// 🗺️ 地圖圖片設定區
// =====================================================================
const MAP_IMAGE_URL = '/map.png'; // 已經為您修正為絕對路徑，確保 Vercel 不會破圖

export const MapView: React.FC = () => {
  // 修正 1：支援文字 ID (例如 '牧師家')
  const [selectedHouseId, setSelectedHouseId] = useState<string | number | null>(null);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [imageError, setImageError] = useState(false);

  const loadData = async () => {
    const data = await dataService.getHouseholds();
    setHouseholds(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  // 修正 2：強制轉為字串比對，確保數字和文字 ID 都能精準配對
  const hasData = (id: number | string) => households.some(h => h.id === String(id));

  const isUsingDefaultImage = MAP_IMAGE_URL.includes('picsum');

  return (
    // 1. 最外層容器：恢復您原本的設計，維持固定高度、圓角。加入 flex 與 items-center 讓地圖永遠置中
    <div className="w-full h-[calc(100vh-120px)] bg-slate-200 rounded-xl overflow-hidden shadow-inner border border-slate-300 flex items-center justify-center p-2">
      
      {/* 2. 核心魔法「緊密包覆層」：這個 relative 容器的寬高，會被裡面的圖片自然撐開，完全不留空白 */}
      <div className="relative max-w-full max-h-full flex-shrink-0">
        
        {(imageError || isUsingDefaultImage) && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-600 flex-col z-0 bg-slate-100/80 backdrop-blur-sm min-h-[500px]">
             <p className="mb-3 font-bold text-xl text-blue-600">請替換您的真實地圖圖片</p>
             <div className="bg-white p-4 rounded-lg shadow-sm border text-sm space-y-2">
               <p>1. 將地圖圖片放入 <strong>public</strong> 資料夾 (例如 <strong>map.png</strong>)</p>
               <p>2. 打開 <strong>components/MapView.tsx</strong></p>
               <p>3. 將第 8 行 <code>MAP_IMAGE_URL</code> 改為 <strong>'/map.png'</strong></p>
             </div>
          </div>
        )}
        
        {/* 3. 圖片層：使用 max-w-full 和 max-h-full 確保它不會超過螢幕，並自然維持比例 */}
        {!imageError && (
          <img 
            src={MAP_IMAGE_URL} 
            alt="Village Map Background" 
            className={`max-w-full max-h-[calc(100vh-140px)] w-auto h-auto block z-0 pointer-events-none transition-opacity duration-500 ${isUsingDefaultImage ? 'opacity-30' : 'opacity-100'}`}
            onError={() => setImageError(true)}
          />
        )}

        {/* 4. 點點座標層：因為外層 div 已經與圖片 100% 貼合，百分比定位絕對精準，再也不會飄！ */}
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
          householdId={selectedHouseId} 
          onClose={() => {
            setSelectedHouseId(null);
            loadData();
          }} 
        />
      )}
    </div>
  );
};