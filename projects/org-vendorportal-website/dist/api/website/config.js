config = {
  apiPrefix: '/api/latest',
  httpPort: Number(process.env.PORT) || 3020,
  auth: {
    // Set this as the unique key to sign your jwt tokens
    jwtSecret: 'YourJWTSecretCode',
    jwtTimeout: "1y", // <int> as Seconds or <string> Timeout for JWT (jsonwebtoken)
  },

  db: {
    user: '***',
    password: '***',
    database: '***'
  },

  logger: {
    level: 'info', // trace > debug > info > warn > error > fatal > silent
  }
};
