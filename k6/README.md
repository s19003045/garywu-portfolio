# k6 壓力測試腳本

給 `garywu-portfolio` 這個 Next.js 網站用的 k6 腳本。腳本本身版本控制在這個 app repo 裡（而不是共用的觀測性 stack repo），因為腳本內容是這個 app 特有的路由與瀏覽行為，理由見 [k6-observability-stack 的技術決策記錄](../../k6-observability-stack/docs/k6-observability-stack-SPEC.md#9-技術決策記錄供-agent-理解為什麼避免自行更改)。

## 腳本

- **`smoke.js`** — 快速檢查一組固定的關鍵路由（首頁、blog 列表、sitemap、feed...）都回 200。3 VUs、20 秒，適合接進 CI 或部署後的健康檢查。
- **`site-journey.js`** — 模擬真實訪客瀏覽行為的負載測試。啟動時先讀 `/sitemap.xml` 找出所有實際存在的文章、案例研究、分類/標籤/系列頁面，再依大致的瀏覽權重（首頁 → 靜態頁 / blog 列表 → 文章詳情 → 相關文章 → 案例研究…）隨機走訪。新增文章或案例不需要改腳本內容。
- **`lib/discover.js`** — `site-journey.js` 用來解析 sitemap 的共用模組；如果 sitemap 打不到或內容太少，會退回一組寫死的安全路徑，不會讓整個測試直接掛掉。

**刻意不包含 `/api/contact`**：那是會實際觸發 Gmail API 寄信的端點（見 `lib/gmail.ts`），重複打會造成真實副作用（寄信、觸發 Gmail 配額 / rate limit）。目前 `lib/site.ts` 的 `features.contactForm` 也預設是 `false`，正式站會直接回 403。如果之後真的要測這條路徑，另外寫一支獨立、VU 數壓到最低、且指向測試信箱的腳本，不要跟一般流量混在一起跑。

## 怎麼跑

### 前置：本機 CLI vs. Docker

這台機器沒有裝本機 k6 binary，以下全部用 Docker（`grafana/k6:1.8.0`，跟 `k6-observability-stack` 釘的版本一致）。如果之後想裝本機版本（見 [k6 安裝文件](https://grafana.com/docs/k6/latest/set-up/install-k6/)），語法完全一樣，只要把：

```bash
docker run --rm --network host -e BASE_URL=... -v "$(pwd)/k6:/k6:ro" grafana/k6:1.8.0 run [旗標] /k6/<script>.js
```

換成：

```bash
BASE_URL=... k6 run [旗標] k6/<script>.js
```

其餘的環境變數與 k6 旗標用法都不變。

### 基本語法

```bash
docker run --rm --network host \
  -e BASE_URL=<要測的網站> \
  -v "$(pwd)/k6:/k6:ro" \
  grafana/k6:1.8.0 run [k6 旗標...] /k6/<script>.js
```

- `--network host`：容器直接用 host 網路（Linux 適用），這樣才連得到 `localhost:PORT` 或另一個容器映出來的 host port。
- `-e BASE_URL=...`：這是 **Docker** 的 `-e`，把環境變數放進容器；k6 預設會把系統環境變數整包透傳給腳本的 `__ENV`（`--include-system-env-vars` 預設 `true`），所以腳本裡讀得到 `__ENV.BASE_URL`。
- `-v "$(pwd)/k6:/k6:ro"`：把這個目錄唯讀掛進容器的 `/k6`。

### 常用情境

```bash
# 1. 快速 smoke test，打本機 npm run dev（預設 port 3000）
docker run --rm --network host \
  -e BASE_URL=http://localhost:3000 \
  -v "$(pwd)/k6:/k6:ro" \
  grafana/k6:1.8.0 run /k6/smoke.js

# 2. 完整瀏覽行為負載測試，用腳本內建的環境變數調參（保留 ramp-up/down 階段設計）
docker run --rm --network host \
  -e BASE_URL=http://localhost:3000 \
  -e VUS=30 \
  -e RAMP_TIME=30s \
  -e DURATION=5m \
  -v "$(pwd)/k6:/k6:ro" \
  grafana/k6:1.8.0 run /k6/site-journey.js

# 3. 用 k6 原生旗標覆蓋，跑「固定 VU 數、固定時間」的簡化版
#    注意：--vus/--duration 會把腳本裡的 options.scenarios 整個蓋掉，
#    變成單一個 constant-vus 情境，不會有 ramp-up/down。
docker run --rm --network host \
  -e BASE_URL=http://localhost:3000 \
  -v "$(pwd)/k6:/k6:ro" \
  grafana/k6:1.8.0 run --vus 20 --duration 3m /k6/site-journey.js

# 4. 只想驗證腳本邏輯本身，跑幾次迭代就好，不用等完整時長
docker run --rm --network host \
  -e BASE_URL=http://localhost:3000 \
  -v "$(pwd)/k6:/k6:ro" \
  grafana/k6:1.8.0 run --vus 2 --iterations 5 /k6/site-journey.js

# 5. 把摘要報告存成 JSON，方便事後比較或丟進 CI artifact
#    （額外把當前目錄掛到 /out 才寫得出容器外；grafana/k6 image 預設不是 root，
#    --user 用 host 的 uid/gid 執行，否則會 permission denied 寫不進去）
docker run --rm --network host --user "$(id -u):$(id -g)" \
  -e BASE_URL=http://localhost:3000 \
  -v "$(pwd)/k6:/k6:ro" -v "$(pwd):/out" \
  grafana/k6:1.8.0 run --summary-export=/out/k6-summary.json /k6/site-journey.js

# 6. 直接輸出到 InfluxDB（不透過 k6-observability-stack 的 Makefile，原始語法）
docker run --rm --network host \
  -e BASE_URL=http://localhost:3000 \
  -v "$(pwd)/k6:/k6:ro" \
  grafana/k6:1.8.0 run --out influxdb=http://localhost:8086/k6 /k6/site-journey.js

# 7. 打 HTTPS 正式網域、憑證或中介 proxy 有問題時跳過 TLS 驗證（除錯用，不要常態使用）
docker run --rm --network host \
  -e BASE_URL=https://garywudev.deepwaterslife.com \
  -v "$(pwd)/k6:/k6:ro" \
  grafana/k6:1.8.0 run --insecure-skip-tls-verify --vus 1 --iterations 1 /k6/smoke.js

# 8. 想看每個請求的細節（除錯用，量一大輸出會很吵；--http-debug=full 連 body 都印）
docker run --rm --network host \
  -e BASE_URL=http://localhost:3000 \
  -v "$(pwd)/k6:/k6:ro" \
  grafana/k6:1.8.0 run --http-debug /k6/smoke.js
```

### 常用旗標速查

| 旗標 | 作用 |
|---|---|
| `-u, --vus <n>` | 虛擬使用者數。跟腳本自訂的 `options.scenarios` 一起用時會**整個蓋掉** scenarios，改成單一 constant-vus 情境（`site-journey.js` 會因此失去 ramp-up/down）。 |
| `-d, --duration <time>` | 測試時長（如 `30s`、`5m`）。同樣會蓋掉 `options.scenarios`。 |
| `-i, --iterations <n>` | 總迭代數上限，適合「只想驗證腳本邏輯」而非真的做負載測試。 |
| `-s, --stage <duration>:<target>` | 手動疊加 ramp 階段，可下多次（等同不在腳本裡寫 `stages`）。 |
| `-e, --env VAR=value` | k6 原生的方式傳環境變數給腳本（跟 docker 的 `-e` 不同層，但一樣會進到 `__ENV`；本機裝了 k6 CLI 就會用到這個）。 |
| `-o, --out <uri>` | 把 metrics 即時送到外部系統，例如 `influxdb=http://host:8086/dbname`。 |
| `--summary-export <path>` | 測試結束後把摘要存成 JSON。 |
| `--http-debug[=full]` | 印出每個 HTTP 請求/回應（除錯用；`=full` 含 body）。 |
| `--insecure-skip-tls-verify` | 跳過 TLS 憑證驗證（除錯用）。 |
| `--no-color` | 關閉彩色輸出，方便存進純文字的 CI log。 |
| `-q, --quiet` | 不印進度條。 |
| `--rps <n>` | 全域限制每秒請求數，想「慢慢加壓、不要一次衝爆」時搭配用。 |
| `-w, --throw` | 把 HTTP 失敗這類警告當成 error 拋出，讓失敗更顯眼。 |

完整旗標清單：`docker run --rm grafana/k6:1.8.0 run --help`。

### `site-journey.js` 自訂環境變數（腳本內用 `__ENV` 讀，不是 k6 原生旗標）

| 變數 | 預設 | 說明 |
|---|---|---|
| `BASE_URL` | `http://localhost:3000` | 要測試的網站位址 |
| `VUS` | `10` | 尖峰虛擬使用者數 |
| `RAMP_TIME` | `30s` | 爬升到尖峰 / 收尾降到 0 各自花的時間 |
| `DURATION` | `2m` | 尖峰持續時間 |

想保留腳本內建的 ramp-up/down 階段設計，用這組環境變數調參（上面範例 2）；只想要「固定 VU 數跑固定時間」的簡化版才用 k6 原生的 `--vus`/`--duration`（範例 3，會犧牲 ramp 設計）。`smoke.js` 沒有自訂環境變數，只吃 `BASE_URL`，VUs/duration 都是寫死的 3 / 20s（想改就直接用 `--vus`/`--duration` 蓋過去，它沒有自訂 `scenarios`，蓋掉不會有副作用）。

### 對正式站做健康檢查時務必縮小規模

如果哪天真的要對 `https://garywudev.deepwaterslife.com` 跑，只用 `smoke.js`、VUs 壓到 1、只跑一輪（見上面範例 7）。不要對正式站跑 `site-journey.js` 或任何多 VU / 長時間的設定——那是要對著獨立測試環境（本機 dev server、CI 容器、或另外起的臨時容器）跑的，見下面「已驗證過的行為」一節的教訓。

### 搭配 [k6-observability-stack](../../k6-observability-stack) 看儀表板

`garywu-portfolio/docker-compose.yml` 裡的 `web` service **已經**宣告加入 named external network `k6-observability-net`，跟 `k6-observability-stack` 的 `influxdb`/`grafana` 是共用同一個 network 的鄰居（用 `docker network inspect k6-observability-net` 可以看到）。這代表技術上可以直接用容器名稱（`garywu-portfolio-web-1`/`-2`/`-3`，或 compose 的 service alias `web`）從 k6 容器打到正式站——但**不要這樣做**：那是正式部署的 3 個 replica，跟上面「對正式站做健康檢查時務必縮小規模」講的是同一個風險。

正確做法是另外起一個跟正式部署無關的**臨時容器**當測試目標，一樣加入這個共用 network。以下步驟已經實際跑過一次驗證（見下方「已驗證過的行為」）：

1. 起一個跟正式 3 個 replica 完全隔離的臨時容器，只加入共用 network，不對外開 port：
   ```bash
   docker run -d --rm \
     --name garywu-portfolio-k6-target \
     --network k6-observability-net \
     garywu-portfolio:latest
   ```
2. 在 `k6-observability-stack` 目錄執行 `make up`，確保 `influxdb`/`grafana` 已啟動。
3. 用 `docker compose run` 的 `-v` 把這個目錄的 `k6/` 掛進**一個新路徑** `/portfolio-k6`（不要用 `/scripts`，那個路徑在 `k6-observability-stack` 的 `docker-compose.yml` 裡已經掛了 `./scripts`，掛到同一個 target path 會有 mount 衝突），並用 `-e` 把 `BASE_URL` 指到上面的臨時容器：
   ```bash
   cd /opt/k6-observability-stack
   docker compose run --rm \
     -v /opt/garywu-portfolio/k6:/portfolio-k6:ro \
     -e BASE_URL=http://garywu-portfolio-k6-target:3000 \
     k6 run /portfolio-k6/smoke.js
   ```
   跑 `site-journey.js` 也一樣，多帶 `-e VUS=... -e RAMP_TIME=... -e DURATION=...` 即可（換掉最後的檔名和路徑）。`K6_OUT` 已經寫在 `k6-observability-stack` 的 compose 環境變數裡，不需要額外再帶 `--out`。
4. 打開 Grafana（`http://localhost:3000`，跟 stack 本身衝 port 的話記得先調整 `GRAFANA_PORT`），在 dashboard 上看 VU 數、`http_req_duration`、依 `name` tag 分開的各類頁面（`home-zh`、`blog-post`、`case-study-detail`…）回應時間。
5. 測完清掉臨時容器：`docker stop garywu-portfolio-k6-target`（`--rm` 啟動的，`stop` 後會自動移除）。

## 已驗證過的行為

這兩支腳本都已經用這個 repo 自己的 Docker image（`garywu-portfolio:latest`，多加一個跟正式部署完全隔離的臨時容器）實際跑過一次，確認：

- `smoke.js`：9 條路由全部回 200。
- `site-journey.js`：sitemap 探索邏輯正確解析出 225 個 URL，並成功分類、隨機走訪到首頁、靜態頁、blog 列表/文章/分類/標籤/系列頁、案例研究列表/詳情、OG image 等所有型別，全部回 200。
- `--vus`/`--iterations` 覆蓋、`--summary-export` 都實際跑過。`--summary-export` 第一次測試時因為 `grafana/k6` image 預設不是 root 而 permission denied，補上 `--user "$(id -u):$(id -g)"` 後才確認可以正常寫出 JSON——上面「常用情境」範例 5 已經是修正後的版本。
- 跟 `k6-observability-stack` 整合的流程（上面「搭配 k6-observability-stack 看儀表板」）也實際跑過一次：起臨時容器、用 `/portfolio-k6` 掛載路徑跑 `smoke.js`，486 次請求全部通過，並用 InfluxDB `SELECT count("value") FROM "http_reqs"` 確認資料確實寫進去，Grafana dashboard 看得到。過程中沒有動到正式站的 3 個 replica。

**注意**：測試時務必指向獨立的測試環境（本機 `npm run dev`、CI 建置出的容器、或另外跑的臨時容器），不要直接把 `BASE_URL` 指向正式站的 3 個 replica（`docker-compose.yml` 目前跑在 host port 3051-3053）——`site-journey.js` 預設 10 VUs 對外持續打 3 分鐘的流量,拿正式站當壓測目標會影響真實訪客。
