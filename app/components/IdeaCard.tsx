'use client'

import { useState } from 'react'
import { type Idea } from '@/lib/supabase'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface IdeaCardProps {
  idea: Idea
  onUpdate: (id: string, content: string) => Promise<boolean>
  onDelete: (id: string) => Promise<boolean>
}

export default function IdeaCard({ idea, onUpdate, onDelete }: IdeaCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(idea.content)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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

  // 處理更新
  const handleUpdate = async () => {
    if (!editContent.trim() || editContent === idea.content) {
      setIsEditing(false)
      setEditContent(idea.content)
      return
    }

    setIsSubmitting(true)
    const success = await onUpdate(idea.id, editContent)
    setIsSubmitting(false)

    if (success) {
      setIsEditing(false)
    }
  }

  // 處理刪除
  const handleDelete = async () => {
    setIsSubmitting(true)
    await onDelete(idea.id)
    setIsSubmitting(false)
    setShowDeleteConfirm(false)
  }

  // 取消編輯
  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditContent(idea.content)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {isEditing ? (
        // 編輯模式
        <div className="space-y-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
            rows={4}
            disabled={isSubmitting}
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleUpdate}
              disabled={isSubmitting || !editContent.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? '儲存中...' : '儲存'}
            </button>
          </div>
        </div>
      ) : showDeleteConfirm ? (
        // 刪除確認模式
        <div className="space-y-4">
          <p className="text-gray-800 text-lg">確定要刪除這個想法嗎？</p>
          <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded border border-gray-200 whitespace-pre-wrap">
            {idea.content}
          </p>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? '刪除中...' : '確認刪除'}
            </button>
          </div>
        </div>
      ) : (
        // 檢視模式
        <>
          <div className="prose prose-sm prose-slate max-w-none mb-3">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // 自訂樣式：移除 p 標籤的底部邊距
                p: ({...props}: any) => <p className="mb-2 last:mb-0" {...props} />,
                // 標題樣式
                h1: ({...props}: any) => <h1 className="text-xl font-bold mb-2" {...props} />,
                h2: ({...props}: any) => <h2 className="text-lg font-bold mb-2" {...props} />,
                h3: ({...props}: any) => <h3 className="text-base font-bold mb-1" {...props} />,
                // 程式碼區塊
                code: ({className, ...props}: any) => {
                  const isInline = !className?.includes('language-')
                  return isInline
                    ? <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm" {...props} />
                    : <code className="block p-3 bg-gray-100 rounded text-sm overflow-x-auto" {...props} />
                },
                // 連結樣式
                a: ({...props}: any) => <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
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
                onClick={() => setIsEditing(true)}
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
                onClick={() => setShowDeleteConfirm(true)}
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
      )}
    </div>
  )
}
