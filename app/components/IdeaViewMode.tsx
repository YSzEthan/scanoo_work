import { type Idea } from '@/lib/supabase'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface IdeaViewModeProps {
  idea: Idea
  onEdit: () => void
  onDelete: () => void
}

export default function IdeaViewMode({ idea, onEdit, onDelete }: IdeaViewModeProps) {
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <>
      <div className="prose prose-sm prose-slate max-w-none mb-3">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: (props) => <p className="mb-2 last:mb-0" {...props} />,
            h1: (props) => <h1 className="text-xl font-bold mb-2" {...props} />,
            h2: (props) => <h2 className="text-lg font-bold mb-2" {...props} />,
            h3: (props) => <h3 className="text-base font-bold mb-1" {...props} />,
            code: ({ className, ...props }) => {
              const isInline = !className?.includes('language-')
              return isInline
                ? <code className="px-1.5 py-0.5 bg-gray-300 rounded text-sm" {...props} />
                : <code className="block p-3 bg-gray-600 rounded text-sm overflow-x-auto" {...props} />
            },
            a: (props) => <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
          }}
        >
          {idea.content}
        </ReactMarkdown>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {formatDate(idea.created_at)}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="編輯"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="刪除"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}
