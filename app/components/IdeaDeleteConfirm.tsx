interface IdeaDeleteConfirmProps {
  content: string
  isSubmitting: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function IdeaDeleteConfirm({
  content,
  isSubmitting,
  onConfirm,
  onCancel,
}: IdeaDeleteConfirmProps) {
  return (
    <div className="space-y-4">
      <p className="text-gray-800 text-lg">確定要刪除這個想法嗎？</p>
      <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded border border-gray-200 whitespace-pre-wrap">
        {content}
      </p>
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          取消
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? '刪除中...' : '確認刪除'}
        </button>
      </div>
    </div>
  )
}
