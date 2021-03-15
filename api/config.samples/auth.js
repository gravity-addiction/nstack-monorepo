config = {
  auth: {
    // Set this as the unique key to sign your jwt tokens
    jwtSecret: 'specifyJWTSECRETinConfig',
    jwtTimeout: 60, // Timeout for JWT
    cookieSecure: false,

    dbTables: {
      users: 'users',
      roles: 'user_roles',
      tokens: 'tokens',
    }
  },
};
