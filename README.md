# メモ帳アプリ - OpenShift Training Frontend

React + Vite + Tailwind CSSで構築されたメモ帳アプリケーションのフロントエンドです。OpenShift Training用のデモアプリケーションとして開発されています。

## 機能

- 📝 メモの作成、編集、削除
- 📋 メモ一覧の表示
- 🔄 オフライン対応（ローカルストレージへの自動フォールバック）
- 🌐 RESTful APIとの連携
- 💅 モダンなUI（Tailwind CSS）

## 技術スタック

- **フレームワーク**: React 18.2
- **ビルドツール**: Vite 5.0
- **スタイリング**: Tailwind CSS 3.4
- **HTTPクライアント**: Axios 1.6
- **コンテナ**: Docker + Nginx

## セットアップ

### 必要な環境

- Node.js 18以上
- npm または yarn

### インストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

開発サーバーは `http://localhost:3000` で起動します。

### ビルド

```bash
npm run build
```

ビルドされたファイルは `dist/` ディレクトリに出力されます。

### プレビュー

```bash
npm run preview
```

ビルドされたアプリケーションを `http://localhost:8080` でプレビューできます。

## 環境変数

`.env` ファイルを作成して、以下の環境変数を設定できます：

```env
VITE_API_URL=http://localhost:8080/api
```

デフォルトでは `http://localhost:8080/api` が使用されます。

## Dockerでの実行

### ビルド

```bash
docker build -t memo-app-frontend .
```

### 実行

```bash
docker run -p 8080:8080 memo-app-frontend
```

アプリケーションは `http://localhost:8080` でアクセスできます。

## プロジェクト構造

```
src/
├── api/           # APIクライアント
│   └── memoApi.js
├── components/    # Reactコンポーネント
│   ├── MemoForm.jsx
│   ├── MemoItem.jsx
│   └── MemoList.jsx
├── App.jsx        # メインアプリケーションコンポーネント
├── App.css        # アプリケーションスタイル
├── index.css      # グローバルスタイル
└── main.jsx       # エントリーポイント
```

## 機能詳細

### オフライン対応

APIサーバーに接続できない場合、自動的にローカルストレージモードに切り替わります。再接続ボタンでAPIサーバーへの再接続を試みることができます。

### APIエンドポイント

アプリケーションは以下のRESTful APIエンドポイントを想定しています：

- `GET /api/memos` - メモ一覧取得
- `GET /api/memos/:id` - メモ詳細取得
- `POST /api/memos` - メモ作成
- `PUT /api/memos/:id` - メモ更新
- `DELETE /api/memos/:id` - メモ削除
- `GET /api/actuator/health` - ヘルスチェック

## ライセンス

このプロジェクトはOpenShift Training用のデモアプリケーションです。

