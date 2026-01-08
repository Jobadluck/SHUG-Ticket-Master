import { createClient } from 'redis'

export default defineEventHandler(async (event) => {
  let redis
  try {
    const body = await readBody(event)
    const { personName } = body
    
    // Verify REDIS_URL is available
    if (!process.env.REDIS_URL) {
      console.error('REDIS_URL environment variable not found')
      return {
        error: 'Redis database not configured',
        success: false
      }
    }
    
    // Connect to Redis
    redis = createClient({ url: process.env.REDIS_URL })
    await redis.connect()
    
    // Get current state
    const currentTicketVal = await redis.get('currentTicket')
    const queueData = await redis.get('ticketQueue')
    const ticketQueue = queueData ? JSON.parse(queueData) : []
    
    let currentTicket = currentTicketVal === 'null' || currentTicketVal === null ? null : parseInt(currentTicketVal)
    
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
    
    // Save to Redis
    await redis.set('currentTicket', String(currentTicket))
    await redis.set('ticketQueue', JSON.stringify(ticketQueue))
    
    await redis.quit()
    return {
      success: true,
      myTicket: nextTicketNumber,
      currentTicket,
      ticketQueue
    }
  } catch (error) {
    console.error('Error getting ticket:', error)
    if (redis) await redis.quit().catch(() => {})
    return {
      error: `Failed to get ticket: ${error.message}`,
      success: false
    }
  }
})
