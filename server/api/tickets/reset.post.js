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

    const today = new Date().toISOString().split('T')[0]
    
    // Reset all data
    await kv.set('ticketDate', today)
    await kv.set('currentTicket', 'null')
    await kv.set('ticketQueue', JSON.stringify([]))
    
    return {
      success: true,
      message: 'All tickets reset',
      currentTicket: null,
      ticketQueue: []
    }
  } catch (error) {
    console.error('Error resetting tickets:', error)
    return {
      error: `Failed to reset tickets: ${error.message}`,
      success: false
    }
  }
})
