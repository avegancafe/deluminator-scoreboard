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

// Mock Prisma client for local development
const mockData = new Map()
let nextId = 1

const mockPrismaClient = {
  score: {
    async findMany({ orderBy, select } = {}) {
      const scores = Array.from(mockData.values())
      
      // Sort by count desc, then createdAt asc
      scores.sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count
        return new Date(a.createdAt) - new Date(b.createdAt)
      })
      
      // Return only selected fields if specified
      if (select) {
        return scores.map(score => {
          const result = {}
          Object.keys(select).forEach(key => {
            if (select[key] && score[key] !== undefined) {
              result[key] = score[key]
            }
          })
          return result
        })
      }
      
      return scores
    },
    
    async upsert({ where, update, create }) {
      const existing = Array.from(mockData.values()).find(score => score.name === where.name)
      
      if (existing) {
        // Update existing
        if (update.count && update.count.increment) {
          existing.count += update.count.increment
        } else if (update.count !== undefined) {
          existing.count = update.count
        }
        existing.updatedAt = new Date().toISOString()
        mockData.set(existing.id, existing)
        return existing
      } else {
        // Create new
        const newScore = {
          id: nextId++,
          name: create.name,
          count: create.count,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        mockData.set(newScore.id, newScore)
        return newScore
      }
    },
    
    async deleteMany() {
      mockData.clear()
      return { count: mockData.size }
    }
  }
}

// Mock the prisma module for local development
const createMockHandler = (apiPath) => {
  return async (req, res) => {
    try {
      // Mock the prisma client globally
      global.prisma = mockPrismaClient
      
      // Import and execute the API handler
      const handler = (await import(apiPath)).default
      
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
  res.json({ status: 'ok', message: 'Development server is running (Prisma + Mock DB)' })
})

app.listen(port, () => {
  console.log(`🚀 Development API server running at http://localhost:${port}`)
  console.log(`🗄️  Using mock Prisma database`)
  console.log(`📊 API endpoints:`)
  console.log(`   GET    http://localhost:${port}/api/scores`)
  console.log(`   POST   http://localhost:${port}/api/scores/add`)
  console.log(`   DELETE http://localhost:${port}/api/scores/clear`)
  console.log(`   GET    http://localhost:${port}/api/health`)
})