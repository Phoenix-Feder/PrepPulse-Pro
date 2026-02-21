'use client'
import { useEffect, useState, useCallback } from 'react'
import { getUserTopicProgress, updateTopicProgress } from '@/lib/firestore'
import type { TopicProgress } from '@/types'

export function useTopicProgress(userId: string | undefined) {
  const [progress, setProgress] = useState<Record<string, TopicProgress>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    getUserTopicProgress(userId).then(data => {
      const map: Record<string, TopicProgress> = {}
      data.forEach(p => { map[p.topicId] = p })
      setProgress(map)
      setLoading(false)
    })
  }, [userId])

  const updateTopic = useCallback(async (
    topicId: string,
    status: TopicProgress['status'],
    masteryLevel: number = 0
  ) => {
    if (!userId) return
    await updateTopicProgress(userId, topicId, status, masteryLevel)
    setProgress(prev => ({
      ...prev,
      [topicId]: { userId, topicId, status, masteryLevel },
    }))
  }, [userId])

  const getTopicStatus = useCallback((topicId: string): TopicProgress['status'] => {
    return progress[topicId]?.status || 'not_started'
  }, [progress])

  const countByStatus = useCallback((status: TopicProgress['status']) => {
    return Object.values(progress).filter(p => p.status === status).length
  }, [progress])

  return { progress, loading, updateTopic, getTopicStatus, countByStatus }
}
