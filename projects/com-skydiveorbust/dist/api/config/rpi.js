config = {
  rpi: {
    dbTables: {
      codes: 'rpi_codes',
      devices: 'rpi_devices',
    }
  },
  rbac: {
    definition: {
      rpi: {
        can: [
          'rpi:getcode',
        ],
      }
    }
  }
};