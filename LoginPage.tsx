'use client'

import { Bot, Sparkles, Users, Image as ImageIcon } from 'lucide-react'

interface LoginPageProps {
  onLogin: (type: 'google' | 'guest') => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center">
              <Bot className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Kugy AI</h2>
          <p className="mt-2 text-gray-600">Multi-Agent AI Platform</p>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Platform Features</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-primary-600" />
                <span className="text-gray-700">Multi-Agent AI System</span>
              </div>
              <div className="flex items-center space-x-3">
                <Bot className="w-5 h-5 text-primary-600" />
                <span className="text-gray-700">Advanced Chat AI</span>
              </div>
              <div className="flex items-center space-x-3">
                <ImageIcon className="w-5 h-5 text-primary-600" />
                <span className="text-gray-700">AI Image Generation</span>
              </div>
              <div className="flex items-center space-x-3">
                <Sparkles className="w-5 h-5 text-primary-600" />
                <span className="text-gray-700">VirtuSim Integration</span>
              </div>
            </div>
          </div>

          {/* Login Options */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Get Started</h3>
            <div className="space-y-3">
              <button
                onClick={() => onLogin('google')}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-gray-700 font-medium">Continue with Google</span>
              </button>

              <button
                onClick={() => onLogin('guest')}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-center space-x-2 hover:bg-gray-200 transition-colors"
              >
                <Bot className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-medium">Continue as Guest</span>
              </button>
            </div>

            <div className="mt-4 text-xs text-gray-500 text-center">
              <p>Guest users receive 25 free credits</p>
              <p>Registered users receive 75 credits</p>
            </div>
          </div>

          {/* Credit System Info */}
          <div className="glass-card p-4">
            <h4 className="font-medium text-gray-900 mb-2">Credit Usage</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Single AI Chat</span>
                <span>1 credit</span>
              </div>
              <div className="flex justify-between">
                <span>Image Generation</span>
                <span>3 credits</span>
              </div>
              <div className="flex justify-between">
                <span>Multi-Agent AI</span>
                <span>5 credits</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}