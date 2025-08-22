<template>
  <Card class="backdrop-blur-sm bg-card/50 border-border/50">
    <CardHeader>
      <div class="flex items-center justify-between">
        <CardTitle class="bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
          🏆 Leaderboard
        </CardTitle>
        <div class="text-sm text-muted-foreground">
          Total Unalived: <span class="text-green-400 font-semibold">{{ store.totalUnalived }}</span>
        </div>
      </div>
    </CardHeader>
    <CardContent>
    
      <div v-if="store.sortedScores.length === 0" class="text-center py-8 text-muted-foreground">
        <div class="text-4xl mb-2">🦗</div>
        <p>No reports yet. Be the first to contribute!</p>
      </div>
      
      <div v-else class="space-y-3">
        <div 
          v-for="score in store.sortedScores" 
          :key="score.id"
          class="flex items-center justify-between p-4 rounded-lg border transition-all duration-300 hover:bg-accent/50 group"
          :class="{
            'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50': score.rank === 1,
            'bg-gradient-to-r from-slate-300/10 to-slate-500/10 border-slate-500/30': score.rank === 2,
            'bg-gradient-to-r from-amber-600/10 to-amber-800/10 border-amber-600/30': score.rank === 3,
            'bg-card/30 border-border': score.rank > 3
          }"
        >
          <div class="flex items-center space-x-4">
            <div class="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold"
                 :class="{
                   'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900': score.rank === 1,
                   'bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900': score.rank === 2,
                   'bg-gradient-to-r from-amber-600 to-amber-800 text-white': score.rank === 3,
                   'bg-primary/20 text-primary': score.rank > 3
                 }">
              {{ getRankDisplay(score.rank) }}
            </div>
            <div>
              <div class="font-semibold text-foreground group-hover:text-primary transition-colors">
                {{ score.name }}
              </div>
              <div class="text-xs text-muted-foreground">
                {{ getRelativeTime(score.lastUpdated) }}
              </div>
            </div>
          </div>
          
          <div class="text-right">
            <div class="font-bold text-lg"
                 :class="{
                   'text-yellow-400': score.rank === 1,
                   'text-slate-300': score.rank === 2,
                   'text-amber-600': score.rank === 3,
                   'text-green-400': score.rank > 3
                 }">
              {{ score.count.toLocaleString() }}
            </div>
            <div class="text-xs text-muted-foreground">unalived</div>
          </div>
        </div>
      </div>
      
      <div v-if="store.sortedScores.length > 0" class="mt-6 pt-4 border-t border-border">
        <Button 
          @click="showConfirm = true"
          variant="outline"
          size="sm"
          :disabled="store.loading"
          class="w-full text-destructive hover:text-destructive-foreground hover:bg-destructive"
        >
          <span v-if="!store.loading">Clear All Scores</span>
          <span v-else class="flex items-center space-x-2">
            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Clearing...</span>
          </span>
        </Button>
      </div>
      
      <!-- Confirmation Modal -->
      <div v-if="showConfirm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="showConfirm = false">
        <Card class="max-w-sm mx-4" @click.stop>
          <CardHeader>
            <CardTitle class="text-lg">Clear All Scores?</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-muted-foreground mb-6">This action cannot be undone. All leaderboard data will be permanently deleted.</p>
            <div class="flex space-x-3">
              <Button 
                @click="showConfirm = false"
                variant="outline"
                :disabled="store.loading"
                class="flex-1"
              >
                Cancel
              </Button>
              <Button 
                @click="confirmClear"
                variant="destructive"
                :disabled="store.loading"
                class="flex-1"
              >
                <span v-if="!store.loading">Clear All</span>
                <span v-else class="flex items-center space-x-2">
                  <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Clearing...</span>
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref } from 'vue'
import { useScoreStore } from '../stores/scoreStore'
import Card from '@/components/ui/card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'

const store = useScoreStore()
const showConfirm = ref(false)

const getRankDisplay = (rank) => {
  if (rank === 1) return '👑'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return rank
}

const getRelativeTime = (dateString) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now - date
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

const confirmClear = async () => {
  try {
    await store.clearAllScores()
    showConfirm.value = false
  } catch (error) {
    // Error is already handled in the store
    console.error('Failed to clear scores:', error)
  }
}
</script>