'use client'

import Link from 'next/link'
import { courseData } from '@/lib/courses/data'

export default function CoursesPage() {

  const safeData = courseData ?? {}
  const grades = Object.entries(safeData)

  return (
    <div style={{
      padding: '60px 80px',
      background: '#0f172a',
      minHeight: '100vh',
      color: 'white'
    }}>
      <h1 style={{
        fontSize: '42px',
        marginBottom: '40px'
      }}>
        Mathematics Curriculum
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {grades.map(([gradeId, grade]) => {

          const topicCount = grade?.topics
            ? Object.keys(grade.topics).length
            : 0

          return (
            <Link
              key={gradeId}
              href={`/courses/${gradeId}`}
              style={{
                textDecoration: 'none'
              }}
            >
              <div style={{
                background: 'linear-gradient(145deg,#1e293b,#111827)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid #1f2937',
                transition: '0.2s'
              }}>
                <h2 style={{
                  fontSize: '22px',
                  marginBottom: '10px'
                }}>
                  Grade {gradeId}
                </h2>
                <p style={{
                  opacity: 0.7
                }}>
                  Topics: {topicCount}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
