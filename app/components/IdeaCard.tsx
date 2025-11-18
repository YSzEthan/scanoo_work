'use client'

import { useState } from 'react'
import { type Idea } from '@/lib/supabase'
import IdeaViewMode from './IdeaViewMode'
import IdeaEditMode from './IdeaEditMode'
import IdeaDeleteConfirm from './IdeaDeleteConfirm'

type CardMode = 'view' | 'edit' | 'delete-confirm'

interface IdeaCardProps {
  idea: Idea
  onUpdate: (id: string, content: string) => Promise<boolean>
  onDelete: (id: string) => Promise<boolean>
}

export default function IdeaCard({ idea, onUpdate, onDelete }: IdeaCardProps) {
  const [mode, setMode] = useState<CardMode>('view')
  const [editContent, setEditContent] = useState(idea.content)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleUpdate = async () => {
    if (!editContent.trim() || editContent === idea.content) {
      setMode('view')
      setEditContent(idea.content)
      return
    }

    setIsSubmitting(true)
    const success = await onUpdate(idea.id, editContent)
    setIsSubmitting(false)

    if (success) {
      setMode('view')
    }
  }

  const handleDelete = async () => {
    setIsSubmitting(true)
    await onDelete(idea.id)
    setIsSubmitting(false)
    setMode('view')
  }

  const handleCancelEdit = () => {
    setMode('view')
    setEditContent(idea.content)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {mode === 'edit' && (
        <IdeaEditMode
          editContent={editContent}
          isSubmitting={isSubmitting}
          onContentChange={setEditContent}
          onSave={handleUpdate}
          onCancel={handleCancelEdit}
        />
      )}
      {mode === 'delete-confirm' && (
        <IdeaDeleteConfirm
          content={idea.content}
          isSubmitting={isSubmitting}
          onConfirm={handleDelete}
          onCancel={() => setMode('view')}
        />
      )}
      {mode === 'view' && (
        <IdeaViewMode
          idea={idea}
          onEdit={() => setMode('edit')}
          onDelete={() => setMode('delete-confirm')}
        />
      )}
    </div>
  )
}
