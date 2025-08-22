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
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        this.scores = data.scores || []
        this.stats = data.stats || {
          totalUnalived: 0,
          totalContributors: 0,
          averagePerContributor: 0
        }
      } catch (error) {
        console.error('Error fetching scores:', error)
        // Don't show error message for initial load failures (e.g., missing DATABASE_URL in preview)
        // this.error = 'Failed to load scores. Please try again.'
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
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (data.success) {
          this.scores = data.scores
          this.stats = data.stats
        } else {
          throw new Error(data.error || 'Failed to add score')
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