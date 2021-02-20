config = {
  videoQueue: {
    dbTables: {
      videoQueue: 'video_queue',
      videoUpload: 'video_upload'
    },
  },
  rbac: {
    definition: {
      guest: {
        can: [],
      },
      user: {
        can: [
          'video-queue:get',
          'video-queue:splice'
        ],
      },
      admin: {
        can: [],
      },
    },
  },
};
