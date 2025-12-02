import { useState, useEffect, useCallback } from 'react'
import MemoList from './components/MemoList'
import MemoForm from './components/MemoForm'
import * as memoApi from './api/memoApi'
import './App.css'

function App() {
  const [memos, setMemos] = useState([])
  const [editingMemo, setEditingMemo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [useLocalStorage, setUseLocalStorage] = useState(false)

  // メモ一覧を取得
  const fetchMemos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await memoApi.getMemos()
      setMemos(data)
      setUseLocalStorage(false)
    } catch (err) {
      console.warn('API接続エラー、ローカルストレージモードに切り替えます:', err.message)
      setUseLocalStorage(true)
      // ローカルストレージからフォールバック読み込み
      const savedMemos = localStorage.getItem('memos')
      if (savedMemos) {
        setMemos(JSON.parse(savedMemos))
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // 初回読み込み
  useEffect(() => {
    fetchMemos()
  }, [fetchMemos])

  // ローカルストレージモード時の保存
  useEffect(() => {
    if (useLocalStorage && memos.length >= 0) {
      localStorage.setItem('memos', JSON.stringify(memos))
    }
  }, [memos, useLocalStorage])

  // メモ追加
  const addMemo = async (memo) => {
    try {
      setError(null)
      if (useLocalStorage) {
        const newMemo = {
          id: Date.now(),
          ...memo,
          createdAt: new Date().toISOString()
        }
        setMemos([newMemo, ...memos])
      } else {
        const newMemo = await memoApi.createMemo(memo)
        setMemos([newMemo, ...memos])
      }
    } catch (err) {
      setError('メモの追加に失敗しました: ' + err.message)
    }
  }

  // メモ更新
  const updateMemo = async (id, updatedMemo) => {
    try {
      setError(null)
      if (useLocalStorage) {
        setMemos(memos.map(memo =>
          memo.id === id ? { ...memo, ...updatedMemo } : memo
        ))
      } else {
        const updated = await memoApi.updateMemo(id, updatedMemo)
        setMemos(memos.map(memo =>
          memo.id === id ? updated : memo
        ))
      }
      setEditingMemo(null)
    } catch (err) {
      setError('メモの更新に失敗しました: ' + err.message)
    }
  }

  // メモ削除
  const deleteMemo = async (id) => {
    if (!window.confirm('このメモを削除しますか？')) {
      return
    }

    try {
      setError(null)
      if (useLocalStorage) {
        setMemos(memos.filter(memo => memo.id !== id))
      } else {
        await memoApi.deleteMemo(id)
        setMemos(memos.filter(memo => memo.id !== id))
      }
    } catch (err) {
      setError('メモの削除に失敗しました: ' + err.message)
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

  // API再接続
  const retryConnection = () => {
    fetchMemos()
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
          {useLocalStorage && (
            <div className="mt-2 p-2 bg-yellow-100 border border-yellow-400 rounded text-yellow-700 text-sm flex items-center justify-between">
              <span>オフラインモード（ローカルストレージ使用中）</span>
              <button
                onClick={retryConnection}
                className="ml-2 px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs"
              >
                再接続
              </button>
            </div>
          )}
        </header>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 rounded text-red-700">
            {error}
          </div>
        )}

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
          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
              読み込み中...
            </div>
          ) : (
            <MemoList
              memos={memos}
              onEdit={startEdit}
              onDelete={deleteMemo}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default App
