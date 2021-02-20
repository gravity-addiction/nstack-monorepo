config = {
  apiPrefix: '/api/govern',
  httpPort: Number(process.env.PORT) || 3022,

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
