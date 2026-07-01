# 一個 nginx 使用者把古董 PHP 專案搬進 Docker + Apache 的除錯筆記

> 這是一篇「踩坑 + 理解」的過程紀錄。我熟悉的技術是 React、TypeScript、Node.js、nginx、Docker，但對 Apache2 和 PHP 幾乎是零。因為客戶需求，我得把一個跑在 CentOS 老主機上的 PHP 5.6 專案，改成 Docker Compose、部署到新的 Linux 主機上。這一路我修好了不少 bug，但更重要的收穫是：我開始能分辨「**我讓它動了**」和「**我知道它為什麼動**」這兩件事的差別。
>
> 文中的網域、帳密、內部 IP 都已去識別化。假設你和我一樣熟 nginx、但沒碰過 Apache，也不熟 PHP。

---

## 目錄

1. [系統全貌：一張請求路徑圖](#1-系統全貌一張請求路徑圖)
2. [背景一：給 nginx 使用者的 Apache 速成](#2-背景一給-nginx-使用者的-apache-速成)
3. [背景二：PHP 專案怎麼跑？從瀏覽器到畫面](#3-背景二php-專案怎麼跑從瀏覽器到畫面)
4. [第一關：反向代理——為什麼連登入框都不出現](#4-第一關反向代理為什麼連登入框都不出現)
5. [第二關：DocumentRoot 與子路徑前綴](#5-第二關documentroot-與子路徑前綴)
6. [第三關：權限管控——兩條獨立的軸](#6-第三關權限管控兩條獨立的軸)
7. [第四關：容器連主機資料庫的三道閘門](#7-第四關容器連主機資料庫的三道閘門)
8. [番外：為什麼 Next.js 跟 PHP 剛好相反](#8-番外為什麼-nextjs-跟-php-剛好相反)
9. [真正該帶走的：一套除錯方法論](#9-真正該帶走的一套除錯方法論)

---

## 1. 系統全貌：一張請求路徑圖

先建立地圖。使用者在瀏覽器打一個網址，到畫面出現，中間經過的每一站，都可能是問題發生的地方：

```
瀏覽器
  │  https://app.example.com/legacyapp/
  ▼
主機 Apache2（TLS 終止 + 反向代理）        ← 關卡一
  │  http://127.0.0.1:8080/legacyapp/
  ▼
容器 Apache（php5.6-apache image）          ← 關卡二：DocumentRoot / 前綴
  │
  ▼
.htaccess（Basic Auth + IP 白名單）         ← 關卡三：權限管控
  │
  ▼
mod_php → 執行 index.php（Server-Side Render）
  │
  ▼
MariaDB（主機上、其他專案共用的那顆）        ← 關卡四：容器 → 主機連線
```

這張圖的重點在於：**這是一條「鏈」，任何一環斷掉，前端就拿不到資源。** 而「前端拿不到資源」這種症狀，光看程式碼幾乎無法定位——你必須沿著這條鏈，一站一站確認請求走到了哪、又在哪裡斷掉。這也是後面所有除錯的基本盤。

我最初的症狀是：打開網址，**連要求輸入帳號密碼的彈跳視窗都不出現**，整頁空白或 404。後面會看到，光這一個症狀，根因就可能落在圖上完全不同的位置。

---

## 2. 背景一：給 nginx 使用者的 Apache 速成

如果你會 nginx，Apache 的觀念其實一一對得上，只是長相和「設定如何被載入」的機制差很多。這一節先把地基打好，後面才不會看不懂設定檔。

### 2.1 語法長相：nginx 用大括號，Apache 用類 XML 標籤

nginx 的設定是巢狀大括號、每行結尾加分號：

```nginx
server {
    listen 443 ssl;
    server_name app.example.com;
    root /var/www/html;
    location /api/ {
        proxy_pass http://127.0.0.1:8080/;
    }
}
```

Apache 的設定是「指令 + 類 XML 的區塊標籤」，**行尾沒有分號**，區塊用 `<Tag>...</Tag>` 包起來：

```apache
<VirtualHost *:443>
    ServerName app.example.com
    DocumentRoot /var/www/html
    ProxyPass /api/ http://127.0.0.1:8080/
</VirtualHost>
```

### 2.2 概念對照表

| 你熟悉的 nginx | Apache 對應 | 說明 |
|---|---|---|
| `server { }` | `<VirtualHost>` | 一個虛擬主機 |
| `location /path { }`（URL） | `<Location "/path">` | 依 **URL** 比對 |
| （nginx 沒有直接對應） | `<Directory "/fs/path">` | 依 **檔案系統路徑** 比對 |
| `root` | `DocumentRoot` | 網站根目錄 |
| `proxy_pass` | `ProxyPass` + `ProxyPassReverse` | 反向代理（Apache 要兩行） |
| `nginx -t` | `apache2ctl configtest` | 語法檢查 |
| `nginx -s reload` | `systemctl reload apache2` | 重新載入 |
| 模組多半編進去 | `a2enmod xxx`（動態載入） | Apache 模組要「開啟」 |
| （沒有） | `.htaccess` | 目錄級、**執行時**讀取的設定 |

有兩個 Apache 概念在 nginx 世界沒有直接對應，值得特別記住。

**其一：模組要「開啟」。** nginx 常見模組多半在編譯時就在了；Apache 則是一堆 `.so` 動態模組，用到哪個要先開哪個。反向代理要 `a2enmod proxy proxy_http`、rewrite 要 `a2enmod rewrite`、SSL 要 `a2enmod ssl`、改 header 要 `a2enmod headers`。**沒開啟就用該模組的指令，Apache 會直接報「Invalid command」。** 這是新手第一個常撞的牆。

**其二：`.htaccess` 這種東西。** 這是 Apache 特有的「目錄級設定檔」：你可以在網站某個資料夾裡放一個 `.htaccess`，Apache 在**每次請求時**去讀它，套用裡面的規則（改寫網址、加驗證……）。nginx 沒有這種「執行時、分散在各目錄」的機制——nginx 的設定是啟動時一次讀完的集中式設定。`.htaccess` 很方便（改了不用 reload），但它有個關鍵開關 `AllowOverride`，這點在第三關會變成主角。

### 2.3 「啟用」的機制：sites-available / sites-enabled

Debian/Ubuntu 系的 Apache，設定檔在 `/etc/apache2/`，結構是這樣：

```
/etc/apache2/
├── apache2.conf          # 主設定檔（載入下面這些）
├── ports.conf            # 監聽哪些 port
├── mods-available/       # 所有「可用」的模組
├── mods-enabled/         # 「已啟用」的模組（指回 available 的 symlink）
├── conf-available/       # 可用的設定片段
├── conf-enabled/         # 已啟用的設定片段
├── sites-available/      # 所有「可用」的站台設定
└── sites-enabled/        # 「已啟用」的站台（symlink）
```

這個「available / enabled」二分法，跟 nginx 的 `sites-available` + `sites-enabled` symlink 幾乎一模一樣。差別在於 Apache 有一組工具幫你建 symlink：`a2ensite`（啟用站台）、`a2dissite`（停用）、`a2enmod` / `a2enconf`。

而**真正決定「哪些檔案會被載入」的**，是 `apache2.conf` 結尾那幾行：

```apache
IncludeOptional mods-enabled/*.load
IncludeOptional mods-enabled/*.conf
Include ports.conf
IncludeOptional conf-enabled/*.conf
IncludeOptional sites-enabled/*.conf
```

注意那個 glob：`sites-enabled/*.conf`。**只有結尾是 `.conf` 的檔案才會被載入。** 記住這行，因為它就是我第一個 bug 的元兇。

### 2.4 三個你會天天用的除錯指令

```bash
apache2ctl configtest   # 語法檢查（相當於 nginx -t）
apache2ctl -S           # 印出「實際載入了哪些 VirtualHost、綁在哪個 port」
apache2ctl -M           # 印出「實際載入了哪些模組」
```

`apache2ctl -S` 是這整篇文章最重要的一個指令。因為 Apache 有太多「設定檔存在、但其實沒被載入」的坑，你不能只看檔案內容就相信它生效了——你要問 Apache「你**實際上**載了什麼」。

---

## 3. 背景二：PHP 專案怎麼跑？從瀏覽器到畫面

如果你和我一樣是前端/Node 背景，PHP 專案最陌生的地方是它的執行模型。這節把「從瀏覽器發請求到畫面出現」的完整流程講清楚。

### 3.1 什麼是「Server-Side Render」

現代前端（React/Vue）多半是 **SPA**：伺服器丟一包 JS 給瀏覽器，瀏覽器跑 JS、在瀏覽器端把畫面「畫」出來（client-side render）。

傳統 PHP 相反：**HTML 是在伺服器上組好的**。瀏覽器要 `index.php`，伺服器上的 PHP 直譯器**當場執行**這支程式，程式可能去查資料庫、跑迴圈、把資料拼進 HTML 字串，最後把**一份完整的 HTML** 丟回瀏覽器。瀏覽器收到的是現成的 HTML，直接顯示。這就是 server-side render。

一個關鍵差異：`.php` 檔案**不是靜態檔**。當你請求 `/index.php`，Apache 不會像丟圖片那樣把檔案原封不動送出去——它會把檔案交給 PHP 執行，送出的是**執行結果**。但同一個網站裡的 `.css`、`.js`、`.png` 就是靜態檔，Apache 直接送檔案內容，PHP 完全不介入。

### 3.2 PHP 是「怎麼」在 Apache 裡被執行的？mod_php vs PHP-FPM

這是兩種常見架構：

- **mod_php**：PHP 直譯器被編成 Apache 的一個模組，直接活在 Apache 的工作行程裡。Apache 一看到 `.php`，就在自己行程內把它跑掉。設定簡單，是很多老專案、也是官方 `php:5.6-apache` Docker image 的預設。
- **PHP-FPM**：PHP 跑成一組獨立的行程池，Apache/nginx 透過 FastCGI 協定把 `.php` 請求「轉發」給它。這是現在比較主流、效能與隔離性較好的做法（nginx 只能用這種，因為 nginx 沒有 mod_php）。

我這個專案用的是 `php:5.6-apache`，也就是 **mod_php**。知道這點很重要：它代表 PHP 的行為由容器內那顆 Apache 直接掌管，`.htaccess` 那些規則也是這顆 Apache 在讀。

### 3.3 完整流程：一次請求，其實是很多次請求

使用者打開 `https://app.example.com/legacyapp/`，看似一個動作，背後是一連串來回：

1. 瀏覽器送出 `GET /legacyapp/`。
2. 請求穿過反向代理，到容器 Apache。
3. 網址結尾是 `/`（目錄），Apache 依 `DirectoryIndex` 找到 `index.php`。
4. `.htaccess` 生效：先過驗證（沒帶帳密就回 `401`，瀏覽器彈出登入框；帶了正確帳密才放行）。
5. mod_php 執行 `index.php`：查 MariaDB、組出 HTML，回傳。
6. 瀏覽器收到 HTML，開始解析。它讀到 `<link href="css/app.css">`、`<script src="js/app.js">`、`<img src="...">`——**每一個都會再發一次請求**。
7. 這些子請求多半是靜態檔，Apache 直接送檔（不經過 PHP）。
8. 頁面上的 JS 可能再用 AJAX/fetch 去打其他 `.php`（例如抓地圖資料、搜尋結果），**又是一輪來回**。
9. 全部資源到齊，瀏覽器完成渲染。

第 6 步是理解「前端拿不到資源」的關鍵：**主頁 HTML 出得來，不代表整頁正常。** 那些 `css`/`js` 子請求只要路徑對不上，版面就會掉光。第二關就是在講這件事。

### 3.4 PHP 5.6 與新版差在哪？為什麼老專案卡在 5.6

PHP 5.6 是 2014 年的版本，早已 end-of-life。和 7.x / 8.x 相比，幾個重點差異：

- **效能**：PHP 7.0 對執行引擎（Zend Engine）做了大改，同樣的程式常快上一倍以上；8.0 又加了 JIT。5.6 在這方面是明顯落後的。
- **舊資料庫函式被移除**：很多古董 PHP 用的是 `mysql_query()` 這類 `mysql_*` 函式（注意不是 `mysqli`）。這組函式在 5.5 被標記棄用、**在 7.0 被整組移除**。這是老專案升級最痛的一關——你得把整個資料庫存取層改寫成 `mysqli` 或 `PDO`。
- **語法與型別**：7.x 才有純量型別宣告（`function f(int $x): string`）、null 合併運算子 `??`；7.4 有箭頭函式、typed properties；8.0 有 union types、named arguments、`match`、建構子屬性提升、nullsafe `?->`；8.1 有 enum。這些 5.6 全都沒有。
- **錯誤處理**：7.x 把許多致命錯誤變成可捕捉的 `Error` 例外。

**為什麼卡在 5.6？** 通常不是不想升，而是升級成本高：程式碼裡散落著已被移除的函式與寫法，一升上去到處爆，而且往往沒有測試可以保護重構。對這種專案，先「原封不動地容器化、讓它在現代主機上跑起來」，常常是比「一邊搬一邊改寫」更務實的第一步——這也是我這次的策略。

> 附帶一提：把 5.6 這種老 image 容器化，`apt` 來源常常已經失效，Dockerfile 裡會看到把來源改指到 `archive.debian.org`、關掉憑證檢查之類的動作。這是搬古董的常態，不是你做錯了什麼。

---

## 4. 第一關：反向代理——為什麼連登入框都不出現

### 背景

主機上原本就有一顆 Apache，直接服務這個網域。現在 app 搬進容器、只把容器的 80 port 映射到主機的 `8080`。所以主機那顆 Apache 的角色要從「直接服務檔案」變成「**反向代理**」——把公開網域的流量，轉發到 `127.0.0.1:8080`。這對 nginx 使用者是熟到不行的 `proxy_pass`，只是換成 Apache 的 `ProxyPass`。

我照著寫了一份 `:443` 的 VirtualHost，內容其實完全正確：

```apache
<IfModule mod_ssl.c>
<VirtualHost *:443>
    ServerName app.example.com
    SSLEngine on
    SSLCertificateFile    /etc/letsencrypt/live/app.example.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/app.example.com/privkey.pem

    ProxyRequests Off
    ProxyPreserveHost On

    ProxyPass        / http://127.0.0.1:8080/
    ProxyPassReverse / http://127.0.0.1:8080/
</VirtualHost>
</IfModule>
```

`apache2ctl configtest` 回 `Syntax OK`，也重啟了。但網站就是連登入框都出不來。

### 診斷

我一度以為是 proxy 規則寫錯。但真正的問題在更外面一層——在**檔名**。列出 `sites-enabled/`：

```
000-default.conf@                 -> ../sites-available/000-default.conf
app.example.com.conf2@            -> ../sites-available/app.example.com.conf2
app.example.com-le-ssl.conf2@     -> ../sites-available/app.example.com-le-ssl.conf2
```

看到 `.conf2` 了嗎？結尾是 `.conf2`，不是 `.conf`。

回想背景一那行：`IncludeOptional sites-enabled/*.conf`。glob `*.conf` 要求檔名結尾是 `.conf`，而 `.conf2` 結尾是 `2`。**Apache 從頭到尾沒把這兩個檔案讀進來。** 它們存在、是 symlink、語法也正確，但對 Apache 來說等於不存在。

這也解釋了那個假象：`configtest` 回 `Syntax OK`，不是因為我的 proxy 設定通過檢查，而是因為 **Apache 根本沒讀到它**——它不可能對一個沒載入的檔案報語法錯。

用 `apache2ctl -S` 就能戳破：

```bash
$ apache2ctl -S
VirtualHost configuration:
*:80    app.example.com (/etc/apache2/sites-enabled/000-default.conf:1)
# ← 只有 000-default，我那兩個 proxy vhost 根本沒出現
```

### 修正

把檔名改回標準的 `.conf`，重新啟用：

```bash
cd /etc/apache2/sites-available
mv app.example.com.conf2        app.example.com.conf
mv app.example.com-le-ssl.conf2 app.example.com-le-ssl.conf

# 移除舊的 .conf2 symlink，用 a2ensite 建立正確的
rm /etc/apache2/sites-enabled/app.example.com*.conf2
a2ensite app.example.com.conf app.example.com-le-ssl.conf
a2enmod proxy proxy_http ssl rewrite   # proxy 相關模組別忘了開

apache2ctl configtest && systemctl reload apache2
apache2ctl -S      # 這次應該看到 :80 和 :443 都有你的網域
```

> 小陷阱：檔名改對、檔案這次真的被載入後，`configtest` 反而可能開始抱怨 `Invalid command 'ProxyPass'`。別慌——那是在告訴你 `mod_proxy` 還沒開，補上 `a2enmod proxy proxy_http` 即可。換句話說，**這次的 `configtest` 才是真正在檢查你的 proxy 設定**，跟之前那個假性的 `Syntax OK` 完全不同。

### 可帶走的通則

> **存在 ≠ 生效。** 一份 100% 正確的設定，只因為 Apache 沒把它 include 進來，就可以完全沒作用。而且它是**沉默地失效**——不給你 stack trace，只給你一個看起來很無辜的 `Syntax OK`。以後看任何設定系統，都先問一句：「這檔案真的被讀到了嗎？」用 `apache2ctl -S` 去問「實際載入了什麼」，不要只看檔案內容就相信。

（後來我還踩到這條通則的兩次變奏：一份從舊 CentOS 主機搬來的 `httpd.conf` 被掛進 Debian 容器，但 Debian 的 `apache2.conf` 從不 include 它——而且它裡面的 `ServerRoot "/etc/httpd"`、`User apache` 都是 CentOS 慣例，真被載入還會讓容器起不來。「掛進去 ≠ 被載入」，同一課上了三次。）

---

## 5. 第二關：DocumentRoot 與子路徑前綴

這一關是反向代理最惱人、也最能考驗「前端如何取得資源」的一題。nginx 使用者對它其實不陌生——就是 `proxy_pass` 尾斜線的那個老坑，只是這次被逼到看清底層。

### 背景：DocumentRoot 與 URL → 檔案的對應

`DocumentRoot` 就是 nginx 的 `root`：網站根目錄。容器裡我的 `DocumentRoot` 被設成 `/var/www/html/legacyapp_src`（app 就在這底下，`index.php` 直接在裡面）。所以在容器眼中：

- URL `/` → `/var/www/html/legacyapp_src/`（→ `index.php`）
- URL `/webgis/` → `/var/www/html/legacyapp_src/webgis/`

一開始我把 app 掛在**公開根目錄**（`ProxyPass / → :8080/`），所以 `https://app.example.com/` 正常。但客戶要它掛在**子路徑** `/legacyapp/`。麻煩就從這裡開始。

### 症狀：帶不帶斜線，結果天差地別

我把 proxy 改成 `ProxyPass /legacyapp/ http://127.0.0.1:8080/`（來源前綴 `/legacyapp/` 換成目標的 `/`，等於**剝掉前綴**）。然後打：

```
https://app.example.com/legacyapp/webgis?lang=zh_TW   ← 注意 webgis 後面沒有斜線
```

結果被轉到 `https://app.example.com/webgis/?lang=zh_TW`（**前綴不見了**），最後 `Not Found`。

### 診斷：前綴被剝掉後，容器不知道自己活在子路徑下

一步步拆：

1. 主機 Apache 把 `/legacyapp/webgis` 的前綴剝掉，送進容器的是 `/webgis`。
2. 容器看到 `/webgis` 是個**目錄**，Apache 的 `mod_dir` 對「指向目錄卻沒帶尾斜線」的請求，會回一個 `301`，叫瀏覽器改用帶斜線的 `/webgis/`。
3. **陷阱在這**：容器完全不知道自己被掛在 `/legacyapp/` 底下（前綴在第 1 步就沒了），所以它補斜線生出來的轉址目標是 `/webgis/`，**不帶前綴**。
4. 瀏覽器照這個 301 跑到 `/webgis/`，這條路徑不符合 `/legacyapp/`，掉回主機本機的 DocumentRoot → 找不到 → `404`。

根因一句話：**前綴一旦在代理層被剝掉，容器產生的所有「自我參照網址」——補斜線的轉址、`Location` 跳轉、HTML 裡的絕對連結——通通會少掉前綴，然後集體迷路。**

這正是「前端如何取得資源」的核心。決定成敗的其實是一個問題：**這個 app 的資源連結是怎麼寫的？**

- **相對路徑**（`href="css/app.css"`）：瀏覽器以當前網址 `.../legacyapp/` 為基準解析 → 命中 → ✅
- **自帶前綴的絕對路徑**（`/legacyapp/css/app.css`）：一路對齊 → ✅
- **不帶前綴的根絕對路徑**（`/css/app.css`）：瀏覽器抓 `.../css/...`（公開根）→ 不在 `/legacyapp/` 底下 → ❌ 掉樣式

### 修正：不要剝前綴，全程保留

與其跟「剝前綴」纏鬥，正解是**全程保留前綴**，讓容器自己也活在 `/legacyapp/` 底下。這樣補斜線、Location、絕對連結全部自動對齊。要動兩個地方。

**其一，主機 vhost：proxy 改成不剝前綴**（兩邊路徑一致）：

```apache
ProxyPass        /legacyapp  http://127.0.0.1:8080/legacyapp
ProxyPassReverse /legacyapp  http://127.0.0.1:8080/legacyapp
```

**其二，容器 Apache：用 `Alias` 把 URL 前綴對映到 app 目錄。** 我不改 image、而是掛一份設定進**會被載入**的 `conf-enabled/`（記取第一關的教訓）：

```apache
# landdec-alias.conf  →  掛到容器的 /etc/apache2/conf-enabled/landdec-alias.conf
Alias /legacyapp /var/www/html/legacyapp_src

<Directory /var/www/html/legacyapp_src>
    AllowOverride All
    Require all granted
</Directory>
```

`Alias` 的作用是「把某段 URL 前綴，對映到某個檔案系統路徑」，DocumentRoot 不用整個搬。`AllowOverride All` 一定要有，否則 app 裡的 `.htaccess`（下一關的驗證、還有把 `/foo` 改寫成 `/foo.php` 的 rewrite）會失效。

驗證由內而外，一次一步：

```bash
# 1. 直接打容器（繞過主機），確認容器自己認得前綴了
curl -I http://127.0.0.1:8080/legacyapp/          # 期待 401（驗證生效）
curl -I -u webuser:'********' http://127.0.0.1:8080/legacyapp/webgis
#   期待 301，且 Location 這次「帶」/legacyapp/ 前綴 ← 原本壞掉、現在修好的那一點

# 2. 再改主機 vhost、reload，最後從瀏覽器測完整鏈
```

### 一個容易誤判的收尾：301 快取的鬼魂

修好之後，我用無痕視窗測一切正常，但用**之前踩過舊設定的那顆瀏覽器**測，卻還是 404。差別只有一個：那顆瀏覽器記得舊的你。

`301` 是 **Moved Permanently（永久轉址）**，瀏覽器會把它**快取起來**，又久又頑固。所以舊瀏覽器裡還躺著一筆「`/legacyapp/webgis` → 永久搬到 `/webgis/`」的紀錄，它根本不問伺服器，直接把你送去錯的地方。無痕視窗沒有這份歷史包袱，每筆都重新問，所以拿到的是正確結果。

**這個 404 來自瀏覽器的記憶，不是伺服器。** 驗證方法：開 devtools → Network，看那筆請求是不是標著 `301 (from disk cache)`。清掉快取（或勾 Disable cache 重整）即可。

> 工程習慣：**除錯期間，轉址一律用 `302`（暫時）而不是 `301`（永久）**，等設定定稿再換回 301。302 不會被瀏覽器頑固快取，你就不會被自己半小時前的設定纏上。

---

## 6. 第三關：權限管控——兩條獨立的軸

這是我原本就想學的主題，而它比我預期的有結構。這一節把 Apache 的存取控制、以及相關的那幾個檔案講清楚。

### 背景：驗證（Authentication）vs 授權（Authorization）

老 Apache（2.2 時代，現在靠 `mod_access_compat` 相容）的存取控制，其實是**兩條各自獨立的軸**：

- **你是誰**（authentication）：帳號密碼。用 `AuthType` / `AuthName` / `AuthUserFile` / `Require valid-user`。
- **你從哪來**（authorization by host）：來源 IP。用 `Order` / `Allow` / `Deny`（2.2 語法），或 `Require ip`（2.4 語法）。

而 `Satisfy` 這個指令，決定這兩條軸**怎麼合併**：

- `Satisfy All`（預設）：兩道都得過。
- `Satisfy Any`：過一道就行。

### 我那份 .htaccess 的解剖

去識別化後長這樣：

```apache
AuthUserFile /var/www/html/.htpasswd     # 密碼檔在哪
AuthName "Please Log In"                  # ← 登入框上顯示的標題（realm）
AuthType Basic                            # HTTP Basic 驗證
require valid-user                        # 任何登入成功的帳號都放行

Order allow,deny
#Allow from 203.0.113.0/255.255.255.0     # ← 整行被「註解掉」了
Satisfy any                               # ← 關鍵

RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^([^\.]+)$ $1.php [NC,L]      # 把 /foo 內部改寫成 /foo.php
```

逐條讀它做了什麼：

- **`AuthType Basic` + `AuthName`**：啟用 HTTP Basic 驗證。瀏覽器收到 `401` 加上 `WWW-Authenticate: Basic realm="Please Log In"` 這個 header，就會彈出那個原生的帳密對話框。那個「登入框」的源頭，就在這兩行。
- **`AuthUserFile` + `.htpasswd`**：密碼檔的位置。`.htpasswd` 是用 `htpasswd` 工具產生的，一行一個 `帳號:雜湊密碼`。
- **`Order allow,deny` + `#Allow from ...`**：IP 白名單那條軸。但注意 `Allow` 那行**被井字號註解掉了**，所以在 IP 這條軸上，等於「對所有人拒絕」。
- **`Satisfy any`**：兩道門只要過一道即可。IP 那道對所有人關著，但只要**帳密**過，整體就放行。

合起來的實際效果是：**只看帳密、對全世界開放**——任何人只要有那組帳密，從任何 IP 都進得來，包括反向代理那個內部 IP。

這其實解掉了我一個長期的誤判：我看到早期 log 裡有一堆 `client denied by server configuration`（IP 授權被拒的 403），就以為「一定有一道活的 IP 牆擋著」。但讀了這份**當下**的檔案、加上一個真實點擊（webgis 正常開），才確定那道牆早就被 `Satisfy any` 關掉了。那些 403 是這份 `.htaccess` 還沒長成現在這樣之前的舊狀態。

### 為什麼 .htaccess 需要 AllowOverride

`.htaccess` 不是預設就會生效的。Apache 主設定裡必須對該目錄設 `AllowOverride`，`.htaccess` 才會被讀。這是一個安全與效能的取捨——`AllowOverride None`（Debian 對 `/var/www/` 的預設）代表「忽略所有 `.htaccess`」。

- `AllowOverride None`：完全不理 `.htaccess`。
- `AllowOverride AuthConfig`：只允許 `.htaccess` 裡的驗證相關指令。
- `AllowOverride All`：全部允許。

所以在第二關那份 `Alias` 設定裡，`<Directory>` 一定要配 `AllowOverride All`，否則這份 `.htaccess` 的驗證和 rewrite 全部失效。**「登入框不出現」的其中一個可能根因，就是 `AllowOverride` 沒開。**

還有一個常見的安全防護，通常放在主設定裡，避免 `.htaccess` / `.htpasswd` 這種檔案被當靜態檔直接下載：

```apache
<Files ".ht*">
    Require all denied
</Files>
```

### 反向代理下的 IP 白名單陷阱

如果你想把那條 `Allow from` 加回來，有個 nignx 使用者也熟的眉角：**請求穿過反向代理後，後端看到的來源 IP 是代理的 IP，不是真實使用者。** 所以直接解除註解 `Allow from <某網段>`，只會把**所有人**擋掉（因為大家都變成代理的 IP）。

正解是先用 `mod_remoteip` 從 `X-Forwarded-For` 還原真實 client IP：

```apache
# 主機那層 vhost 送出真實 IP
RemoteIPHeader X-Forwarded-For
RemoteIPTrustedProxy 127.0.0.1
```

（對應到 nginx，就是 `proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;` 加上 `real_ip` 模組那套。同一個概念。）

### 可帶走的通則

> 存取控制不是一個開關，是**兩條獨立的軸（身分 / 來源）加一個合併規則（Satisfy）**。看懂這個結構，你才不會把「登入框」和「IP 拒絕」混為一談。另外，`.htaccess` 要生效得靠 `AllowOverride`；反向代理後要判斷真實來源得靠 `X-Forwarded-For` 還原。

---

## 7. 第四關：容器連主機資料庫的三道閘門

最後一關：app 在容器裡，資料庫是**主機上**那顆（其他專案共用、有真實資料）。首頁一開始顯示「資料準備中」，因為容器連到的是 compose 裡另一顆**空的** MariaDB，不是主機那顆。

要讓容器連到主機上的服務，有**三道閘門，必須三道全開**：

```
web 容器
  │  ← 閘門 1：路由（能不能走到主機？）
  ▼
主機網路 gateway
  │  ← 閘門 2：監聽（mariadb 有沒有在容器連得到的位址上聽？）
  ▼
主機 MariaDB
  │  ← 閘門 3：授權（這個帳號允不允許從容器的來源 IP 連？）
  ▼
資料
```

任何一道關著，錯誤訊息都不同——這也是為什麼下面那個 `mysqli` 測試很好用，它會直接告訴你卡在哪。

**閘門 1｜路由。** 在 Linux 上，容器要用 `host.docker.internal` 這個名字連回主機，需要在 compose 裡給該 service 加 `extra_hosts`：

```yaml
services:
  web:
    extra_hosts:
      - "host.docker.internal:host-gateway"
```

沒加這行，容器裡 `host.docker.internal` 根本不會解析。

**閘門 2｜監聽位址（bind-address）。** 主機的 MariaDB 必須聽在容器連得到的位址上。在主機上檢查：

```bash
ss -tlnp | grep 3306
# 若只看到 127.0.0.1:3306 → 容器（在不同 network namespace）連不到
# 需要聽在 0.0.0.0 或 docker bridge 的 gateway 位址（通常 172.17.0.1）
```

> 安全提醒：改成 `0.0.0.0` 等於把 3306 攤在主機所有網卡上。務必確認防火牆沒對公網開放，或只綁 docker bridge 位址。

**閘門 3｜帳號授權（GRANT 的來源）。** 這是我卡住的那道。從容器連過去，MariaDB 直接回：

```
Host '172.18.0.13' is not allowed to connect to this MariaDB server
```

這訊息是 **MariaDB 自己回的**，代表封包已經抵達它（閘門 1、2 都通了），只是這個帳號不允許從容器的來源 IP 連。MariaDB 的帳號是 `使用者@來源` 的組合，來源那欄是**真的在比對**的：

```sql
-- 原本這帳號只開給某台特定主機 + localhost，從沒打算讓容器連
SELECT user, host FROM mysql.user WHERE user='appuser';
-- appuser | 203.0.113.37
-- appuser | localhost

-- 補上 docker 網段的來源（用萬用 172.%，別寫死某個會變動的 IP）
CREATE USER 'appuser'@'172.%' IDENTIFIED BY '<主機該帳號的真實密碼>';
GRANT ALL PRIVILEGES ON appdb.* TO 'appuser'@'172.%';
FLUSH PRIVILEGES;
```

從容器內一次測穿三道閘門（`mysqli` 在容器裡已裝，錯誤訊息會定位到單一閘門）：

```bash
docker compose exec web php -r '$m=@mysqli_connect("host.docker.internal","appuser","<密碼>","appdb",3306); echo $m?"OK\n":("FAIL: ".mysqli_connect_error()."\n");'
```

`OK` 代表三道全開；`No route to host` / `Connection refused` 是閘門 1 或 2；`Access denied` 是閘門 3 或密碼。最後別忘了在 `.env` 把 app 的 `DB_HOST` 設成 `host.docker.internal`（測試通了不代表 app 換過去了）。

### 可帶走的通則

> 「連不上資料庫」不是一個問題，是**三個**：路由、監聽、授權。而且 MariaDB 帳號的 `host` 欄位是真的在比對來源 IP 的——這在你把服務容器化、來源 IP 從此變成 docker 網段時，特別容易中招。

---

## 8. 番外：為什麼 Next.js 跟 PHP 剛好相反

專案裡還有一個 Payload CMS（Next.js）要掛在 `/cms`。它跟前面的 PHP app 剛好是**相反**的案例，正好把「前端如何取得資源」這堂課補完。

PHP app 的資源連結**自帶前綴**，所以第二關「保留前綴 + Alias」一上，app 不用改就對齊。Next.js 相反：它預設把資源（`/_next/...`）和內部連結寫成**不帶前綴的根絕對路徑**。這正是第二關列的「掉樣式」那一類——而且這次**代理怎麼喬都救不了**，因為迷路的是 app 自己生出來的網址。

解法是在 app 端設 `basePath: '/cms'`（Next.js 設定），它就會把資源和連結都加上 `/cms` 前綴；代理則改成**保留前綴**。而且有個關鍵差異：`basePath` 和 `NEXT_PUBLIC_*` 是 **build-time** 烤進前端 bundle 的，改了得**重新 build image**，不是 reload 就好——這跟前面改 Apache（runtime 掛載、reload 生效）完全不同。

### 可帶走的通則

> 「這個改動該 reload 還是 rebuild？」取決於它是 **runtime** 設定還是 **build-time** 設定。Apache 設定是 runtime；前端框架的 base path、`NEXT_PUBLIC_*` 是 build-time。分不清這個，你會改了設定卻怎麼樣都不生效。

---

## 9. 真正該帶走的：一套除錯方法論

修好一堆 bug 不是重點。重點是這一路練出來的、能帶去下一個系統的方法。

**由外而內，一次一層。** 沿著請求路徑（主機 Apache → 容器 Apache → `.htaccess` → PHP → DB）一站一站往內推，每關命名（A/B/C/D）當進度地圖。**一次只動一個變數**，壞了也容易退。

**Predict-then-verify（先預測、再驗證）。** 每一層先下注、再開獎。這習慣的價值不在猜對，而在於它把你腦中的心智模型**逼出來對帳**：猜錯時，你才知道原本哪裡想歪了。

**用 curl 做分層隔離。** 這是最實用的一招：直接打 `127.0.0.1:8080`（繞過主機）對比走完整鏈，用回應裡的 `Server:` header（`Ubuntu` 是主機、`Debian` 是容器）判斷是哪一層在回應。一個狀態碼、一行 header，就把「主機 vs 容器」的戰線定死。而且 curl 沒有瀏覽器快取，不會被那種「301 鬼魂」騙到。

**讀現況，勝過從歷史推理。** 「昨天 log 裡的一個 403」不能證明「今天的設定還在擋」。只有讀當下那份 `.htaccess`、加一個真實點擊，才定得了案。

**別輕信任何單一來源——包括很有把握的那個。** 在整個過程裡，我（把這篇當作那個「經驗豐富的協作者」）至少判斷錯兩次：兩度預測那道 IP 牆還活著，還把一個 403 誤接到「資料準備中」那個症狀上。兩次都不是靠誰的推理翻案，是靠去讀當下的檔案、去點一下真實的連結才澄清的。所以：**手上那條 `curl` 回應、那份當下的設定檔，永遠高於任何看起來很篤定的推理。讀證據 > 聽權威。**

---

## 結語

回頭看，這個「前端拿不到資源」的模糊症狀，根因散落在四個完全不同的位置：一個看不見的 `.conf2` 檔名、一個被剝掉的路徑前綴、一份把 IP 牆關掉的 `.htaccess`、一組不認得容器來源的資料庫帳號。它們沒有一個能靠「盯著程式碼想」找出來——全都要靠沿著請求路徑、一層一層地驗證。

如果這篇對你有一個帶得走的東西，我希望是這句：**當某個東西「不動」時，不要問「哪裡寫錯了」，先問「請求走到哪裡斷掉了」。** 前者讓你盯著程式碼空想，後者讓你沿著那條鏈，一站一站把它逼出來。

---

*本文的網域、帳號、密碼、內部 IP 均為去識別化後的示意值。*
