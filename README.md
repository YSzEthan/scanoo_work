# Scanoo - 想法收集器

![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)
![Code Quality](https://img.shields.io/badge/ESLint-0%20errors-brightgreen)
![Type Safety](https://img.shields.io/badge/TypeScript-100%25%20safe-blue)

##  功能

### 核心功能
-  **分頁瀏覽**：每頁 10 筆，智能分頁算法（抽離為純函數）
-  **Markdown 支援**：豐富的文字排版（粗體、斜體、程式碼、連結等）
-  **即時通知**：Toast 通知系統取代傳統 alert

### 用戶體驗
-  **鍵盤快捷鍵**：Enter 送出，Shift+Enter 換行
-  **中文輸入法優化**：注音、拼音選字不會誤觸發
-  **載入動畫**：Skeleton Screen提供流暢的視覺反饋
-  **響應式設計**：桌面和移動裝置
-  **刪除確認**：防止誤刪，顯示內容預覽

### 技術
-  **狀態機模式**：IdeaCard 使用明確的狀態轉換，避免非法狀態
-  **類型安全**：完整的 TypeScript，strict 模式，0 個 `any`
-  **統一邏輯**：所有 CRUD 操作統一為「操作 → 重新載入」模式
-  **Fail Fast**：環境變數、API 錯誤在最早時機捕獲

---

##  Markdown 使用指南

### 支援語法

| 語法 | 效果 |
|------|------|
| `**粗體**` | **粗體** |
| `*斜體*` | *斜體* |
| `~~刪除線~~` | ~~刪除線~~ |
| `` `程式碼` `` | `程式碼` |
| `# 標題` | 標題（H1-H3） |
| `- 列表` | 無序列表 |
| `1. 列表` | 有序列表 |
| `[文字](網址)` | 連結 |
| `> 引用` | 引用區塊 |

### 測試範例

建立一個想法，貼上以下內容測試：

```markdown
# 我的想法清單

這是一個**很棒的**想法！支援 *Markdown* 語法。

## 功能特色
- 支援 Markdown
- 支援 `程式碼`
- 支援 [連結](https://example.com)

## 程式碼範例
```javascript
console.log("Hello Scanoo!");
```

> 這是一句引用


---

##  專案結構

```
scanoo/
├── app/
│   ├── components/
│   │   ├── Toast.tsx              # Toast 通知組件
│   │   ├── IdeaCard.tsx           # 想法卡片主組件（狀態機模式）
│   │   ├── IdeaViewMode.tsx       # 查看模式子組件（顯示、編輯、刪除按鈕）
│   │   ├── IdeaEditMode.tsx       # 編輯模式子組件（表單、儲存、取消）
│   │   ├── IdeaDeleteConfirm.tsx  # 刪除確認子組件（確認對話框）
│   │   └── IdeaCardSkeleton.tsx   # 載入Skeleton Screen
│   ├── contexts/
│   │   └── ToastContext.tsx       # Toast 全局狀態（取消 useMemo 過度優化）
│   ├── hooks/
│   │   └── useIdeas.ts            # CRUD Hook（統一重新載入）
│   ├── utils/
│   │   └── pagination.ts          # 分頁算法（純函數，可測試）
│   ├── layout.tsx                 # 根佈局
│   ├── page.tsx                   # 主頁面
│   └── globals.css                # 全局樣式 + 動畫
├── lib/
│   └── supabase.ts                # Supabase 客戶端
├── public/                        # 靜態資源
├── .env.local.example             # 環境變數範例
├── package.json                   # 專案依賴
├── tsconfig.json                  # TypeScript 配置（strict: true）
├── next.config.ts                 # Next.js 配置
└── README.md                      # 本文件
```

---

##  架構設計

### 1. 狀態機模式（IdeaCard）

**用類型系統消除邏輯錯誤**

```typescript
//  錯誤做法：Boolean 組合爆炸
const [isEditing, setIsEditing] = useState(false)
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
// 問題：可能出現 isEditing=true && showDeleteConfirm=true 的非法狀態

//  正確做法：狀態機
type CardMode = 'view' | 'edit' | 'delete-confirm'
const [mode, setMode] = useState<CardMode>('view')
// 好處：TypeScript 保證只有 3 種合法狀態，不可能錯誤組合
```

**狀態轉換：**
```
view ──edit 按鈕──> edit ──save/cancel──> view
  └──delete 按鈕──> delete-confirm ──confirm/cancel──> view
```

### 2. 統一邏輯模式（useIdeas）

**單一代碼路徑，消除特殊情況**

```typescript
//  錯誤做法：特殊情況處理
if (currentPage === 1) {
  // 樂觀更新邏輯（14 行代碼）
} else {
  // 重新載入邏輯
}

//  正確做法：統一策略
await fetchIdeas(currentPage)  // 所有操作後統一重新載入
```

**好處：**
- 只有一條代碼路徑要測試
- 行為可預測
- 減少 13.6% 代碼量

### 3. 純函數設計（pagination）

**邏輯與展示分離，提高可測試性**

```typescript
// app/utils/pagination.ts
export function getPaginationPages(
  current: number,
  total: number,
  delta: number = 2
): (number | 'ellipsis')[] {
  // 10 行純邏輯，無副作用
}

// 使用
{getPaginationPages(currentPage, totalPages).map(item =>
  item === 'ellipsis' ? <span>...</span> : <button>{item}</button>
)}
```

**好處：**
- 可以寫單元測試驗證分頁算法
- 可以在其他地方重用
- JSX 從 33 行縮減為 5 行

### Fail Fast 原則

**環境變數驗證：**
```typescript
// lib/supabase.ts
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Please check .env.local and ensure NEXT_PUBLIC_SUPABASE_URL ' +
    'and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
  )
}
```

**好處：**
- 應用啟動時立即失敗（而非運行時）
- 清晰的錯誤訊息
- 更好發現問題

---

# 開發記錄

### 透過 Linus Torvalds 的 "Good Taste" 哲學讓 claude code 進行以下修改：

1. **消除特殊情況**
   -  問題：「第一頁樂觀更新」的特殊邏輯
   -  更改：統一為單一代碼路徑：`插入 → 重新載入`
   -  結果：從兩條邏輯分支簡化為一條，減少 bug 藏身處

2. **狀態機優於 Boolean 組合**
   -  問題：4 個互相依賴的 boolean 狀態
   -  更改：單一 `CardMode` 類型：`'view' | 'edit' | 'delete-confirm'`
   -  結果：不可能出現非法狀態組合，TypeScript 編譯時保證正確性

3. **Fail Fast 原則**
   -  問題：環境變數使用 `!` 運行時無聲失敗
   -  更改：啟動時立即驗證，提供清晰錯誤訊息
   -  結果：快速發現問題

4. **關注資料結構而非代碼**
   -  問題：用 if/else 修補設計問題
   -  更改：重新設計資料結構讓問題消失
   -  結果：Toast ID 從隨機數改為單調遞增，永不碰撞

#### 重構成果

| 指標 | 重構前 | 重構後 | 改善 |
|------|--------|--------|------|
| **組件代碼行數** | IdeaCard: 213 行 | IdeaCard: 79 行 + 3 個子組件 |  減少 63% |
| **過度優化** | 1 處 (`useMemo`) | 0 處 |  100% 消除 |
| **特殊情況分支** | 3 處 | 0 處 |  全部消除 |
| **狀態更新策略** | 3 種混用 | 1 種統一 |  簡化 67% |
| **狀態複雜度** | 多個 boolean | 1 個 enum (3 種狀態) |  降低 81% |
| **組件職責分離** | 混雜在一起 | 單一職責子組件 |  100% 模組化 |

---

##  重構歷程

### Phase 1: 初始開發
-  基本 CRUD 功能
-  Markdown 支援
-  Toast 通知系統
-  存在 6 個 ESLint 錯誤
-  有 8 處類型 hack
-  3 處特殊情況邏輯

### Phase 2: 第一次重構

#### 修復 1: 環境變數無聲炸彈
```diff
- const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
+ const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
+ if (!supabaseUrl || !supabaseAnonKey) {
+   throw new Error('Missing Supabase environment variables...')
+ }
```
**影響：** 從運行時神秘錯誤 → 啟動時清晰錯誤

#### 修復 2: Toast ID 碰撞風險
```diff
- const id = Math.random().toString(36).substring(2, 9)
+ let nextIdRef = useRef(0)
+ const id = `toast-${++nextIdRef.current}`
```
**影響：** 從可能碰撞 → 永不碰撞

#### 修復 3: 消除特殊情況
```diff
- if (currentPage === 1 && data && data[0]) {
-   // 樂觀更新邏輯（14 行）
- } else {
-   fetchIdeas(currentPage)
- }
+ await fetchIdeas(currentPage)  // 統一策略
```
**影響：** 代碼減少 12 行（-13.6%），邏輯路徑從 2 → 1

#### 修復 4: 狀態機替代 Boolean
```diff
- const [isEditing, setIsEditing] = useState(false)
- const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
+ type CardMode = 'view' | 'edit' | 'delete-confirm'
+ const [mode, setMode] = useState<CardMode>('view')
```
**影響：** 狀態複雜度從 16 種可能 → 3 種合法

#### 修復 5: 分頁邏輯抽離
```diff
- {Array.from({length: totalPages}, ...).map(page => {
-   // 33 行嵌套邏輯，3 層縮排
- })}
+ {getPaginationPages(currentPage, totalPages).map(item => ...)}
```
**影響：** 可測試 + 可重用 + 減少縮排

#### 修復 6: 消除所有 `any` 類型
```diff
- p: ({...props}: any) => <p {...props} />
+ p: (props) => <p {...props} />  // TypeScript 自動推導
```
**影響：** 從 6 處 `any` → 0 處，100% 類型安全

---

### Phase 3: 第二次重構

####  P0 修復 1: 移除 useMemo 過度優化
**檔案：** `app/contexts/ToastContext.tsx:52-58`

```diff
- const contextValue = useMemo(() => ({
-   showToast, success, error, info, warning
- }), [showToast, success, error, info, warning])
- return (
-   <ToastContext.Provider value={contextValue}>
+ return (
+   <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
```

**原因：** 5 個函數已經用 `useCallback` 包裝，引用已穩定，`useMemo` 反而增加複雜度
**成果：**  刪除 7 行代碼，消除不必要開銷

####  P0 修復 2: 統一 CRUD 狀態更新策略
**檔案：** `app/hooks/useIdeas.ts`

**問題：** 混用「樂觀更新」和「重新抓取」兩種策略

```diff
  // deleteIdea: 雙重策略 → 統一重新抓取
- const remainingItems = ideas.length - 1
- if (remainingItems === 0 && currentPage > 1) {
-   fetchIdeas(currentPage - 1)
- } else {
-   setIdeas(prevIdeas => prevIdeas.filter(...))
-   setTotalCount(prev => prev - 1)
- }
+ await fetchIdeas(currentPage)

  // updateIdea: 本地更新 → 統一重新抓取
- setIdeas(prevIdeas =>
-   prevIdeas.map(idea =>
-     idea.id === id ? { ...idea, content: content.trim() } : idea
-   )
- )
+ await fetchIdeas(currentPage)
```

**成果：**  消除 2 個特殊分支，策略從 3 種 → 1 種

####  P1 修復 3: 改善新增後的跳轉邏輯
**檔案：** `app/hooks/useIdeas.ts:68`

```diff
- await fetchIdeas(currentPage)  // 留在當前頁
+ await fetchIdeas(1)            // 跳到第一頁
```

**用戶新增後立即看到新內容（UX 改善）**

####  P1 修復 4: IdeaCard 組件拆分
**檔案：** `app/components/`

**重構前：** `IdeaCard.tsx` 213 行（包含 3 種 mode 的所有 JSX）

**重構後：**
-  `IdeaCard.tsx` - 79 行（主組件，狀態管理）
-  `IdeaViewMode.tsx` - 108 行（查看模式）
-  `IdeaEditMode.tsx` - 48 行（編輯模式）
-  `IdeaDeleteConfirm.tsx` - 34 行（刪除確認）

**成果：**
-  主組件減少 134 行（-63%）
-  單一職責原則
-  可讀性和可維護性大幅提升

####  P2 修復 5: 簡化 useCallback 依賴
**檔案：** `app/hooks/useIdeas.ts`

```diff
  // addIdea 依賴
- }, [currentPage, fetchIdeas, toast])
+ }, [fetchIdeas, toast])

  // deleteIdea 依賴
