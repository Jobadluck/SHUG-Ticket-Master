import { kv } from '@vercel/kv'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { personName } = body
    
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
    
    // Calculate next ticket number
    let nextTicketNumber
    if (currentTicket === null) {
      nextTicketNumber = 1
    } else {
      nextTicketNumber = currentTicket + 1
      if (nextTicketNumber > 9999) {
        nextTicketNumber = 1
      }
    }
    
    // Add to queue
    const newTicket = {
      person: personName || 'Anonymous',
      ticketNumber: nextTicketNumber
    }
    ticketQueue.push(newTicket)
    
    // If no ticket was being served, set it to the smallest
    if (currentTicket === null) {
      currentTicket = Math.min(...ticketQueue.map(t => t.ticketNumber))
    }
    
    // Save to KV
    await kv.set('currentTicket', currentTicket)
    await kv.set('ticketQueue', JSON.stringify(ticketQueue))
    
    return {
      success: true,
      myTicket: nextTicketNumber,
      currentTicket,
      ticketQueue
    }
  } catch (error) {
    console.error('Error getting ticket:', error)
    return {
      error: `Failed to get ticket: ${error.message}`,
      success: false
    }
  }
})
