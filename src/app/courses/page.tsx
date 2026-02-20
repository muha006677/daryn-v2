'use client'

import Link from 'next/link'
import { useMemo, useEffect, useState } from 'react'
import { courseData } from '@/lib/courses/data'

export default function CoursesPage() {

  const safeData = courseData ?? {}

  const grades = useMemo(() => {
    return Object.entries(safeData)
  }, [safeData])

  const totalGrades = grades.length

  const totalTopics = useMemo(() => {
    return grades.reduce((sum, [, grade]) => {
      return sum + (grade?.topics ? Object.keys(grade.topics).length : 0)
    }, 0)
  }, [grades])

  const [mounted, setMounted] = useState(false)
  const [progressMap, setProgressMap] = useState({})

  useEffect(() => {
    setMounted(true)

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('courseProgress')
      if (stored) {
        setProgressMap(JSON.parse(stored))
      }
    }
  }, [])

  return (
    <div style={{
      padding: '60px 80px',
      background: 'radial-gradient(circle at 20% 20%,#1e3a8a,transparent 40%), #020617',
      minHeight: '100vh',
      color: 'white',
      opacity: mounted ? 1 : 0,
      transition: 'opacity 0.6s ease'
    }}>
      <h1 style={{
        fontSize: '46px',
        marginBottom: '10px'
      }}>
        MathForce AI · Оқу Панелі
      </h1>

      <div style={{
        display: 'flex',
        gap: '40px',
        marginBottom: '50px',
        flexWrap: 'wrap'
      }}>
        <div style={statBoxStyle}>
          <p style={statTitleStyle}>Сынып саны</p>
          <h2>{totalGrades}</h2>
        </div>

        <div style={statBoxStyle}>
          <p style={statTitleStyle}>Жалпы тақырып</p>
          <h2>{totalTopics}</h2>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {grades.map(([gradeId, grade]) => {

          const topicCount = grade?.topics
            ? Object.keys(grade.topics).length
            : 0

          const storedProgress = progressMap[gradeId] ?? 0
          const progress = Math.min(100, storedProgress)

          return (
            <Link
              key={gradeId}
              href={`/courses/${gradeId}`}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                ...cardStyle,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.6)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = cardStyle.boxShadow
              }}
              >
                <h2>{gradeId} сынып</h2>
                <p style={{ opacity: 0.6 }}>
                  Тақырып саны: {topicCount}
                </p>

                <div style={progressContainerStyle}>
                  <div style={{
                    ...progressBarStyle,
                    width: `${progress}%`
                  }} />
                </div>

                <p style={{
                  fontSize: '12px',
                  opacity: 0.5,
                  marginTop: '8px'
                }}>
                  Прогресс: {progress}%
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

const statBoxStyle = {
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(12px)',
  padding: '20px 30px',
  borderRadius: '16px',
  border: '1px solid rgba(255,255,255,0.08)'
}

const statTitleStyle = {
  fontSize: '14px',
  opacity: 0.6,
  marginBottom: '5px'
}

const cardStyle = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(14px)',
  padding: '24px',
  borderRadius: '16px',
  border: '1px solid rgba(255,255,255,0.08)',
  transition: 'all 0.3s ease',
  boxShadow: '0 0 0 rgba(0,0,0,0)'
}

const progressContainerStyle = {
  height: '6px',
  background: 'rgba(255,255,255,0.1)',
  borderRadius: '4px',
  overflow: 'hidden',
  marginTop: '12px'
}

const progressBarStyle = {
  height: '100%',
  background: 'linear-gradient(90deg,#3b82f6,#22d3ee)',
  transition: 'width 0.4s ease'
}
