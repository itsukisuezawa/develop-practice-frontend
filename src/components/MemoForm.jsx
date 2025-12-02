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
