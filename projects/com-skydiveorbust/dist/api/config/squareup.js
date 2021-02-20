config = {
  squareup: {
    apiSandboxUrl: 'https://connect.squareupsandbox.com/',
    apiSandboxAppToken: '',

    apiProdUrl: 'https://connect.squareup.com/',
    apiProdAppToken: '***',

    dbTables: {
      squareupOAuth: 'squareup.oauth_tokens',
      squareup: 'squareup',
      squareupItems: 'squareup_items',
      squareupFlags: 'squareup_flags',
      squareupOverrides: 'squareup_overrides',
    },
    dbSPs: {
      procFlagged: 'squareup_flagged',
      procPayments: 'squareup_payments',
    },

    storeId: '***',
  },
  rbac: {
    definition: {
      user: {
        can: [
          'squareup:add-review',
          {
            name: ['squareup:view'],
            when: async (params) => {
              const list = (Array.isArray(params.list)) ? params.list : [params.list];
              return (list.indexOf(params.user) + 1); // 0 - falsy 1+ true
            },
          },
        ],
      },
      admin: {
        can: [
          'squareup:view',
          'squareup:transactions',
          'squareup_stores:webhook'
        ],
      },
    },
  },
};