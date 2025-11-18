'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase, type Idea } from '@/lib/supabase'
import { useToast } from '@/app/contexts/ToastContext'

const ITEMS_PER_PAGE = 10

export function useIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const toast = useToast()

  // 計算總頁數
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  // 取得想法列表（支援分頁）
  const fetchIdeas = useCallback(async (page = 1) => {
    try {
      setIsLoading(true)

      // 計算分頁範圍
      const from = (page - 1) * ITEMS_PER_PAGE
      const to = from + ITEMS_PER_PAGE - 1

      // 一次查詢同時取得資料和總數
      const { data, error, count } = await supabase
        .from('ideas')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) throw error

      setIdeas(data || [])
      setTotalCount(count || 0)
      setCurrentPage(page)
    } catch (error) {
      console.error('Error fetching ideas:', error)
      toast.error('載入想法失敗，請稍後再試')
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // 新增想法
  const addIdea = useCallback(async (content: string) => {
    if (!content.trim()) {
      toast.warning('請輸入想法內容')
      return false
    }

    if (content.length > 1000) {
      toast.warning('想法內容不能超過 1000 字')
      return false
    }

    try {
      const { error } = await supabase
        .from('ideas')
        .insert([{ content: content.trim() }])

      if (error) throw error

      // 新增後跳到第一頁，讓用戶看到新內容
      await fetchIdeas(1)
      toast.success('想法已新增！')
      return true
    } catch (error) {
      console.error('Error adding idea:', error)
      toast.error('新增失敗，請稍後再試')
      return false
    }
  }, [fetchIdeas, toast])

  // 更新想法
  const updateIdea = useCallback(async (id: string, content: string) => {
    if (!content.trim()) {
      toast.warning('請輸入想法內容')
      return false
    }

    if (content.length > 1000) {
      toast.warning('想法內容不能超過 1000 字')
      return false
    }

    try {
      const { error } = await supabase
        .from('ideas')
        .update({ content: content.trim() })
        .eq('id', id)

      if (error) throw error

      // 統一策略：重新載入當前頁以確保數據一致性
      await fetchIdeas(currentPage)
      toast.success('想法已更新！')
      return true
    } catch (error) {
      console.error('Error updating idea:', error)
      toast.error('更新失敗，請稍後再試')
      return false
    }
  }, [currentPage, fetchIdeas, toast])

  // 刪除想法
  const deleteIdea = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', id)

      if (error) throw error

      // 統一策略：永遠重新抓取
      // 刪除後重新載入當前頁，如果當前頁空了，fetchIdeas 會自動處理
      await fetchIdeas(currentPage)
      toast.success('想法已刪除')
      return true
    } catch (error) {
      console.error('Error deleting idea:', error)
      toast.error('刪除失敗，請稍後再試')
      return false
    }
  }, [currentPage, fetchIdeas, toast])

  // 切換頁面
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchIdeas(page)
    }
  }, [totalPages, fetchIdeas])

  // 初始載入
  useEffect(() => {
    fetchIdeas(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    ideas,
    isLoading,
    currentPage,
    totalPages,
    totalCount,
    addIdea,
    updateIdea,
    deleteIdea,
    goToPage,
    refreshIdeas: () => fetchIdeas(currentPage),
  }
}
