interface IdeaEditModeProps {
  editContent: string
  isSubmitting: boolean
  onContentChange: (content: string) => void
  onSave: () => void
  onCancel: () => void
}

export default function IdeaEditMode({
  editContent,
  isSubmitting,
  onContentChange,
  onSave,
  onCancel,
}: IdeaEditModeProps) {
  return (
    <div className="space-y-3">
      <textarea
        value={editContent}
        onChange={(e) => onContentChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
        rows={4}
        disabled={isSubmitting}
        autoFocus
      />
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
          onClick={onSave}
          disabled={isSubmitting || !editContent.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? '儲存中...' : '儲存'}
        </button>
      </div>
    </div>
  )
}
