<template>
  <div id="app" class="min-h-screen relative overflow-hidden">
    <!-- Animated Lanternflies Background -->
    <AnimatedLanternfly v-for="n in 6" :key="n" :variant="n" :size="getSizeVariant(n)" />
    
    <!-- Main Content -->
    <div class="relative z-10 min-h-screen">
      <!-- Header -->
      <header class="text-center py-8 px-4">
        <h1 class="text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-400 via-purple-500 to-green-400 bg-clip-text text-transparent mb-4 animate-pulse">
          🔥 Deluminator Scoreboard 🔥
        </h1>
        <p class="text-lg text-gray-300 max-w-2xl mx-auto">
          Track your contribution to controlling the invasive spotted lanternfly population. 
          Every unalived lanternfly helps protect our ecosystem! 🌱
        </p>
        <div class="mt-4 text-sm text-gray-400">
          <div class="inline-flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
            <span>🎯</span>
            <span>Together we make a difference</span>
            <span>🌍</span>
          </div>
        </div>
      </header>

      <!-- Main Content Grid -->
      <main class="container mx-auto px-4 pb-8">
        <div class="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <!-- Leaderboard Section -->
          <div class="order-2 lg:order-1">
            <Leaderboard />
          </div>
          
          <!-- Reporter Section -->
          <div class="order-1 lg:order-2">
            <UnaliveReporter />
          </div>
        </div>
        
        <!-- Fun Stats Section -->
        <div class="mt-8 max-w-4xl mx-auto">
          <Card class="backdrop-blur-sm bg-card/30 border-border/50">
            <CardHeader>
              <CardTitle class="text-center bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
                🌟 Community Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div class="p-4 bg-card/20 rounded-lg border border-border/30">
                  <div class="text-2xl font-bold text-green-400">{{ store.totalUnalived.toLocaleString() }}</div>
                  <div class="text-sm text-muted-foreground">Total Unalived</div>
                </div>
                <div class="p-4 bg-card/20 rounded-lg border border-border/30">
                  <div class="text-2xl font-bold text-purple-400">{{ store.stats.totalContributors }}</div>
                  <div class="text-sm text-muted-foreground">Active Contributors</div>
                </div>
                <div class="p-4 bg-card/20 rounded-lg border border-border/30">
                  <div class="text-2xl font-bold text-blue-400">{{ averagePerContributor }}</div>
                  <div class="text-sm text-muted-foreground">Avg per Person</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <!-- Footer -->
      <footer class="text-center py-6 px-4 text-muted-foreground text-sm">
        <div class="max-w-2xl mx-auto">
          <p class="mb-2">
            The spotted lanternfly is an invasive species that damages plants and crops. 
            Your efforts help protect Pennsylvania's agriculture and environment.
          </p>
          <div class="flex items-center justify-center space-x-4 text-xs">
            <span>🦗 Made with Vue 3</span>
            <span>•</span>
            <span>🎨 Styled with shadcn/ui</span>
            <span>•</span>
            <span>💚 For the Environment</span>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useScoreStore } from './stores/scoreStore'
import Leaderboard from './components/Leaderboard.vue'
import UnaliveReporter from './components/UnaliveReporter.vue'
import AnimatedLanternfly from './components/AnimatedLanternfly.vue'
import Card from '@/components/ui/card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'

const store = useScoreStore()

const averagePerContributor = computed(() => {
  return store.stats.averagePerContributor
})

const getSizeVariant = (index) => {
  const sizes = ['sm', 'md', 'lg']
  return sizes[index % 3]
}

onMounted(async () => {
  await store.fetchScores()
})
</script>

<style>
body {
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f1f0f 100%);
}

#app {
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(147, 51, 234, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(147, 51, 234, 0.7);
}
</style>