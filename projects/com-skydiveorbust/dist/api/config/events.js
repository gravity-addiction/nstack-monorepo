config = {
  events: {
    dbTables: {
      event: 'event',
      eventComp: 'event_comp',
      eventPages: 'event_pages',
      eventRegistrations: 'event_registration',
      eventTeam: 'event_team',
      eventVideos: 'event_videos',
      eventVideoJudge: 'event_videos_judge',
      eventVideoScores: 'event_videos_scores',
      eventVideoSubmit: 'event_videos_submit'
    },
    shortidAttempts: 70
  },
  rbac: {
    definition: {
      guest: {
        can: [
          'event:view',
          'event:video-score:get'
        ]
      },
      user: {
        can: [
          'event:edit',
          'event:update',
          'event:video-queue',
          'event:video-score',
          {
            name: 'event:create:team',
            when: async (params) => (params.user.toString() === params.id.toString())
          }
        ]
      },
      admin: {
        can: [
          'event:edit',
          'event:create',
          'event:create:team'
        ]
      }
    }
  }
}