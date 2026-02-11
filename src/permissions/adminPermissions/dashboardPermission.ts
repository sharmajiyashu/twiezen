import { PermissionModule } from '../../schema/user';

export const dashboardPermission: PermissionModule = {
  moduleName: 'Dashboard',
  enabled: false,
  features: {
    'dashboard:users:get': {
      enabled: false,
      description: 'Get users'
    },
    'dashboard:graphs:get': {
      enabled: false,
      description: 'Get graphs'
    },
    'dashboard:tables:get': { enabled: false, description: 'Get tables' }
  }
};
