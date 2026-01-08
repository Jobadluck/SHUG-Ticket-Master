import { createClient } from 'redis'

export default defineEventHandler(async (event) => {
  let redis
  try {
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
    
    if (ticketQueue.length === 0) {
      await redis.quit()
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
    
    // Save to Redis
    await redis.set('currentTicket', currentTicket === null ? 'null' : String(currentTicket))
    await redis.set('ticketQueue', JSON.stringify(ticketQueue))
    
    await redis.quit()
    return {
      success: true,
      currentTicket,
      ticketQueue
    }
  } catch (error) {
    console.error('Error passing ticket:', error)
    if (redis) await redis.quit().catch(() => {})
    return {
      error: `Failed to pass ticket: ${error.message}`,
      success: false
    }
  }
})
