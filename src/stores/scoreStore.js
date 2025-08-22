import { defineStore } from 'pinia'

const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:3000'

export const useScoreStore = defineStore('scores', {
  state: () => ({
    scores: [],
    stats: {
      totalUnalived: 0,
      totalContributors: 0,
      averagePerContributor: 0
    },
    loading: false,
    error: null
  }),

  getters: {
    sortedScores: (state) => {
      return [...state.scores]
        .sort((a, b) => b.count - a.count)
        .map((score, index) => ({
          ...score,
          rank: index + 1
        }))
    },
    
    totalUnalived: (state) => {
      return state.stats.totalUnalived
    }
  },

  actions: {
    async fetchScores() {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch(`${API_BASE}/api/scores`)
        const data = await response.json()
        
        // Handle both successful responses and server errors with fallback data
        this.scores = data.scores || []
        this.stats = data.stats || {
          totalUnalived: 0,
          totalContributors: 0,
          averagePerContributor: 0
        }
        
        if (!response.ok) {
          console.error('API returned error status:', response.status, data.error)
        }
      } catch (error) {
        console.error('Error fetching scores:', error)
        // Set default values if fetch completely fails
        this.scores = []
        this.stats = {
          totalUnalived: 0,
          totalContributors: 0,
          averagePerContributor: 0
        }
      } finally {
        this.loading = false
      }
    },

    async addScore(name, count) {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch(`${API_BASE}/api/scores/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: name.trim(), count })
        })
        
        const data = await response.json()
        
        if (response.ok && data.success) {
          this.scores = data.scores
          this.stats = data.stats
        } else {
          // API failed but we're in preview mode - add score locally for demo
          console.error('API failed, adding score locally for preview:', data.error)
          
          // Find existing score or create new one
          let existingScoreIndex = this.scores.findIndex(score => score.name === name.trim())
          if (existingScoreIndex >= 0) {
            this.scores[existingScoreIndex].count += count
            this.scores[existingScoreIndex].updatedAt = new Date().toISOString()
          } else {
            this.scores.push({
              name: name.trim(),
              count: count,
              updatedAt: new Date().toISOString()
            })
          }
          
          // Recalculate stats
          const totalUnalived = this.scores.reduce((sum, score) => sum + score.count, 0)
          const totalContributors = this.scores.length
          this.stats = {
            totalUnalived,
            totalContributors,
            averagePerContributor: totalContributors > 0 ? Math.round(totalUnalived / totalContributors) : 0
          }
        }
      } catch (error) {
        console.error('Error adding score:', error)
        this.error = 'Failed to submit score. Please try again.'
        throw error
      } finally {
        this.loading = false
      }
    },

    async clearAllScores() {
      this.loading = true
      this.error = null
      
      const originalScores = [...this.scores]
      const originalStats = { ...this.stats }
      
      try {
        const response = await fetch(`${API_BASE}/api/scores/clear`, {
          method: 'DELETE'
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (data.success) {
          this.scores = []
          this.stats = {
            totalUnalived: 0,
            totalContributors: 0,
            averagePerContributor: 0
          }
        } else {
          throw new Error(data.error || 'Failed to clear scores')
        }
      } catch (error) {
        console.error('Error clearing scores:', error)
        
        // Rollback on error
        this.scores = originalScores
        this.stats = originalStats
        
        this.error = 'Failed to clear scores. Please try again.'
        throw error
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    }
  }
})