# 130031 - Software Engineering Group 18

Repository for tracking Group 18 progress.

## Contribution (Guide for Group mate)

此 repo 會用 `Deno` 爲核心, 前端會用 `Vite + Vue3` 開發, 後端同樣使用 `Deno`.

同時會用 `TypeScript` 撰寫.

### 建議開發環境設定

建議使用 `VSCode`, 配搭插件:

- `Deno`
- `JavaScript and TypeScript Nightly`
- `Vue Language Features (Volar)`
- `TypeScript Vue Plugin (Volar)`

打開 `VSCode` 時應該會有 4個 建議安裝插件, 都裝下去就可以了.

### 架構

```
.
├── .vscode             // project vscode 設定檔, 不用碰
├── src/
│   ├── client/         // 前端程式碼存放位置
│   │   ├── App.vue
│   │   ├── index.html
│   │   └── main.ts
│   └── server/         // 後端程式碼存放位置
│       └── entry.ts
├── .gitignore          // 讓 git 不追蹤那些文件夾或路徑, 不用碰
├── deno.json           // deno 相關設定, 不用碰
├── deno.lock           // 插件版本管理, 不用碰
└── vite.config.mjs     // 前端編譯選項, 不用碰
```

如果編輯 前端, 程式碼都會在 `./src/client` 裏面.
如果編輯 后端, 程式碼都會在 `./src/server` 裏面.

#### 前端

前端會用 SPA (Single Page Application) 方式設計.
檔案應該只會有一個 `index.html` 檔案, 應該不會有其他 `html` 檔案.

排版相關應用 `*.vue` 撰寫, 純邏輯則用 `*.ts`.

啓動 前端 開發環境, 隨時預覽請使用以下指令
```
deno task dev:client
```

啓動 前端 預覽 (編譯過後結果), 請使用以下指令.
```
deno task preview:client
```
#### 後端

Routing 還在考慮是否需要 framework, 暫時先放著.

啓動 後端 環境指令
```
deno task dev:server
```