<template>
  <div class="container">
    <h1 class="title">SHUG Ticket Master</h1>
    
    <img src="/avatar.svg" alt="SHUG" class="avatar" />
    
    <div class="current-ticket-section">
      <div class="current-ticket-label">Now Serving</div>
      <div class="current-ticket-number">{{ formatTicket(currentTicket) }}</div>
    </div>
    
    <div class="button-group">
      <button @click="getTicket" class="get-ticket-btn">Get Ticket</button>
      <div class="your-ticket-display" v-if="myTicket !== null">
        <span class="your-ticket-label">Your Ticket</span>
        <span class="ticket-number">{{ formatTicket(myTicket) }}</span>
      </div>
    </div>

    <!-- Admin Panel -->
    <div v-if="isAdmin" class="admin-panel">
      <button @click="passTicket" class="pass-ticket-btn">Pass to Next Ticket</button>
      <button @click="logout" class="logout-btn">Logout</button>
    </div>
    <div v-else class="admin-hint">
      <small>Press Konami Code to unlock admin panel</small>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const currentTicket = ref(0)
const myTicket = ref(null)
const ticketCounter = ref(0)
const isAdmin = ref(false)

// Konami code sequence
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
const konamiIndex = ref(0)

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
const passTicket = () => {
  if (currentTicket.value < 9999) {
    currentTicket.value++
  } else {
    currentTicket.value = 0
  }
}

// Logout from admin
const logout = () => {
  isAdmin.value = false
}

// Get a new ticket
const getTicket = () => {
  // Find the next available ticket number
  ticketCounter.value++
  if (ticketCounter.value > 9999) {
    ticketCounter.value = 1
  }
  myTicket.value = ticketCounter.value
}

// Load state from localStorage
const loadState = () => {
  const now = new Date()
  const savedDate = localStorage.getItem('ticketDate')
  const today = now.toISOString().split('T')[0]
  
  // Check if it's a new day
  if (savedDate !== today) {
    // Reset to new day
    localStorage.setItem('ticketDate', today)
    localStorage.setItem('currentTicket', '0')
    localStorage.setItem('ticketCounter', '0')
    currentTicket.value = 0
    ticketCounter.value = 0
  } else {
    // Load saved values
    const saved = localStorage.getItem('currentTicket')
    const savedCounter = localStorage.getItem('ticketCounter')
    if (saved !== null) currentTicket.value = parseInt(saved)
    if (savedCounter !== null) ticketCounter.value = parseInt(savedCounter)
  }
}

// Save state to localStorage
const saveState = () => {
  localStorage.setItem('currentTicket', String(currentTicket.value))
  localStorage.setItem('ticketCounter', String(ticketCounter.value))
}

// Watch for changes and save
const saveStateOnChange = () => {
  saveState()
}

onMounted(() => {
  // Initialize state
  loadState()
  
  // Add keyboard listener
  window.addEventListener('keydown', handleKeyPress)
  
  // Save state when values change
  const interval = setInterval(() => {
    saveState()
  }, 1000)
  
  // Cleanup
  return () => {
    window.removeEventListener('keydown', handleKeyPress)
    clearInterval(interval)
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

.pass-ticket-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
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
  .logout-btn {
    width: 100%;
  }
}
</style>