- }, [ideas.length, currentPage, fetchIdeas, toast])
+ }, [currentPage, fetchIdeas, toast])
```

**成果：**  避免不必要的函數重建和子組件重新渲染

####  Phase 3 重構總結

| 項目 | 改善 |
|------|------|
| **代碼行數** | -141 行（IdeaCard 系列） |
| **過度優化** | 1 處 → 0 處 |
| **特殊分支** | 2 處 → 0 處 |
| **狀態策略** | 3 種 → 1 種 |
| **組件數量** | +3 個子組件（模組化） |

---

##  已知限制與未來改進

### 當前限制

1. **無用戶認證**
   - 現狀：任何人可編輯/刪除所有想法
   - 解決：整合 Supabase Auth + 更新 RLS 政策

2. **分頁計數效能**
   - 現狀：使用 `count: 'exact'`，大資料量時較慢
   - 解決：改用 `count: 'estimated'` 或無限滾動

3. **無搜尋功能**
   - 現狀：資料多時不易查找
   - 解決：PostgreSQL 全文搜尋 + 索引

---

## AI 輔助日誌

在claude.md中
 1.  編寫專案規格與需求目標
 2.  新增Linus Torvalds人格並在code review時應用
 3.  Always use content7

Prompts使用
 1.  解釋 A 與 B 的差異並且提出範例
 2.  @path 的 xx 行是否有其他的寫法並提出優缺點
 3.  @path 我想在 `輸入框` 新增中文輸入的enter選字判斷，並且在輸入時 enter 鍵送出卡片、shift + enter 則換行 (許願功能範例
