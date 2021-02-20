const configDefault: any = {
  devMode: (process.env.DEV_MODE === 'true' || false) as boolean,
  loadedConfigFiles: []
};

export default configDefault;
