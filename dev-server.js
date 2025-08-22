// Simple development server for testing API endpoints locally
import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const port = 3000

// Middleware
app.use(cors())
app.use(express.json())

// Mock KV store for local development
const mockKV = {
  data: new Map(),
  async get(key) {
    const value = this.data.get(key)
    return value ? JSON.parse(value) : null
  },
  async set(key, value) {
    this.data.set(key, JSON.stringify(value))
    return 'OK'
  }
}

// Mock the @vercel/kv module for local development
const createMockHandler = (apiPath) => {
  return async (req, res) => {
    // Mock the kv object
    req.kv = mockKV
    
    try {
      // Import and execute the API handler
      const handler = (await import(apiPath)).default
      
      // Create a mock kv object that the handler can use
      global.kv = mockKV
      
      await handler(req, res)
    } catch (error) {
      console.error('API Error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

// API Routes
app.get('/api/scores', createMockHandler('./api/scores/index.js'))
app.post('/api/scores/add', createMockHandler('./api/scores/add.js'))
app.delete('/api/scores/clear', createMockHandler('./api/scores/clear.js'))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Development server is running' })
})

app.listen(port, () => {
  console.log(`🚀 Development API server running at http://localhost:${port}`)
  console.log(`📊 API endpoints:`)
  console.log(`   GET    http://localhost:${port}/api/scores`)
  console.log(`   POST   http://localhost:${port}/api/scores/add`)
  console.log(`   DELETE http://localhost:${port}/api/scores/clear`)
  console.log(`   GET    http://localhost:${port}/api/health`)
})