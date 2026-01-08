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

    const today = new Date().toISOString().split('T')[0]
    
    // Reset all data
    await redis.set('ticketDate', today)
    await redis.set('currentTicket', 'null')
    await redis.set('ticketQueue', JSON.stringify([]))
    
    await redis.quit()
    return {
      success: true,
      message: 'All tickets reset',
      currentTicket: null,
      ticketQueue: []
    }
  } catch (error) {
    console.error('Error resetting tickets:', error)
    if (redis) await redis.quit().catch(() => {})
    return {
      error: `Failed to reset tickets: ${error.message}`,
      success: false
    }
  }
})
