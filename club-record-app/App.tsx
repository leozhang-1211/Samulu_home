import React, { useState } from 'react';
import { Map as MapIcon, List, Settings, Users } from 'lucide-react';
import { MapView } from './components/MapView';
import { ListView } from './components/ListView';
import { SettingsView } from './components/SettingsView';

type Tab = 'map' | 'list' | 'settings';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('map');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Users className="text-white" size={24} />
              </div>
              <h1 className="text-xl font-bold text-slate-800 tracking-wide">社團家訪紀錄系統</h1>
            </div>
            
            <nav className="flex space-x-1 sm:space-x-4 items-center">
              <button
                onClick={() => setActiveTab('map')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'map' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <MapIcon size={18} />
                <span className="hidden sm:inline">地圖模式</span>
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'list' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <List size={18} />
                <span className="hidden sm:inline">列表模式</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'settings' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Settings size={18} />
                <span className="hidden sm:inline">系統設定</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'map' && <MapView />}
        {activeTab === 'list' && <ListView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>
    </div>
  );
};

export default App;