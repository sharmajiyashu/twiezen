import { PermissionModule } from '../../schema/user';

export const adminPronounPermission: PermissionModule = {
  moduleName: 'Admin Pronoun',
  enabled: false,
  features: {
    'admin:pronoun:create': {
      enabled: false,
      description: 'Create admin pronoun',
    },
    'admin:pronoun:update': {
      enabled: false,
      description: 'Update admin pronoun',
    },
    'admin:pronoun:delete': {
      enabled: false,
      description: 'Delete admin pronoun',
    },
    'admin:pronoun:get': {
      enabled: false,
      description: 'Get admin pronoun',
    }
  }
};
