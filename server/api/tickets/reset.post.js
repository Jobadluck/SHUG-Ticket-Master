import { kv } from '@vercel/kv'

export default defineEventHandler(async (event) => {
  try {
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
      error: 'Failed to reset tickets',
      success: false
    }
  }
})
