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
