# React + Vite メモ帳アプリケーション

## プロジェクト概要

シンプルなメモ帳アプリケーション（OpenShift演習用フロントエンド）

**機能:**
- メモの作成・編集・削除
- ローカルストレージでの永続化
- レスポンシブデザイン
- バックエンドAPI連携対応（環境変数で切り替え）

## プロジェクトセットアップ

```bash
# プロジェクト作成
npm create vite@latest openshift-training-frontend -- --template react

cd openshift-training-frontend

# 依存関係インストール
npm install

# Tailwind CSS セットアップ
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Axios インストール（API通信用）
npm install axios
```

## ファイル構成

```
openshift-training-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── MemoList.jsx
│   │   ├── MemoForm.jsx
│   │   └── MemoItem.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── .env.development
├── .env.production
├── Dockerfile
├── nginx.conf
├── tailwind.config.js
├── vite.config.js
├── package.json
└── README.md
```

## 実装コード

### 1. tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 2. src/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### 3. src/App.jsx

```jsx
import { useState, useEffect } from 'react'
import MemoList from './components/MemoList'
import MemoForm from './components/MemoForm'
import './App.css'

function App() {
  const [memos, setMemos] = useState([])
  const [editingMemo, setEditingMemo] = useState(null)

  // ローカルストレージからメモを読み込み
  useEffect(() => {
    const savedMemos = localStorage.getItem('memos')
    if (savedMemos) {
      setMemos(JSON.parse(savedMemos))
    }
  }, [])

  // メモが変更されたらローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('memos', JSON.stringify(memos))
  }, [memos])

  // メモ追加
  const addMemo = (memo) => {
    const newMemo = {
      id: Date.now(),
      ...memo,
      createdAt: new Date().toISOString()
    }
    setMemos([newMemo, ...memos])
  }

  // メモ更新
  const updateMemo = (id, updatedMemo) => {
    setMemos(memos.map(memo => 
      memo.id === id ? { ...memo, ...updatedMemo } : memo
    ))
    setEditingMemo(null)
  }

  // メモ削除
  const deleteMemo = (id) => {
    if (window.confirm('このメモを削除しますか？')) {
      setMemos(memos.filter(memo => memo.id !== id))
    }
  }

  // 編集モード
  const startEdit = (memo) => {
    setEditingMemo(memo)
  }

  // 編集キャンセル
  const cancelEdit = () => {
    setEditingMemo(null)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📝 メモ帳アプリ
          </h1>
          <p className="text-gray-600">
            OpenShift Training - Frontend Demo
          </p>
        </header>

        <div className="mb-8">
          <MemoForm 
            onSubmit={editingMemo ? updateMemo : addMemo}
            editingMemo={editingMemo}
            onCancel={cancelEdit}
          />
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            メモ一覧 ({memos.length})
          </h2>
          <MemoList 
            memos={memos}
            onEdit={startEdit}
            onDelete={deleteMemo}
          />
        </div>
      </div>
    </div>
  )
}

export default App
```

### 4. src/components/MemoForm.jsx

```jsx
import { useState, useEffect } from 'react'

function MemoForm({ onSubmit, editingMemo, onCancel }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    if (editingMemo) {
      setTitle(editingMemo.title)
      setContent(editingMemo.content)
    } else {
      setTitle('')
      setContent('')
    }
  }, [editingMemo])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      alert('タイトルと内容を入力してください')
      return
    }

    if (editingMemo) {
      onSubmit(editingMemo.id, { title, content })
    } else {
      onSubmit({ title, content })
    }

    setTitle('')
    setContent('')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">
          タイトル
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="メモのタイトルを入力..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="content" className="block text-gray-700 font-semibold mb-2">
          内容
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="メモの内容を入力..."
          rows="6"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          {editingMemo ? '更新' : '追加'}
        </button>
        {editingMemo && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            キャンセル
          </button>
        )}
      </div>
    </form>
  )
}

export default MemoForm
```

### 5. src/components/MemoList.jsx

```jsx
import MemoItem from './MemoItem'

function MemoList({ memos, onEdit, onDelete }) {
  if (memos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
        メモがありません。上のフォームから新しいメモを追加してください。
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {memos.map((memo) => (
        <MemoItem
          key={memo.id}
          memo={memo}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export default MemoList
```

### 6. src/components/MemoItem.jsx

```jsx
function MemoItem({ memo, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-800">
          {memo.title}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(memo)}
            className="text-blue-500 hover:text-blue-700 font-medium transition duration-200"
          >
            編集
          </button>
          <button
            onClick={() => onDelete(memo.id)}
            className="text-red-500 hover:text-red-700 font-medium transition duration-200"
          >
            削除
          </button>
        </div>
      </div>

      <p className="text-gray-700 whitespace-pre-wrap mb-3">
        {memo.content}
      </p>

      <div className="text-sm text-gray-500">
        作成日時: {formatDate(memo.createdAt)}
      </div>
    </div>
  )
}

export default MemoItem
```

### 7. src/App.css

```css
/* 必要に応じてカスタムスタイルを追加 */
```

### 8. .env.development

```env
# 開発環境用
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=メモ帳アプリ（開発）
```

### 9. .env.production

```env
# 本番環境用（OpenShift Routeで上書き）
VITE_API_URL=https://backend-route-url/api
VITE_APP_NAME=メモ帳アプリ
```

### 10. Dockerfile

