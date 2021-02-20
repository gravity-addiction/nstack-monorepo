config = {
  records: {
    dbTables: {
      uspaRecords: 'record_uspa',
    },
    dbSPs: {
      procRecordsByPeople: 'records_by_people',
    }
  },
  rbac: {
    definition: {
      admin: {
        can: [
          'records:update'
        ]
      }
    }
  }
};
