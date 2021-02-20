config = {
  blog: {
    dbTables: {
      post: 'post',
    }
  },
  rbac: {
    definition: {
      guest: {
        can: [
          'posts:view',
        ],
      },
      admin: {
        can: [
          'blog:create',
          'posts:create'
        ]
      }
    }
  }
};