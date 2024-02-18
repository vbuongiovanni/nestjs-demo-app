enum Resource {
  Users = 'users',
  Roles = 'roles',
  Cats = 'cats',
}

enum Action {
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type TPermission = `${Resource}:${Action}`;
