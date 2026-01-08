<template>
  <div class="container">
    <h1 class="title">SHUG Ticket Master</h1>
    
    <img src="/avatar.jpg" alt="SHUG" class="avatar" />
    
    <div class="current-ticket-section">
      <div class="current-ticket-label">Now Serving</div>
      <div class="current-ticket-number">{{ currentTicket }}</div>
    </div>
    
    <div class="button-group">
      <button @click="getTicket" class="get-ticket-btn">Get Ticket</button>
      <div class="your-ticket-display" v-if="myTicket">
        <span class="your-ticket-label">Your Ticket</span>
        <span class="ticket-number">{{ myTicket }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const currentTicket = ref<number>(1001)
const myTicket = ref<number | null>(null)
const ticketCounter = ref<number>(1001)

const getTicket = () => {
  ticketCounter.value++
  myTicket.value = ticketCounter.value
}

// Simulate current ticket changing (in a real app, this would come from a server)
onMounted(() => {
  setInterval(() => {
    if (currentTicket.value < 9999) {
      currentTicket.value++
    } else {
      currentTicket.value = 1001
    }
  }, 5000)
})
</script>

<style scoped>
/* Component-specific styles can be added here if needed */
</style>
