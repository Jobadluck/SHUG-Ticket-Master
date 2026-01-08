<template>
  <div class="container">
    <h1 class="title">SHUG Ticket Master</h1>
    
    <img src="/avatar.svg" alt="SHUG" class="avatar" @click="handleLogoClick" />
    
    <div class="current-ticket-section">
      <div class="current-ticket-label">Now Serving</div>
      <div class="current-ticket-number">{{ currentTicket === null ? '----' : formatTicket(currentTicket) }}</div>
    </div>
    
    <!-- User Mode: Get Ticket (Non-Admin Only) -->
    <div v-if="!isAdmin">
      <div class="button-group" v-if="myTicket === null">
        <input 
          v-model="personName" 
          type="text" 
          placeholder="Your name" 
          class="person-input"
          @keyup.enter="getTicket"
        />
        <button @click="getTicket" class="get-ticket-btn">Get Ticket</button>
      </div>
      <div class="your-ticket-display" v-else>
        <span class="your-ticket-label">Your Ticket</span>
        <span class="ticket-number">{{ formatTicket(myTicket) }}</span>
      </div>
    </div>

    <!-- Ticket Queue (All Modes) -->
    <div class="ticket-queue">
      <h3 class="queue-title">Ticket Queue ({{ ticketQueue.length }})</h3>
      <div v-if="ticketQueue.length === 0" class="empty-queue">
        No tickets in queue
      </div>
      <div v-else class="queue-list">
        <div 
          v-for="ticket in ticketQueue" 
          :key="ticket.ticketNumber"
          class="queue-item"
          :class="{ 'current-serving': ticket.ticketNumber === currentTicket }"
        >
          <span class="queue-number">{{ formatTicket(ticket.ticketNumber) }}</span>
          <span class="queue-person">{{ ticket.person || 'Anonymous' }}</span>
        </div>
      </div>
    </div>

    <!-- Admin Panel -->
    <div v-if="isAdmin" class="admin-panel">
      <button @click="passTicket" class="pass-ticket-btn" :disabled="ticketQueue.length === 0">Pass to Next Ticket</button>
      <button @click="resetTickets" class="reset-btn">Reset All Tickets</button>
      <button @click="logout" class="logout-btn">Logout</button>
    </div>
    <div v-else class="admin-hint">
      <small>{{ isMobile ? 'Tap logo 3 times to unlock admin panel' : 'Press Konami Code to unlock admin panel' }}</small>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const currentTicket = ref(null)
const myTicket = ref(null)
const isAdmin = ref(false)
const personName = ref('')
const ticketQueue = ref([])
const isLoading = ref(false)

// Mobile detection
const isMobile = ref(false)
const logoTaps = ref(0)
const tapTimer = ref(null)

// Konami code sequence
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
const konamiIndex = ref(0)

// Detect if device is mobile
const detectMobile = () => {
  isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768
}

// Handle logo click for mobile admin unlock
const handleLogoClick = () => {
  if (!isMobile.value) return
  
  logoTaps.value++
  
  if (logoTaps.value === 3) {
    isAdmin.value = true
    logoTaps.value = 0
    console.log('🔓 Admin mode unlocked!')
    clearTimeout(tapTimer.value)
  } else {
    // Reset tap count after 2 seconds
    clearTimeout(tapTimer.value)
    tapTimer.value = setTimeout(() => {
      logoTaps.value = 0
    }, 2000)
  }
}

// Format ticket to 4 digits with leading zeros
const formatTicket = (ticket) => {
  return String(ticket).padStart(4, '0')
}

// Konami code detection
const handleKeyPress = (event) => {
  const key = event.key
  const expectedKey = konamiCode[konamiIndex.value]
  
  if (key.toLowerCase() === expectedKey.toLowerCase() || key === expectedKey) {
    konamiIndex.value++
    
    if (konamiIndex.value === konamiCode.length) {
      isAdmin.value = true
      konamiIndex.value = 0
      console.log('🔓 Admin mode unlocked!')
    }
  } else {
    konamiIndex.value = 0
    // Check if this key matches the first key in the sequence
    if (key.toLowerCase() === konamiCode[0].toLowerCase() || key === konamiCode[0]) {
      konamiIndex.value = 1
    }
  }
}

