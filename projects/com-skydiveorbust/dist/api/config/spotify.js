config = {
  spotify: {
    dbTables: {
      codes: 'spotify_codes',
      tokens: 'spotify_tokens',
    },

    tokenUrl: 'https://accounts.spotify.com/api/token',
    tokenCallbackUrl: '***',
    clientId: '***',
    clientSecret: '***',
  },
  rbac: {
    definition: {
      rpi: {
        can: [
          'spotify:getcode',
        ],
      }
    }
  }
};