## Battle Visualizer MVP
- **專案清單與定位**：名稱 Battle Visualizer MVP；目標建立互動式歷史戰役播映平台，支援戰役列表、地圖與時間軸播放；目前為 React 前端 MVP；所在位置 `本機路徑: /opt/ai-project/battle-visualizer-mvp`。
- **遠端部署網址**：https://battle.deepwaterslife.com/
- **應用程式類型**：歷史資料可視化、互動地圖、戰史教育、React 19、Leaflet、時間軸播放、Tailwind、Zod 驗證、React Query。
- **時間軸與里程碑**：未提供。
- **技術與架構概要**：前端以 React + Vite + TypeScript 為基礎；地圖層使用 Leaflet 與 React-Leaflet；資料快取與請求協調由 TanStack Query 處理；戰役資料以 JSON/GeoJSON 儲存在 `public/data` 並透過 Zod Schema 驗證；Tailwind CSS 建 UI；具 `scripts/validate-battles.ts` 進行資料驗證。
- **成果與媒體資源**：未提供。
- **目前狀態與待辦**：MVP 已完成時間軸播放、圖例、事件標記等核心互動；`proj_description.md` 提出後續擴充（如導入後端 CMS、增添戰果統計與歷史地圖 overlay）。
- **相關文件**：`battle-visualizer-mvp/README.md`、`battle-visualizer-mvp/proj_description.md`、`battle-visualizer-mvp/scripts/validate-battles.ts`、`battle-visualizer-mvp/public/data/ww2_d_day.json` 等戰役資料。
- **聯絡點或協作者**：開發者 s19003045。