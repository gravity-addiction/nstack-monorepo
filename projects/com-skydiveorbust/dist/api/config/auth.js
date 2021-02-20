config = {
  auth: {
    authTokenKey: '_SDOBID',
    jwtSecret: '***',
    jwtTimeout: 60,
    dbTables: {
      users: 'users',
      usersAutologin: 'users_autologin',
      roles: 'user_roles',
      tokens: 'tokens',
    }
  },
  rbac: {
    definition: {
      guest: {
        can: [
          'user:register'
        ]
      },
      user: {
        can: [
          {
            name: 'user:view',
            when: async (params) => (params.user.toString() === params.id.toString())
          }, {
            name: 'user:edit',
            when: async (params) => (params.user.toString() === params.id.toString())
          },
        ],
      },
      admin: {
        can: [
          'user:list',
          'user:view',
          'user:edit',
          'user:delete',
          'user:resetpassword',
        ],
      },
    },
  },
};
