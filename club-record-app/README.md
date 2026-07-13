## 🛠️資料夾結構

```text
club-record-app/
├── index.html          (前端入口)
├── index.tsx           (前端主程式)
├── App.tsx
├── types.ts
├── constants.ts
├── package.json        
├── components/         (分頁內容)
├── services/           (服務／功能)
└── backend/            (在本地端跑才用)
```

## 🛠️本地運行
請在終端機（確保路徑在 `C:\Users\USER\Downloads\main\club-record-app`）執行以下指令：

```bash
npm run setup
```
*(如果出現錯誤，請先執行一次 `npm install`，然後再執行 `npm run setup`)*

安裝完成後，只要執行這個指令：

```bash
npm run dev
```

這個指令會同時做兩件事：
1. 在 Port `5173` 啟動一個輕量級的靜態網頁伺服器來顯示您的 React 前端。
2. 在 Port `3001` 啟動您的 Node.js 後端 API。

啟動成功後，請打開瀏覽器前往：**http://localhost:5173** 即可開始使用！
