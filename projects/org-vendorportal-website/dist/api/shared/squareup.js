config = {
  squareup: {
    dbTables: {
      sqCharges: 'squareup_charges'
    },
    useSandbox: false,
    sandbox: {
      apiUrl: "https://connect.squareupsandbox.com/",
      appId: '***',
      accessToken: '***',
      apiVersion: '2020-12-16',
      webhookUrl: '***',
      webhookValidationSalt: '***',
    },
    production: {
      apiUrl: "https://connect.squareup.com/",
      appId: '***',
      accessToken: '***',
      apiVersion: '2020-12-16',
      webhookUrl: '***',
      webhookValidationSalt: '***'
    }
  }
};
