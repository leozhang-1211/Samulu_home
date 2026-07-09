import React, { useState, useEffect } from 'react';
import { MAP_COORDINATES } from '../constants';
import { HouseholdModal } from './HouseholdModal';
import { dataService } from '../services/dataService';
import { Household } from '../types';

// =====================================================================
// 🗺️ 地圖圖片設定區
// =====================================================================
// 步驟 1: 將您準備好的地圖圖片 (例如命名為 map.jpg 或 map.png) 
//         複製並貼上到專案的「根目錄」下 (也就是和 index.html 放在同一個資料夾)。
// 步驟 2: 將下方的網址替換為您的圖片檔名，例如 './map.jpg'。
// =====================================================================
const MAP_IMAGE_URL = './map.png'; // <--- 請修改這一行！例如改為 './map.jpg'


export const MapView: React.FC = () => {
  const [selectedHouseId, setSelectedHouseId] = useState<number | null>(null);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [imageError, setImageError] = useState(false);

  const loadData = async () => {
    const data = await dataService.getHouseholds();
    setHouseholds(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  // 檢查該編號是否有建立資料
  const hasData = (id: number) => households.some(h => h.id === id);

  // 判斷是否還在使用預設圖片
  const isUsingDefaultImage = MAP_IMAGE_URL.includes('picsum');

  return (
    <div className="relative w-full h-[calc(100vh-120px)] bg-slate-200 rounded-xl overflow-hidden shadow-inner border border-slate-300">
      
      {/* 背景提示文字 (當圖片載入失敗，或是還在使用預設圖片時顯示) */}
      {(imageError || isUsingDefaultImage) && (
        <div className="absolute inset-0 flex items-center justify-center text-slate-600 flex-col z-0 bg-slate-100/80 backdrop-blur-sm">
           <p className="mb-3 font-bold text-xl text-blue-600">請替換您的真實地圖圖片</p>
           <div className="bg-white p-4 rounded-lg shadow-sm border text-sm space-y-2">
             <p>1. 將您的地圖圖片放入專案資料夾 (例如命名為 <strong>map.jpg</strong>)</p>
             <p>2. 打開程式碼 <strong>components/MapView.tsx</strong></p>
             <p>3. 找到第 11 行，將 <code>MAP_IMAGE_URL</code> 修改為 <strong>'./map.jpg'</strong></p>
             {imageError && <p className="text-red-500 font-bold mt-2">⚠️ 目前設定的圖片路徑載入失敗，請檢查檔名是否正確！</p>}
           </div>
        </div>
      )}
      
      {/* 地圖圖片 */}
      {!imageError && (
        <img 
          src={MAP_IMAGE_URL} 
          alt="Village Map Background" 
          className={`absolute inset-0 w-full h-full object-cover z-0 pointer-events-none transition-opacity duration-500 ${isUsingDefaultImage ? 'opacity-30' : 'opacity-100'}`}
          onError={() => setImageError(true)}
        />
      )}

      {/* 互動標記層 */}
      <div className="absolute inset-0 z-10">
        {MAP_COORDINATES.map((coord) => {
          const isRecorded = hasData(coord.id);
          return (
            <button
              key={coord.id}
              onClick={() => setSelectedHouseId(coord.id)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
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

      {/* 圖例 */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-lg border text-sm z-20">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          <span>已有資料</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-white border-2 border-slate-300"></div>
          <span>尚未建立</span>
        </div>
      </div>

      {selectedHouseId !== null && (
        <HouseholdModal 
          householdId={selectedHouseId} 
          onClose={() => {
            setSelectedHouseId(null);
            loadData(); // 關閉彈窗時重新載入資料，確保地圖標記顏色更新
          }} 
        />
      )}
    </div>
  );
};
