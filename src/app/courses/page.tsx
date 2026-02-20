'use client'

import { courseData } from '@/lib/courses/data'

export default function CoursesPage() {

  const safeData = courseData ?? {}

  const grades = Object.entries(safeData)

  return (
    <div style={{ padding: 40 }}>
      <h1>Courses</h1>

      {grades.map(([gradeId, grade]) => (
        <div key={gradeId} style={{ marginBottom: 20 }}>
          <h2>{grade?.title ?? `Grade ${gradeId}`}</h2>
          <p>
            Topics: {grade?.topics ? Object.keys(grade.topics).length : 0}
          </p>
        </div>
      ))}
    </div>
  )
}
