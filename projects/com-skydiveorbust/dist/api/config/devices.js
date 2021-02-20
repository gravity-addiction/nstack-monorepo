config = {
  devices: {
    dbTables: {
      devices: 'sdob_devices',
    }
  },
  rbac: {
    definition: {
      rpi: {
        can: [
          'devices:getcode',
        ],
      }
    }
  }
};