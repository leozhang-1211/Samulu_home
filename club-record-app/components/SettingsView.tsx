import React from 'react';
import { Database, AlertCircle, CheckCircle2, Server } from 'lucide-react';

export const SettingsView: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border p-8 mt-8">
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
        <Database className="text-blue-600" size={28} />
        <h2 className="text-2xl font-bold text-slate-800">資料庫設定與說明</h2>
      </div>

      <div className="space-y-6 text-slate-700">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">目前的資料儲存方式</h3>
            <p className="text-sm text-blue-800">
              系統預設使用瀏覽器的 <strong>Local Storage (本地儲存)</strong> 來保存資料。這意味著資料只會存在您目前的瀏覽器中。若要與社團成員共用，請啟用後端連線。
            </p>
          </div>
        </div>

        <section>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Server className="text-indigo-500" size={20} />
            如何啟用後端連線？
          </h3>
          <p className="mb-4">
            我已經為您準備好了 <code>backend</code> 資料夾與 Node.js 伺服器。請依照以下步驟啟用：
          </p>
          
          <ol className="list-decimal list-inside space-y-4 ml-2">
            <li className="pl-2">
              <strong>啟動後端伺服器</strong>
              <p className="text-sm text-slate-500 mt-1 ml-5">
                在終端機進入 <code>backend</code> 資料夾，執行 <code>npm install</code> 與 <code>npm start</code>。
              </p>
            </li>
            <li className="pl-2">
              <strong>修改前端設定</strong>
              <p className="text-sm text-slate-500 mt-1 ml-5">
                打開前端的 <code>services/dataService.ts</code>，將 <code>USE_BACKEND</code> 變數改為 <code>true</code>。
              </p>
            </li>
            <li className="pl-2">
              <strong>串接 Google 試算表 (進階)</strong>
              <p className="text-sm text-slate-500 mt-1 ml-5">
                在 <code>backend/server.js</code> 中，引入 <code>google-spreadsheet</code> 套件，並填入您的 Google Service Account 金鑰，即可將資料寫入試算表！
              </p>
            </li>
          </ol>
        </section>

        <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h4 className="font-medium text-slate-800 mb-2 flex items-center gap-2">
            <CheckCircle2 className="text-green-500" size={18} />
            架構優勢
          </h4>
          <p className="text-sm text-slate-600">
            現在的架構已經是標準的「前後端分離」。前端 (React) 負責畫面，後端 (Express) 負責保護金鑰與資料庫溝通。這不僅解決了純前端無法安全寫入 Google 試算表的問題，也為未來的擴充打下了良好的基礎！
          </p>
        </div>
      </div>
    </div>
  );
};
