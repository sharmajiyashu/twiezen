import { PermissionModule } from '../../schema/user';

export const adminRolePermission: PermissionModule = {
  moduleName: 'Admin Role',
  enabled: false,
  features: {
    'admin:role:create': {
      enabled: false,
      description: 'Create admin role',
    },
    'admin:role:update': {
      enabled: false,
      description: 'Update admin role',
    },
    'admin:role:delete': {
      enabled: false,
      description: 'Delete admin role'
    },
    'admin:role:get': {
      enabled: false,
      description: 'Get admin role'
    },
    'admin:role:get:permissions': {
      enabled: false,
      description: 'Get admin role permissions',
    }
  }
};
