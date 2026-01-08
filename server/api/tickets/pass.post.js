import { kv } from '@vercel/kv'

export default defineEventHandler(async (event) => {
  try {
    // Verify KV is available
    if (!process.env.KV_URL && !process.env.REDIS_URL) {
      console.error('No KV environment variable found')
      return {
        error: 'KV database not configured',
        success: false
      }
    }

    // Get current state
    const currentTicketVal = await kv.get('currentTicket')
    const queueData = await kv.get('ticketQueue')
    const ticketQueue = queueData ? JSON.parse(queueData) : []
    
    let currentTicket = currentTicketVal === 'null' || currentTicketVal === null ? null : currentTicketVal
    
    if (ticketQueue.length === 0) {
      return {
        success: false,
        error: 'No tickets in queue'
      }
    }
    
    // Remove current ticket from queue
    const currentIndex = ticketQueue.findIndex(t => t.ticketNumber === currentTicket)
    if (currentIndex !== -1) {
      ticketQueue.splice(currentIndex, 1)
    }
    
    // Set to next ticket in queue or null if empty
    if (ticketQueue.length > 0) {
      const smallest = Math.min(...ticketQueue.map(t => t.ticketNumber))
      currentTicket = smallest
    } else {
      currentTicket = null
    }
    
    // Save to KV
    await kv.set('currentTicket', currentTicket === null ? 'null' : currentTicket)
    await kv.set('ticketQueue', JSON.stringify(ticketQueue))
    
    return {
      success: true,
      currentTicket,
      ticketQueue
    }
  } catch (error) {
    console.error('Error passing ticket:', error)
    return {
      error: `Failed to pass ticket: ${error.message}`,
      success: false
    }
  }
})