// Pass ticket to next number
const passTicket = async () => {
  if (ticketQueue.value.length === 0) return
  
  isLoading.value = true
  try {
    const response = await fetch('/api/tickets/pass', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    
    const data = await response.json()
    if (data.success) {
      currentTicket.value = data.currentTicket
      ticketQueue.value = data.ticketQueue
    }
  } catch (error) {
    console.error('Error passing ticket:', error)
  } finally {
    isLoading.value = false
  }
}

// Reset all tickets
const resetTickets = async () => {
  if (confirm('Are you sure you want to reset all tickets? This cannot be undone.')) {
    isLoading.value = true
    try {
      const response = await fetch('/api/tickets/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      const data = await response.json()
      if (data.success) {
        currentTicket.value = null
        myTicket.value = null
        ticketQueue.value = []
        console.log('🔄 All tickets reset')
      }
    } catch (error) {
      console.error('Error resetting tickets:', error)
    } finally {
      isLoading.value = false
    }
  }
}

// Logout from admin
const logout = () => {
  isAdmin.value = false
}

// Get a new ticket
const getTicket = async () => {
  if (!personName.value.trim() && !isAdmin.value) {
    alert('Please enter your name')
    return
  }
  
  isLoading.value = true
  try {
    const response = await fetch('/api/tickets/get', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ personName: personName.value.trim() || 'Anonymous' })
    })
    
    const data = await response.json()
    if (data.success) {
      myTicket.value = data.myTicket
      currentTicket.value = data.currentTicket
      ticketQueue.value = data.ticketQueue
      personName.value = ''
    }
  } catch (error) {
    console.error('Error getting ticket:', error)
    alert('Failed to get ticket. Please try again.')
  } finally {
    isLoading.value = false
  }
}

// Load state from Vercel KV
const loadState = async () => {
  isLoading.value = true
  try {
    const response = await fetch('/api/tickets')
    const data = await response.json()
    
    if (!data.error) {
      currentTicket.value = data.currentTicket
      ticketQueue.value = data.ticketQueue
    }
  } catch (error) {
    console.error('Error loading state:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  // Initialize state
  await loadState()
  detectMobile()
  
  // Add keyboard listener
  window.addEventListener('keydown', handleKeyPress)
  window.addEventListener('resize', detectMobile)
  
  // Cleanup
  return () => {
    window.removeEventListener('keydown', handleKeyPress)
    window.removeEventListener('resize', detectMobile)
  }
})
</script>

<style scoped>
.admin-panel {
  margin-top: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid #f59e0b;
  border-radius: 10px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.pass-ticket-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.pass-ticket-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
}

.pass-ticket-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
}

.pass-ticket-btn:active {
  transform: translateY(0);
}

.logout-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
}

.logout-btn:active {
  transform: translateY(0);
}

.reset-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
}

.reset-btn:active {
  transform: translateY(0);
}

.person-input {
  flex: 1;
  min-width: 140px;
  padding: 14px 20px;
  border: 2px solid var(--primary);
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  outline: none;
  transition: all 0.3s ease;
}

.person-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.ticket-queue {
  margin-top: 20px;
  width: 100%;
}

.queue-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--dark);
  margin-bottom: 15px;
  text-align: center;
}

.queue-list {
  max-height: 300px;
  overflow-y: auto;
  background: var(--light);
  border-radius: 10px;
  padding: 10px;
}

.queue-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 8px;
  background: white;
  border-radius: 8px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.queue-item:hover {
  border-color: var(--primary);
  transform: translateX(4px);
}

.queue-item.current-serving {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-color: var(--primary);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
}

.queue-number {
  font-size: 20px;
  font-weight: 800;
  color: var(--primary);
  font-family: 'Courier New', monospace;
  min-width: 60px;
}

.queue-person {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: var(--dark);
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.empty-queue {
  text-align: center;
  padding: 40px 20px;
  color: var(--secondary);
  font-size: 14px;
}

.admin-hint {
  margin-top: 20px;
  color: var(--secondary);
  font-size: 12px;
  text-align: center;
}

@media (max-width: 480px) {
  .admin-panel {
    flex-direction: column;
  }

  .pass-ticket-btn,
  .logout-btn,
  .reset-btn {
    width: 100%;
  }

  .button-group {
    flex-direction: column;
  }

  .person-input,
  .get-ticket-btn,
  .your-ticket-display {
    width: 100%;
  }

  .queue-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .queue-person {
    text-align: left;
    width: 100%;
  }
}
</style>

