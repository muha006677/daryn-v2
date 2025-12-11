// 学生姓名 Hook
'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'daryn_student_name'

export function useStudentName() {
  const [name, setNameState] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  // 从 localStorage 读取
  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false)
      return
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setNameState(stored.trim())
      }
    } catch (error) {
      console.error('[useStudentName] Failed to read name:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 设置姓名
  const setName = (newName: string) => {
    const trimmed = newName.trim()
    setNameState(trimmed)
    
    if (typeof window !== 'undefined') {
      try {
        if (trimmed) {
          localStorage.setItem(STORAGE_KEY, trimmed)
        } else {
          localStorage.removeItem(STORAGE_KEY)
        }
      } catch (error) {
        console.error('[useStudentName] Failed to save name:', error)
      }
    }
  }

  // 清除姓名
  const clearName = () => {
    setNameState('')
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch (error) {
        console.error('[useStudentName] Failed to clear name:', error)
      }
    }
  }

  return { name, setName, clearName, isLoading }
}
