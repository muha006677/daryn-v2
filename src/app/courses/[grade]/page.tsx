'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { courseData } from '@/lib/courses/data'

export default function GradePage({ params }: { params: { grade: string } }) {

  const gradeId = params.grade
  const grade = courseData?.[gradeId]

  const topics = useMemo(() => {
    if (!grade || !grade.topics) return []
    return Object.entries(grade.topics)
  }, [grade])

  if (!grade) {
    return (
      <div style={{ padding: 40 }}>
        Сынып табылмады
      </div>
    )
  }

  return (
    <div style={{
      padding: '60px 80px',
      background: '#0f172a',
      minHeight: '100vh',
      color: 'white'
    }}>
      <h1 style={{ marginBottom: 40 }}>
        {gradeId} сынып
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))',
        gap: 24
      }}>
        {topics.map(([topicId, topic]: any) => (
          <Link
            key={topicId}
            href={`/courses/${gradeId}/${topicId}`}
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              padding: 24,
              borderRadius: 16,
              background: 'linear-gradient(145deg,#1e293b,#0f172a)',
              border: '1px solid rgba(255,255,255,0.08)',
              transition: '0.3s'
            }}>
              <h3>{topic.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
