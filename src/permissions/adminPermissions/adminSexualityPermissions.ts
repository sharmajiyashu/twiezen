import { PermissionModule } from '../../schema/user';

export const adminSexualityPermission: PermissionModule = {
  moduleName: 'Admin Sexuality',
  enabled: false,
  features: {
    'admin:sexuality:create': {
      enabled: false,
      description: 'Create admin sexuality',
    },
    'admin:sexuality:update': {
      enabled: false,
      description: 'Update admin sexuality',
    },
    'admin:sexuality:delete': {
      enabled: false,
      description: 'Delete admin sexuality',
    },
    'admin:sexuality:get': {
      enabled: false,
      description: 'Get admin sexuality',
    }
  }
};
