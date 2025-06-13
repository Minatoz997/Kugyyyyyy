'use client'

import { useState, useEffect } from 'react'
import { Bot, Image as ImageIcon, Users, LogOut, Coins, Send, Loader2, Copy, Download } from 'lucide-react'
import { ApiService } from '../lib/api'

interface User {
  email: string
  name: string
  authenticated: boolean
}

interface DashboardProps {
  user: User
  credits: string
  onLogout: () => void
  onCreditsUpdate: (credits: string) => void
}

export function Dashboard({ user, credits, onLogout, onCreditsUpdate }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'multi-agent' | 'image' | 'virtusim'>('chat')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState<any[]>([])
  const [currentResponse, setCurrentResponse] = useState('')
  const [generatedImage, setGeneratedImage] = useState('')
  const [multiAgentResult, setMultiAgentResult] = useState<any>(null)

  useEffect(() => {
    if (activeTab === 'chat') {
      loadChatHistory()
    }
  }, [activeTab])

  const loadChatHistory = async () => {
    try {
      const response = await ApiService.getChatHistory(10)
      if (response.success && response.data) {
        setChatHistory(response.data.history || [])
      }
    } catch (error) {
      console.error('Failed to load chat history:', error)
    }
  }

  const handleSendChat = async () => {
    if (!message.trim() || loading) return

    setLoading(true)
    setCurrentResponse('')
    
    try {
      const response = await ApiService.sendChat(message)
      if (response.success && response.data) {
        setCurrentResponse(response.data.response)
        onCreditsUpdate(response.credits_remaining || credits)
        setMessage('')
        await loadChatHistory()
      }
    } catch (error: any) {
      console.error('Chat failed:', error)
      setCurrentResponse(`Error: ${error.response?.data?.message || 'Failed to send message'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleMultiAgent = async () => {
    if (!message.trim() || loading) return

    setLoading(true)
    setMultiAgentResult(null)
    
    try {
      const response = await ApiService.sendMultiAgent(message)
      if (response.success && response.data) {
        setMultiAgentResult(response.data)
        onCreditsUpdate(response.credits_remaining || credits)
        setMessage('')
      }
    } catch (error: any) {
      console.error('Multi-agent failed:', error)
      setMultiAgentResult({ 
        error: true, 
        message: error.response?.data?.message || 'Failed to process multi-agent task' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateImage = async () => {
    if (!message.trim() || loading) return

    setLoading(true)
    setGeneratedImage('')
    
    try {
      const response = await ApiService.generateImage(message)
      if (response.success && response.data) {
        setGeneratedImage(response.data.image)
        onCreditsUpdate(response.credits_remaining || credits)
        setMessage('')
      }
    } catch (error: any) {
      console.error('Image generation failed:', error)
      alert(`Image generation failed: ${error.response?.data?.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const downloadImage = () => {
    if (!generatedImage) return
    
    const link = document.createElement('a')
    link.href = `data:image/png;base64,${generatedImage}`
    link.download = 'kugy-ai-generated-image.png'
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Kugy AI</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-1">
                <Coins className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-gray-700">{credits} credits</span>
              </div>
              
              <div className="text-sm text-gray-600">
                {user.name}
              </div>
              
              <button
                onClick={onLogout}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { id: 'chat', name: 'AI Chat', icon: Bot, cost: '1 credit' },
              { id: 'multi-agent', name: 'Multi-Agent', icon: Users, cost: '5 credits' },
              { id: 'image', name: 'Image Generation', icon: ImageIcon, cost: '3 credits' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
                <span className="text-xs text-gray-400">({tab.cost})</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">
                {activeTab === 'chat' && 'Chat with AI'}
                {activeTab === 'multi-agent' && 'Multi-Agent Task'}
                {activeTab === 'image' && 'Generate Image'}
              </h3>
              
              <div className="space-y-4">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    activeTab === 'chat' ? 'Ask me anything...' :
                    activeTab === 'multi-agent' ? 'Describe your complex task...' :
                    'Describe the image you want to generate...'
                  }
                  className="input-field h-32 resize-none"
                  disabled={loading}
                />
                
                <button
                  onClick={
                    activeTab === 'chat' ? handleSendChat :
                    activeTab === 'multi-agent' ? handleMultiAgent :
                    handleGenerateImage
                  }
                  disabled={!message.trim() || loading}
                  className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>
                    {loading ? 'Processing...' : 
                     activeTab === 'chat' ? 'Send Message' :
                     activeTab === 'multi-agent' ? 'Process Task' :
                     'Generate Image'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {activeTab === 'chat' && (
              <div className="space-y-6">
                {/* Current Response */}
                {currentResponse && (
                  <div className="glass-card p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-semibold text-gray-900">AI Response</h4>
                      <button
                        onClick={() => copyToClipboard(currentResponse)}
                        className="p-2 text-gray-500 hover:text-gray-700"
                        title="Copy response"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap">{currentResponse}</p>
                    </div>
                  </div>
                )}

                {/* Chat History */}
                {chatHistory.length > 0 && (
                  <div className="glass-card p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Recent Conversations</h4>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {chatHistory.map((chat, index) => (
                        <div key={index} className="border-l-4 border-primary-200 pl-4">
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            Q: {chat.question}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            A: {chat.answer}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(chat.created_at).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'multi-agent' && multiAgentResult && (
              <div className="glass-card p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Multi-Agent Analysis</h4>
                
                {multiAgentResult.error ? (
                  <div className="text-red-600">
                    Error: {multiAgentResult.message}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Final Answer */}
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Final Solution</h5>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="whitespace-pre-wrap text-sm">{multiAgentResult.final_answer}</p>
                      </div>
                    </div>

                    {/* Agent Results */}
                    {multiAgentResult.multi_agent_results && (
                      <div className="space-y-4">
                        <h5 className="font-medium text-gray-900">Agent Analysis</h5>
                        
                        {Object.entries(multiAgentResult.multi_agent_results).map(([key, agent]: [string, any]) => (
                          <div key={key} className="border border-gray-200 rounded-lg p-4">
                            <h6 className="font-medium text-sm text-gray-900 mb-2">
                              {agent.agent} - {agent.role}
                            </h6>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap">
                              {agent.result}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Models Used */}
                    {multiAgentResult.models_used && (
                      <div className="text-xs text-gray-500">
                        Models used: {multiAgentResult.models_used.join(', ')}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'image' && generatedImage && (
              <div className="glass-card p-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-semibold text-gray-900">Generated Image</h4>
                  <button
                    onClick={downloadImage}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={`data:image/png;base64,${generatedImage}`}
                    alt="Generated image"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
