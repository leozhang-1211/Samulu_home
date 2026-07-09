# 錯誤排除與專案啟動指南

您遇到的 `ENOENT: no such file or directory` 錯誤，是因為您目前的根目錄 `package.json` 試圖去執行 `frontend` 和 `backend` 資料夾裡的指令，但系統找不到對應的檔案。

**為什麼會這樣？**
因為我們的前端程式碼採用了最新的 **ESM + Import Map** 技術（直接在 `index.html` 載入 React），這是一種**不需要打包 (Build-less)** 的輕量化架構，所以前端**根本不需要** `package.json` 或 Vite！

為了讓您能「一鍵啟動」前端網頁與後端伺服器，我已經為您重新配置了根目錄的 `package.json`。請依照以下步驟操作：

## 🛠️ 步驟 1：確認資料夾結構
請確保您的 `club-record-app` 資料夾結構「完全」長這樣（不要把前端檔案放進 frontend 資料夾，直接放在根目錄即可）：

```text
club-record-app/
├── index.html          (前端入口)
├── index.tsx           (前端主程式)
├── App.tsx
├── types.ts
├── constants.ts
├── package.json        (👉 新增的根目錄設定檔，用來一鍵啟動)
├── components/         (前端元件資料夾)
├── services/           (前端服務資料夾)
└── backend/            (👉 後端資料夾，必須手動建立)
    ├── package.json    (後端專屬設定檔)
    └── server.js       (後端伺服器程式)
```

## 🛠️ 步驟 2：安裝所有依賴套件
請在終端機（確保路徑在 `C:\Users\USER\Downloads\main\club-record-app`）執行以下指令。這個指令會同時安裝根目錄的伺服器工具，以及 `backend` 資料夾需要的套件：

```bash
npm run setup
```
*(如果出現錯誤，請先執行一次 `npm install`，然後再執行 `npm run setup`)*

## 🚀 步驟 3：一鍵啟動前後端
安裝完成後，只要執行這個指令：

```bash
npm run dev
```

這個指令會同時做兩件事：
1. 在 Port `5173` 啟動一個輕量級的靜態網頁伺服器來顯示您的 React 前端。
2. 在 Port `3001` 啟動您的 Node.js 後端 API。

啟動成功後，請打開瀏覽器前往：**http://localhost:5173** 即可開始使用！
