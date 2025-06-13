import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  credits_remaining?: string
}

export interface User {
  email: string
  name: string
  authenticated: boolean
}

export interface ChatMessage {
  question: string
  answer: string
  created_at: string
}

export const ApiService = {
  // Auth endpoints
  async getCurrentUser(): Promise<{ user: User | null; authenticated: boolean; credits: string }> {
    const response = await api.get('/auth/user')
    return response.data
  },

  async guestLogin(): Promise<{ user: User; authenticated: boolean; credits: string }> {
    const response = await api.post('/auth/guest')
    return response.data
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },

  // Chat endpoints
  async sendChat(message: string): Promise<ApiResponse<{ response: string }>> {
    const response = await api.post('/chat', {
      query: message
    })
    return response.data
  },

  async getChatHistory(limit: number = 20): Promise<ApiResponse<{ history: ChatMessage[]; total: number }>> {
    const response = await api.get(`/chat/history?limit=${limit}`)
    return response.data
  },

  // Multi-agent endpoint
  async sendMultiAgent(task: string): Promise<ApiResponse<any>> {
    const response = await api.post('/multi-agent', {
      task,
      use_multi_agent: true
    })
    return response.data
  },

  // Image generation
  async generateImage(prompt: string): Promise<ApiResponse<{ image: string; prompt: string }>> {
    const response = await api.post('/image/generate', {
      prompt
    })
    return response.data
  },

  // Credits
  async getCredits(): Promise<ApiResponse<{ credits: string; user_id: string }>> {
    const response = await api.get('/credits')
    return response.data
  },

  // VirtuSim endpoints
  async getVirtuSimBalance(): Promise<any> {
    const response = await api.get('/virtusim/balance')
    return response.data
  },

  async getVirtuSimServices(country: string = 'indonesia'): Promise<any> {
    const response = await api.get(`/virtusim/services?country=${country}`)
    return response.data
  },

  async createVirtuSimOrder(service: string, operator: string = 'any'): Promise<any> {
    const response = await api.post('/virtusim/orders/create', {
      service,
      operator
    })
    return response.data
  },

  async getActiveOrders(): Promise<any> {
    const response = await api.get('/virtusim/orders/active')
    return response.data
  },

  // Health check
  async healthCheck(): Promise<any> {
    const response = await api.get('/health')
    return response.data
  },
}

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      window.location.reload()
    } else if (error.response?.status === 402) {
      // Insufficient credits
      alert('Insufficient credits. Please add more credits to continue.')
    } else if (error.response?.status === 429) {
      // Rate limit exceeded
      alert('Rate limit exceeded. Please wait a moment before trying again.')
    }
    return Promise.reject(error)
  }
)