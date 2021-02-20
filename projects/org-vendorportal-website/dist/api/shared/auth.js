config = {
  auth: {
    // Set this as the unique key to sign your jwt tokens
    jwtSecret: 'specifyJWTSECRETinConfig',
    jwtTimeout: 60, // <int> as Seconds or <string> Timeout for JWT (jsonwebtoken)

    dbTables: {
      oAuthTokens: 'oauth_tokens',
      roles: 'user_roles',
      tokens: 'tokens',
      users: 'users'
    }
  },
};