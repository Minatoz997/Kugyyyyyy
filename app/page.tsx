'use client'

import { useState, useEffect } from 'react'
import { LoginPage } from '../components/LoginPage'
import { Dashboard } from '../components/Dashboard'
import { ApiService } from '../lib/api'

interface User {
  email: string
  name: string
  authenticated: boolean
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [credits, setCredits] = useState<string>('0')

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await ApiService.getCurrentUser()
      if (response.user) {
        setUser(response.user)
        setCredits(response.credits || '0')
      }
    } catch (error) {
      console.log('Not authenticated')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (type: 'google' | 'guest') => {
    if (type === 'google') {
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/auth/google`
    } else {
      try {
        const response = await ApiService.guestLogin()
        if (response.user) {
          setUser(response.user)
          setCredits(response.credits || '0')
        }
      } catch (error) {
        console.error('Guest login failed:', error)
      }
    }
  }

  const handleLogout = async () => {
    try {
      await ApiService.logout()
      setUser(null)
      setCredits('0')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const updateCredits = (newCredits: string) => {
    setCredits(newCredits)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <Dashboard 
      user={user} 
      credits={credits} 
      onLogout={handleLogout}
      onCreditsUpdate={updateCredits}
    />
  )
}
