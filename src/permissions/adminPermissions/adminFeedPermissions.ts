import { PermissionModule } from '../../schema/user';

export const adminFeedPermission: PermissionModule = {
  moduleName: 'Admin Feed',
  enabled: false,
  features: {
    'admin:feed:create': {
      enabled: false,
      description: 'Create admin feed',
    },
    'admin:feed:update': {
      enabled: false,
      description: 'Update admin feed',
    },
    'admin:feed:delete': {
      enabled: false,
      description: 'Delete admin feed',
    },
    'admin:feed:get': {
      enabled: false,
      description: 'Get admin feed',
    }
  }
};
