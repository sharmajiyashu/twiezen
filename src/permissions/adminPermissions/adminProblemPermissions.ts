import { PermissionModule } from '../../schema/user';

export const adminProblemPermission: PermissionModule = {
  moduleName: 'Admin Problem',
  enabled: false,
  features: {
    'admin:problem:create': {
      enabled: false,
      description: 'Create admin problem',
    },
    'admin:problem:update': {
      enabled: false,
      description: 'Update admin problem',
    },
    'admin:problem:delete': {
      enabled: false,
      description: 'Delete admin problem',
    },
    'admin:problem:get': {
      enabled: false,
      description: 'Get admin problem',
    }
  }
};
