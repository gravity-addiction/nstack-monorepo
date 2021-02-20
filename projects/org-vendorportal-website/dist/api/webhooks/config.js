config = {
  apiPrefix: '/webhooks',
  httpPort: Number(process.env.PORT) || 3021,

  db: {
    user: '***',
    password: '***',
    charset: 'utf8',
    database: '***'
  },
  
  // https://www.fastify.io/docs/latest/Logging/
  logger: {
    level: 'info', // trace > debug > info > warn > error > fatal > silent
  }
};
