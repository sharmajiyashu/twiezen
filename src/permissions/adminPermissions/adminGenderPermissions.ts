import { PermissionModule } from '../../schema/user';

export const adminGenderPermission: PermissionModule = {
  moduleName: 'Admin Gender',
  enabled: false,
  features: {
    'admin:gender:create': {
      enabled: false,
      description: 'Create admin gender',
    },
    'admin:gender:update': {
      enabled: false,
      description: 'Update admin gender',
    },
    'admin:gender:delete': {
      enabled: false,
      description: 'Delete admin gender',
    },
    'admin:gender:get': {
      enabled: false,
      description: 'Get admin gender',
    }
  }
};
