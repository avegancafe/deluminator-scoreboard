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
        this.error = 'Failed to load scores. Please try again.'
        
        // Fallback to localStorage if available
        this.loadFromLocalStorage()
      } finally {
        this.loading = false
      }
    },

    async addScore(name, count) {
      this.loading = true
      this.error = null
      
      const originalScores = [...this.scores]
      const originalStats = { ...this.stats }
      
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
          
          // Also save to localStorage as backup
          this.saveToLocalStorage()
        } else {
          throw new Error(data.error || 'Failed to add score')
        }
      } catch (error) {
        console.error('Error adding score:', error)
        
        // Fallback to localStorage when API is unavailable (e.g., preview env without DATABASE_URL)
        console.log('Falling back to localStorage for score submission')
        
        // Add score to local scores array
        const newScore = {
          id: Date.now().toString(),
          name: name.trim(),
          count: count,
          createdAt: new Date().toISOString()
        }
        
        // Find existing score for this name or create new one
        const existingScoreIndex = this.scores.findIndex(score => score.name === name.trim())
        if (existingScoreIndex >= 0) {
          // Update existing score by adding to count
          this.scores[existingScoreIndex].count += count
          this.scores[existingScoreIndex].createdAt = new Date().toISOString()
        } else {
          // Add new score
          this.scores.push(newScore)
        }
        
        // Recalculate stats
        const totalUnalived = this.scores.reduce((total, score) => total + score.count, 0)
        const totalContributors = this.scores.length
        const averagePerContributor = totalContributors > 0 ? Math.round(totalUnalived / totalContributors) : 0
        
        this.stats = {
          totalUnalived,
          totalContributors,
          averagePerContributor
        }
        
        // Save to localStorage
        this.saveToLocalStorage()
        
        // Clear any error since we successfully handled it with localStorage
        this.error = null
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
          
          // Clear localStorage backup as well
          localStorage.removeItem('deluminator-scores')
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

    // Backup methods for localStorage fallback
    loadFromLocalStorage() {
      try {
        const saved = localStorage.getItem('deluminator-scores')
        if (saved) {
          const parsedScores = JSON.parse(saved)
          this.scores = parsedScores
          
          // Calculate stats from local data
          const totalUnalived = parsedScores.reduce((total, score) => total + score.count, 0)
          const totalContributors = parsedScores.length
          const averagePerContributor = totalContributors > 0 ? Math.round(totalUnalived / totalContributors) : 0
          
          this.stats = {
            totalUnalived,
            totalContributors,
            averagePerContributor
          }
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error)
      }
    },

    saveToLocalStorage() {
      try {
        localStorage.setItem('deluminator-scores', JSON.stringify(this.scores))
      } catch (error) {
        console.error('Error saving to localStorage:', error)
      }
    },

    clearError() {
      this.error = null
    }
  }
})