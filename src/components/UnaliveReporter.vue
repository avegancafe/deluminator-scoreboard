<template>
  <Card class="backdrop-blur-sm bg-card/50 border-border/50">
    <CardHeader>
      <CardTitle class="bg-gradient-to-r from-green-400 to-purple-400 bg-clip-text text-transparent">
        📝 Report Your Progress
      </CardTitle>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="submitReport" class="space-y-4">
        <div class="space-y-2">
          <Label for="name">Your Name</Label>
          <Input
            id="name"
            v-model="form.name"
            type="text"
            required
            placeholder="Enter your name"
            :disabled="store.loading"
            class="backdrop-blur-sm"
          />
        </div>
        
        <div class="space-y-2">
          <Label for="count">Number of Lanternflies Unalived Today</Label>
          <Input
            id="count"
            v-model.number="form.count"
            type="number"
            min="1"
            required
            placeholder="Enter count"
            :disabled="store.loading"
            class="backdrop-blur-sm"
          />
        </div>
        
        <Button
          type="submit"
          :disabled="store.loading || !isFormValid"
          class="w-full animate-glow bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
          size="lg"
        >
          <span v-if="!store.loading" class="flex items-center justify-center space-x-2">
            <span>🎯</span>
            <span>Submit Report</span>
          </span>
          <span v-else class="flex items-center justify-center space-x-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Submitting...</span>
          </span>
        </Button>
      </form>
      
      <!-- Error Message -->
      <div 
        v-if="store.error" 
        class="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-center"
      >
        <div class="text-lg font-semibold">⚠️ Error</div>
        <div class="text-sm">{{ store.error }}</div>
        <Button 
          @click="store.clearError()" 
          variant="ghost" 
          size="sm" 
          class="mt-2 text-red-300 hover:text-red-200"
        >
          Dismiss
        </Button>
      </div>
      
      <!-- Success Message -->
      <div 
        v-if="showSuccess" 
        class="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-center animate-pulse"
      >
        <div class="text-lg font-semibold">🎉 Great work!</div>
        <div class="text-sm">Your report has been added to the leaderboard.</div>
      </div>
      
      <!-- Tips Section -->
      <div class="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <h3 class="text-sm font-semibold text-blue-300 mb-2">💡 Pro Tips:</h3>
        <ul class="text-xs text-muted-foreground space-y-1">
          <li>• Look for red wings with black spots</li>
          <li>• Check tree bark and outdoor surfaces</li>
          <li>• Peak activity is late summer/early fall</li>
          <li>• Report helps track invasive species impact</li>
        </ul>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useScoreStore } from '../stores/scoreStore'
import Card from '@/components/ui/card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'

const store = useScoreStore()

const form = ref({
  name: '',
  count: null
})

const showSuccess = ref(false)

const isFormValid = computed(() => {
  return form.value.name.trim().length > 0 && 
         form.value.count > 0 && 
         Number.isInteger(form.value.count)
})

const submitReport = async () => {
  if (!isFormValid.value || store.loading) return
  
  try {
    await store.addScore(form.value.name.trim(), form.value.count)
    
    // Reset form on success
    form.value = {
      name: '',
      count: null
    }
    
    // Show success message
    showSuccess.value = true
    setTimeout(() => {
      showSuccess.value = false
    }, 3000)
  } catch (error) {
    // Error is already handled in the store
    console.error('Failed to submit report:', error)
  }
}
</script>