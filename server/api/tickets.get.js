import { kv } from '@vercel/kv'

export default defineEventHandler(async (event) => {
  try {
    const today = new Date().toISOString().split('T')[0]
    const lastResetDate = await kv.get('ticketDate')
    
    // Check if we need to reset (new day)
    if (lastResetDate !== today) {
      // Reset all data
      await kv.set('ticketDate', today)
      await kv.set('currentTicket', null)
      await kv.set('ticketQueue', JSON.stringify([]))
      
      return {
        currentTicket: null,
        ticketQueue: [],
        date: today
      }
    }
    
    // Get current state
    const currentTicket = await kv.get('currentTicket')
    const queueData = await kv.get('ticketQueue')
    const ticketQueue = queueData ? JSON.parse(queueData) : []
    
    return {
      currentTicket: currentTicket === 'null' ? null : currentTicket,
      ticketQueue,
      date: today
    }
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return {
      error: 'Failed to fetch tickets',
      currentTicket: null,
      ticketQueue: []
    }
  }
})
