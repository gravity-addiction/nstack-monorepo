config = {
  squareup: {
    apiSandboxUrl: 'https://connect.squareupsandbox.com/',
    apiSandboxAppToken: 'SANDBOX_SECRET_TOKEN',

    apiProdUrl: 'https://connect.squareup.com/',
    apiProdAppToken: 'PROD_SECRET_TOKEN',

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

    storeId: 'KG10BD57D65CT',
  }
};