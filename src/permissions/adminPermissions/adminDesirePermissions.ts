import { PermissionModule } from '../../schema/user';

export const adminDesirePermission: PermissionModule = {
  moduleName: 'Admin Desire',
  enabled: false,
  features: {
    'admin:desire:create': {
      enabled: false,
      description: 'Create admin desire',
    },
    'admin:desire:update': {
      enabled: false,
      description: 'Update admin desire',
    },
    'admin:desire:delete': {
      enabled: false,
      description: 'Delete admin desire',
    },
    'admin:desire:get': {
      enabled: false,
      description: 'Get admin desire',
    }
  }
};
