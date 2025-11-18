'use client'

import { useState } from 'react'
import { useIdeas } from '@/app/hooks/useIdeas'
import IdeaCard from '@/app/components/IdeaCard'
import IdeaCardSkeleton from '@/app/components/IdeaCardSkeleton'

export default function Home() {
  const [newIdea, setNewIdea] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    ideas,
    isLoading,
    currentPage,
    totalPages,
    totalCount,
    addIdea,
    updateIdea,
    deleteIdea,
    goToPage,
  } = useIdeas()

  // 提交新想法的核心邏輯
  const submitIdea = async () => {
    if (!newIdea.trim() || isSubmitting) return

    setIsSubmitting(true)
    const success = await addIdea(newIdea)
    setIsSubmitting(false)

    if (success) {
      setNewIdea('')
    }
  }

  // 表單提交處理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submitIdea()
  }

  // 處理鍵盤快捷鍵（Enter 送出，Shift+Enter 換行）
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 如果正在使用輸入法（如注音、拼音），不處理 Enter
    if (e.nativeEvent.isComposing) {
      return
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submitIdea()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <main className="container mx-auto max-w-4xl px-4 py-12">
        {/* 標題 */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Scanoo 作業
          </h1>
          <p className="text-gray-600">
            Idea收集器
          </p>
        </div>

        {/* 提交表單 */}
        <div className="mb-12">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <textarea
                value={newIdea}
                onChange={(e) => setNewIdea(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="輸入你的想法..."
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                rows={4}
                disabled={isSubmitting}
                maxLength={1000}
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                {newIdea.length}/1000
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">Enter</kbd>
                {' '}送出
                <span className="mx-2">•</span>
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">Shift</kbd>
                {' + '}
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">Enter</kbd>
                {' '}換行
              </p>
              <button
                type="submit"
                disabled={isSubmitting || !newIdea.trim()}
                className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? '提交中...' : '送出想法'}
              </button>
            </div>
          </form>
        </div>

        {/* 想法清單 */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            所有想法 ({ideas.length === 0 && !isLoading ? 0 : totalCount})
          </h2>

          {isLoading ? (
            <div className="grid gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <IdeaCardSkeleton key={i} />
              ))}
            </div>
          ) : ideas.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-500">還沒有任何想法，來新增第一個吧！</p>
            </div>
          ) : (
            <>
              {/* 想法列表 */}
              <div className="grid gap-4 mb-8">
                {ideas.map((idea) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    onUpdate={updateIdea}
                    onDelete={deleteIdea}
                  />
                ))}
              </div>

              {/* 分頁控制 */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    上一頁
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // 只顯示當前頁面附近的頁碼
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 2 && page <= currentPage + 2)
                      ) {
                        return (
                          <button
                            type="button"
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all ${
                              page === currentPage
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      } else if (
                        page === currentPage - 3 ||
                        page === currentPage + 3
                      ) {
                        return (
                          <span key={page} className="px-2 text-gray-500">
                            ...
                          </span>
                        )
                      }
                      return null
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    下一頁
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
