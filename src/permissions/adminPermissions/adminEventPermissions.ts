import { PermissionModule } from '../../schema/user';

export const adminEventPermission: PermissionModule = {
  moduleName: 'Admin Event',
  enabled: false,
  features: {
    'admin:event:create': {
      enabled: false,
      description: 'Create admin event',
    },
    'admin:event:update': {
      enabled: false,
      description: 'Update admin event',
    },
    'admin:event:delete': {
      enabled: false,
      description: 'Delete admin event',
    },
    'admin:event:get': {
      enabled: false,
      description: 'Get admin event',
    }
  }
};
