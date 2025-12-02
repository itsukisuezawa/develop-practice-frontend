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
