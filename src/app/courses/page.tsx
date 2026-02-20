'use client'

import Link from 'next/link'
import { useMemo } from 'react'
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

  return (
    <div style={{
      padding: '60px 80px',
      background: 'linear-gradient(135deg,#0f172a,#020617)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <h1 style={{
        fontSize: '44px',
        marginBottom: '10px'
      }}>
        Математика оқу бағдарламасы
      </h1>

      <p style={{
        opacity: 0.6,
        marginBottom: '40px'
      }}>
        1–11 сыныптар · {totalGrades} сынып · {totalTopics} тақырып
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {grades.map(([gradeId, grade]) => {

          const topicCount = grade?.topics
            ? Object.keys(grade.topics).length
            : 0

          const progress = Math.min(100, topicCount * 10)

          return (
            <Link
              key={gradeId}
              href={`/courses/${gradeId}`}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                background: 'linear-gradient(145deg,#1e293b,#0f172a)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.08)',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)',
                boxShadow: '0 0 0 rgba(0,0,0,0)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.4)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
              >
                <h2 style={{
                  fontSize: '22px',
                  marginBottom: '8px'
                }}>
                  {gradeId} сынып
                </h2>

                <p style={{
                  opacity: 0.6,
                  marginBottom: '16px'
                }}>
                  Тақырып саны: {topicCount}
                </p>

                <div style={{
                  height: '6px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg,#3b82f6,#22d3ee)',
                    transition: 'width 0.4s ease'
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
