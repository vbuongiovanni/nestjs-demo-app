db = db.getSiblingDB('demo-app-test');

db.createUser({
  user: 'admin',
  pwd: 'password',
  roles: [
    {
      role: 'dbOwner',
      db: 'demo-app-test',
    },
  ],
});
