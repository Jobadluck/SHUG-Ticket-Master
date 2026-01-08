export default defineEventHandler(async (event) => {
  return {
    redisUrl: !!process.env.REDIS_URL ? 'Set' : 'Not set',
    nodeEnv: process.env.NODE_ENV,
    message: 'Check Vercel dashboard > Settings > Environment Variables to see actual values'
  }
})
