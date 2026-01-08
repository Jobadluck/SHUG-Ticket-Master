export default defineEventHandler(async (event) => {
  return {
    kvUrl: !!process.env.KV_URL ? 'Set' : 'Not set',
    redisUrl: !!process.env.REDIS_URL ? 'Set' : 'Not set',
    kvRestApiUrl: !!process.env.KV_REST_API_URL ? 'Set' : 'Not set',
    kvRestApiToken: !!process.env.KV_REST_API_TOKEN ? 'Set' : 'Not set',
    nodeEnv: process.env.NODE_ENV,
    message: 'Check Vercel dashboard > Settings > Environment Variables to see actual values'
  }
})
