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
