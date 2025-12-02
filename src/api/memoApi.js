import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 全メモ取得
export const getMemos = async () => {
  const response = await apiClient.get('/memos')
  return response.data
}

// メモ詳細取得
export const getMemo = async (id) => {
  const response = await apiClient.get(`/memos/${id}`)
  return response.data
}

// メモ作成
export const createMemo = async (memo) => {
  const response = await apiClient.post('/memos', memo)
  return response.data
}

// メモ更新
export const updateMemo = async (id, memo) => {
  const response = await apiClient.put(`/memos/${id}`, memo)
  return response.data
}

// メモ削除
export const deleteMemo = async (id) => {
  await apiClient.delete(`/memos/${id}`)
}

// ヘルスチェック
export const healthCheck = async () => {
  const response = await apiClient.get('/actuator/health')
  return response.data
}
