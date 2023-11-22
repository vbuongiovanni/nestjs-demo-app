db = db.getSiblingDB('demo-app');

db.createUser({
  user: 'admin',
  pwd: 'password',
  roles: [
    {
      role: 'dbOwner',
      db: 'demo-app',
    },
  ],
});
