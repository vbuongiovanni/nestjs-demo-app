enum Resource {
  Users = 'users',
  Invites = 'invites',
}

enum Action {
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type TPermission = `${Resource}:${Action}`;
