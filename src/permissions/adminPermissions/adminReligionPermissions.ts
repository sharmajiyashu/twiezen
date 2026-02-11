import { PermissionModule } from '../../schema/user';

export const adminReligionPermission: PermissionModule = {
  moduleName: 'Admin Religion',
  enabled: false,
  features: {
    'admin:religion:create': {
      enabled: false,
      description: 'Create admin religion',
    },
    'admin:religion:update': {
      enabled: false,
      description: 'Update admin religion',
    },
    'admin:religion:delete': {
      enabled: false,
      description: 'Delete admin religion',
    },
    'admin:religion:get': {
      enabled: false,
      description: 'Get admin religion',
    }
  }
};
