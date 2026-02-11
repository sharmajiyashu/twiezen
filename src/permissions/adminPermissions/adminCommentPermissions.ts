import { PermissionModule } from '../../schema/user';

export const adminCommentPermission: PermissionModule = {
  moduleName: 'Admin Comment',
  enabled: false,
  features: {
    'admin:comment:create': {
      enabled: false,
      description: 'Create admin comment',
    },
    'admin:comment:update': {
      enabled: false,
      description: 'Update admin comment',
    },
    'admin:comment:delete': {
      enabled: false,
      description: 'Delete admin comment',
    },
    'admin:comment:get': {
      enabled: false,
      description: 'Get admin comment',
    }
  }
};
