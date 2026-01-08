import { createClient } from 'redis'

export default defineEventHandler(async (event) => {
  let redis
  try {
    // Verify REDIS_URL is available
    if (!process.env.REDIS_URL) {
      console.error('REDIS_URL environment variable not found')
      return {
        error: 'Redis database not configured',
        currentTicket: null,
        ticketQueue: []
      }
    }

    // Connect to Redis
    redis = createClient({ url: process.env.REDIS_URL })
    await redis.connect()

    const today = new Date().toISOString().split('T')[0]
    const lastResetDate = await redis.get('ticketDate')
    
    // Check if we need to reset (new day)
    if (lastResetDate !== today) {
      // Reset all data
      await redis.set('ticketDate', today)
      await redis.set('currentTicket', 'null')
      await redis.set('ticketQueue', JSON.stringify([]))
      
      await redis.quit()
      return {
        currentTicket: null,
        ticketQueue: [],
        date: today
      }
    }
    
    // Get current state
    const currentTicket = await redis.get('currentTicket')
    const queueData = await redis.get('ticketQueue')
    const ticketQueue = queueData ? JSON.parse(queueData) : []
    
    await redis.quit()
    return {
      currentTicket: currentTicket === 'null' ? null : parseInt(currentTicket),
      ticketQueue,
      date: today
    }
  } catch (error) {
    console.error('Error fetching tickets:', error)
    if (redis) await redis.quit().catch(() => {})
    return {
      error: `Failed to fetch tickets: ${error.message}`,
      currentTicket: null,
      ticketQueue: []
    }
  }
})
