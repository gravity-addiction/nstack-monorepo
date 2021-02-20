config = {
  rbac: {
    enabled: true,
    defaultRole: 'user',
    definition: {
      guest: {
        can: [
          'posts:view',
          'user:register',
          {
            name: 'user:view',
            when: function (params) { return (params.user.toString() === params.id.toString()); },
          }, {
            name: 'user:edit',
            when: function (params) { return (params.user.toString() === params.id.toString()); },
          },
        ],
      },
      user: {
        can: [
          'inv:list',
          'inv:upload',
          'squareup:add-review',
          {
            name: ['ledger:view', 'modifiers:view', 'squareup:view', 'vendors:view'],
            when: function (params) {
              list = (Array.isArray(params.list)) ? params.list : [params.list];
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
          'posts:create',

          'modifiers:view',
          'modifiers:add',
          'modifiers:delete',
          'user:list',
          'user:view',
          'user:edit',
          'user:delete',
          'user:resetpassword',
          'vendors:list',
          'vendors:view',
          'vendors:create',
          'vendors:deactivate',
          'vendors:edit',
          'vendors:report',
          'vendors:resetpassword',
          'vendor_notes:add',
          'vendor_notes:view',
          'squareup:view',
          'squareup:transactions',
          'squareup_stores:webhook'],
        inherits: ['user', 'guest'],
      },
    },
  },
};
