config = {
  rbac: {
    enabled: true,
    defaultRole: 'guest',
    defaultUserRole: 'user',
    definition: {
      guest: {
        can: [
          'news-feed:get',
        ],
      },
      user: {
        can: [
          'inv:list',
          'inv:upload',
          'inv:upload',
          'news-feed:home',
          {
            name: ['ledger:view', 'modifiers:view', 'vendors:view'],
            when: async (params) => {
              const list = (Array.isArray(params.list)) ? params.list : [params.list];
              return (list.indexOf(params.user) + 1); // 0 - falsy 1+ true
            },
          },
        ],
        inherits: ['guest'],
      },
      admin: {
        can: [
          'item_review',
          'item_review:resolve',
          'ledger:add',
          'ledger:view',
          'ledger:delete',
          'ledger:payout',
          'modifiers:view',
          'modifiers:add',
          'modifiers:delete',
          'vendors:list',
          'vendors:view',
          'vendors:create',
          'vendors:deactivate',
          'vendors:edit',
          'vendors:report',
          'vendors:resetpassword',
          'vendor_notes:add',
          'vendor_notes:view'
        ],
        inherits: ['user', 'guest'],
      },
    },
  },
};