```dockerfile
# ビルドステージ
FROM node:18-alpine AS builder

WORKDIR /app

# 依存関係のインストール
COPY package*.json ./
RUN npm ci

# アプリケーションのコピーとビルド
COPY . .
RUN npm run build

# 本番ステージ
FROM nginx:alpine

# ビルドされたファイルをnginxにコピー
COPY --from=builder /app/dist /usr/share/nginx/html

# カスタムnginx設定
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/health || exit 1

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
```

### 11. nginx.conf

```nginx
server {
    listen 8080;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # Gzip圧縮
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # ヘルスチェックエンドポイント
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # SPAルーティング
    location / {
        try_files $uri $uri/ /index.html;
    }

    # キャッシュ設定
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 12. vite.config.js

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  preview: {
    port: 8080,
    host: true
  }
})
```

### 13. package.json（スクリプト部分）

```json
{
  "name": "openshift-training-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "axios": "^1.6.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "vite": "^5.0.0"
  }
}
```

## ローカル開発

```bash
# 開発サーバー起動
npm run dev

# ブラウザで http://localhost:3000 を開く
```

## ビルド

```bash
# プロダクションビルド
npm run build

# ビルド結果の確認
npm run preview
```

## OpenShift デプロイ方法

### 方法1: Source-to-Image (S2I)

```bash
# プロジェクト作成
oc new-project task-manager-dev

# S2Iでデプロイ
oc new-app nodejs:18~https://github.com/your-org/openshift-training-frontend.git \
  --name=frontend \
  -e VITE_API_URL=http://backend:8080/api

# Route作成
oc expose svc/frontend

# URL確認
oc get route frontend
```

### 方法2: Dockerfile

```bash
# Dockerfileを使ってビルド
oc new-app https://github.com/your-org/openshift-training-frontend.git \
  --name=frontend \
  --strategy=docker

# Route作成
oc expose svc/frontend
```

## OpenShift用YAML定義

### deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  labels:
    app: frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: frontend:latest
        ports:
        - containerPort: 8080
          protocol: TCP
        env:
        - name: VITE_API_URL
          valueFrom:
            configMapKeyRef:
              name: frontend-config
              key: api-url
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
```

### service.yaml

```yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend
  labels:
    app: frontend
spec:
  ports:
  - name: http
    port: 8080
    targetPort: 8080
    protocol: TCP
  selector:
    app: frontend
  type: ClusterIP
```

### route.yaml

```yaml
apiVersion: route.openshift.io/v1
kind: Route
metadata:
  name: frontend
  labels:
    app: frontend
spec:
  to:
    kind: Service
    name: frontend
  port:
    targetPort: http
  tls:
    termination: edge
    insecureEdgeTerminationPolicy: Redirect
```

### configmap.yaml

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: frontend-config
data:
  api-url: "https://backend-task-manager-dev.apps.sandbox.example.com/api"
```

## 環境変数の管理

**ビルド時に環境変数を埋め込む場合:**

```bash
# ConfigMapから環境変数を設定してビルド
oc set env bc/frontend --from=configmap/frontend-config

# ビルド実行
oc start-build frontend
```

**実行時に環境変数を注入する場合:**

```bash
# DeploymentConfigに環境変数設定
oc set env dc/frontend --from=configmap/frontend-config
```

## トラブルシューティング

### 問題: ビルドが失敗する

```bash
# ビルドログ確認
oc logs -f bc/frontend

# よくある原因
# - package.json の依存関係エラー
# - Node.jsバージョン不一致
# - メモリ不足
```

### 問題: 画面が真っ白

```bash
# Podログ確認
oc logs -f deployment/frontend

# ブラウザコンソールでエラー確認
# - JavaScriptエラー
# - APIエンドポイント設定ミス
# - CORS エラー
```

### 問題: バックエンドAPIに接続できない

```bash
# 環境変数確認
oc set env deployment/frontend --list

# ConfigMap確認
oc get configmap frontend-config -o yaml

# ネットワーク疎通確認
oc rsh deployment/frontend
curl http://backend:8080/actuator/health
```

## 機能拡張アイデア

### バックエンドAPI連携版

現在はローカルストレージ版ですが、バックエンドAPI連携に拡張可能:

```javascript
// src/api/memoApi.js
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export const getMemos = async () => {
  const response = await axios.get(`${API_URL}/memos`)
  return response.data
}

export const createMemo = async (memo) => {
  const response = await axios.post(`${API_URL}/memos`, memo)
  return response.data
}

export const updateMemo = async (id, memo) => {
  const response = await axios.put(`${API_URL}/memos/${id}`, memo)
  return response.data
}

export const deleteMemo = async (id) => {
  await axios.delete(`${API_URL}/memos/${id}`)
}
```

### 認証機能の追加

```javascript
// src/api/authApi.js
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials)
  localStorage.setItem('token', response.data.token)
  return response.data
}

export const logout = () => {
  localStorage.removeItem('token')
}

export const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}
```

## まとめ

このメモ帳アプリは:
- ✅ OpenShift演習用に最適化
- ✅ シンプルで理解しやすい
- ✅ 段階的に機能拡張可能
- ✅ バックエンドAPI連携対応
- ✅ Dockerコンテナ化済み
- ✅ ヘルスチェック対応

OpenShift演習では、このフロントエンドとSpring Bootバックエンドを組み合わせて、完全な3層アプリケーションを構築します。
