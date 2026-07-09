# 系統架設與部署指南

這是一組基於 React + TypeScript 開發的前端應用程式。因為瀏覽器無法直接執行 `.tsx` 檔案，您需要透過打包工具（如 Vite）來編譯並執行它。以下是完整的架設步驟：

## 第一階段：在本地端（您的電腦）測試執行

最快的方式是使用 **Vite** 來建立開發環境：

1. **安裝 Node.js**: 請確保您的電腦已安裝 Node.js (https://nodejs.org/)。
2. **建立專案**: 打開終端機 (Terminal) 或命令提示字元，輸入以下指令：
   ```bash
   npm create vite@latest club-record-app -- --template react-ts
   cd club-record-app
   npm install
   ```
3. **替換檔案**:
   - 將專案中 `src/` 目錄下的預設檔案刪除。
   - 將上面提供的所有檔案（`App.tsx`, `index.tsx`, `types.ts`, `constants.ts` 以及 `components/` 和 `services/` 資料夾）放入 `src/` 目錄中。
   - 將 `index.html` 放在專案根目錄（覆蓋 Vite 預設的 index.html）。
   - 將 `metadata.json` 放在專案根目錄。
4. **啟動伺服器**:
   ```bash
   npm run dev
   ```
   打開瀏覽器前往 `http://localhost:5173` 即可看到畫面。

## 第二階段：發布到網路上讓大家使用 (免費代管)

當您在本地端確認沒問題（例如替換了真實的地圖圖片）後，可以將程式碼發布到免費的靜態網頁代管平台：

1. **Vercel (最推薦)**:
   - 將您的程式碼上傳到 GitHub。
   - 登入 [Vercel](https://vercel.com/)，選擇 "Add New Project"，連接您的 GitHub 儲存庫。
   - Vercel 會自動識別 Vite 專案並幫您編譯發布，提供一個免費的網址（例如 `your-app.vercel.app`）。
2. **Netlify**:
   - 流程與 Vercel 類似，連接 GitHub 後自動部署。
3. **GitHub Pages**:
   - 適合完全免費的靜態網頁，但需要設定 GitHub Actions 來編譯 React 專案。

## 第三階段：實現 Google 試算表共同編輯 (進階)

目前的程式碼使用的是 **Local Storage (本地儲存)**，也就是資料只存在您當下的瀏覽器中。若要讓社團成員共用資料，您需要一個「後端」。

針對您「使用 Google 試算表」的需求，有以下幾種架設方式：

### 方案 A：Google Apps Script (GAS) 作為免費後端 (推薦)
1. 在您的 Google 雲端硬碟建立一個新的 Google 試算表。
2. 點擊選單的「擴充功能」>「Apps Script」。
3. 撰寫 `doGet()` 和 `doPost()` 函式，讓這個 Script 變成一個 API，負責讀取和寫入該試算表。
4. 將這個 Script 部署為「網頁應用程式」(Web App)，存取權限設定為「所有人」。
5. 回到您的 React 專案，修改 `services/dataService.ts`，將 `localStorage` 的邏輯改成使用 `fetch()` 呼叫您剛剛部署的 GAS 網址。

### 方案 B：使用第三方自動化工具 (如 Make.com 或 Zapier)
- 前端網頁透過 `fetch()` 發送 Webhook 到 Make.com。
- Make.com 接收到資料後，自動幫您寫入 Google 試算表。這不需要寫後端程式碼，但可能有免費額度限制。

### 方案 C：改用 Firebase (最適合前端開發者)
- 如果您不一定要堅持用 Google 試算表，強烈建議使用 **Google Firebase (Firestore)** 或 **Supabase**。
- 它們提供免費的即時資料庫，且有現成的 React SDK，不需要自己架設後端伺服器，就能完美實現多人即時共同編輯。

---
**總結建議**：
先照著「第一階段」在自己電腦上跑起來，確認地圖圖片換好、功能正常後，推送到 GitHub 並用 Vercel 部署（第二階段）。最後再來研究如何修改 `dataService.ts` 來串接 Google 試算表 API（第三階段）。
