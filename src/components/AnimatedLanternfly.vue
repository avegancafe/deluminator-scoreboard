<template>
  <div 
    class="fixed pointer-events-none z-0"
    :class="animationClass"
    :style="positionStyle"
  >
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      class="opacity-30 hover:opacity-50 transition-opacity"
      :class="sizeClass"
    >
      <!-- Lanternfly body -->
      <ellipse cx="12" cy="14" rx="1.5" ry="4" fill="#8B4513" opacity="0.8"/>
      
      <!-- Head -->
      <circle cx="12" cy="9" r="1.5" fill="#654321" opacity="0.8"/>
      
      <!-- Wings -->
      <ellipse cx="8" cy="12" rx="4" ry="2.5" fill="#DC143C" opacity="0.6" transform="rotate(-15 8 12)"/>
      <ellipse cx="16" cy="12" rx="4" ry="2.5" fill="#DC143C" opacity="0.6" transform="rotate(15 16 12)"/>
      
      <!-- Wing spots -->
      <circle cx="6" cy="12" r="1" fill="#8B0000" opacity="0.7"/>
      <circle cx="18" cy="12" r="1" fill="#8B0000" opacity="0.7"/>
      <circle cx="7" cy="10" r="0.5" fill="#FFFFFF" opacity="0.8"/>
      <circle cx="17" cy="10" r="0.5" fill="#FFFFFF" opacity="0.8"/>
      
      <!-- Antennae -->
      <line x1="11" y1="8" x2="10" y2="6" stroke="#654321" stroke-width="0.5" opacity="0.8"/>
      <line x1="13" y1="8" x2="14" y2="6" stroke="#654321" stroke-width="0.5" opacity="0.8"/>
    </svg>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  variant: {
    type: Number,
    default: 1
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

const position = ref({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight
})

const animationClass = computed(() => {
  const animations = ['animate-fly-1', 'animate-fly-2', 'animate-fly-3']
  return animations[(props.variant - 1) % 3]
})

const sizeClass = computed(() => ({
  'w-4 h-4': props.size === 'sm',
  'w-6 h-6': props.size === 'md',
  'w-8 h-8': props.size === 'lg'
}))

const positionStyle = computed(() => ({
  left: `${position.value.x}px`,
  top: `${position.value.y}px`,
  animationDelay: `${Math.random() * 3}s`,
  animationDuration: `${8 + Math.random() * 6}s`
}))

onMounted(() => {
  const updatePosition = () => {
    position.value = {
      x: Math.random() * (window.innerWidth - 50),
      y: Math.random() * (window.innerHeight - 50)
    }
  }
  
  window.addEventListener('resize', updatePosition)
  
  return () => {
    window.removeEventListener('resize', updatePosition)
  }
})
</script>