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
const passTicket = () => {
  if (ticketQueue.value.length === 0) return
  
  // Remove current ticket from queue
  const currentIndex = ticketQueue.value.findIndex(t => t.ticketNumber === currentTicket.value)
  if (currentIndex !== -1) {
    ticketQueue.value.splice(currentIndex, 1)
  }
  
  // Set to next ticket in queue or null if empty
  if (ticketQueue.value.length > 0) {
    // Set to smallest ticket number in remaining queue
    const smallest = Math.min(...ticketQueue.value.map(t => t.ticketNumber))
    currentTicket.value = smallest
  } else {
    // No more tickets in queue
    currentTicket.value = null
  }
  
  saveState()
}

// Reset all tickets
const resetTickets = () => {
  if (confirm('Are you sure you want to reset all tickets? This cannot be undone.')) {
    currentTicket.value = null
    myTicket.value = null
    ticketQueue.value = []
    saveState()
    console.log('🔄 All tickets reset')
  }
}

// Logout from admin
const logout = () => {
  isAdmin.value = false
}

// Get a new ticket
const getTicket = () => {
  if (!personName.value.trim() && !isAdmin.value) {
    alert('Please enter your name')
    return
  }
  
  // Calculate next ticket number based on current serving ticket
  let nextTicketNumber
  if (currentTicket.value === null) {
    // If no ticket is being served, start at 0001
    nextTicketNumber = 1
  } else {
    // Get next ticket after current
    nextTicketNumber = currentTicket.value + 1
    if (nextTicketNumber > 9999) {
      nextTicketNumber = 1
    }
  }
  
  // Add to queue
  ticketQueue.value.push({
    person: personName.value.trim() || 'Anonymous',
    ticketNumber: nextTicketNumber
  })
  
  // If no ticket is currently being served, set it to the smallest in queue
  if (currentTicket.value === null) {
    const smallest = Math.min(...ticketQueue.value.map(t => t.ticketNumber))
    currentTicket.value = smallest
  }
  
  myTicket.value = nextTicketNumber
  personName.value = ''
  saveState()
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
    localStorage.setItem('currentTicket', 'null')
    localStorage.setItem('ticketQueue', '[]')
    currentTicket.value = null
    ticketQueue.value = []
  } else {
    // Load saved values
    const saved = localStorage.getItem('currentTicket')
    const savedQueue = localStorage.getItem('ticketQueue')
    
    if (saved !== null && saved !== 'null') {
      currentTicket.value = parseInt(saved)
    } else {
      currentTicket.value = null
    }
    
    if (savedQueue !== null) {
      try {
        ticketQueue.value = JSON.parse(savedQueue)
        // If no current ticket but queue has items, set to smallest
        if (currentTicket.value === null && ticketQueue.value.length > 0) {
          const smallest = Math.min(...ticketQueue.value.map(t => t.ticketNumber))
          currentTicket.value = smallest
        }
      } catch (e) {
        ticketQueue.value = []
      }
    }
  }
}

// Save state to localStorage
const saveState = () => {
  localStorage.setItem('currentTicket', currentTicket.value === null ? 'null' : String(currentTicket.value))
  localStorage.setItem('ticketQueue', JSON.stringify(ticketQueue.value))
}

// Watch for changes and save
const saveStateOnChange = () => {
  saveState()
}

onMounted(() => {
  // Initialize state
  loadState()
  detectMobile()
  
  // Add keyboard listener
  window.addEventListener('keydown', handleKeyPress)
  window.addEventListener('resize', detectMobile)
  
  // Save state when values change
  const interval = setInterval(() => {
    saveState()
  }, 1000)
  
  // Cleanup
  return () => {
    window.removeEventListener('keydown', handleKeyPress)
    window.removeEventListener('resize', detectMobile)
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

