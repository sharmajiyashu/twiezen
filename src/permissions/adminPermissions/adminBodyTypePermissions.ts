import { PermissionModule } from '../../schema/user';

export const adminBodyTypePermission: PermissionModule = {
  moduleName: 'Admin Body Type',
  enabled: false,
  features: {
    'admin:body_type:create': {
      enabled: false,
      description: 'Create admin body_type',
    },
    'admin:body_type:update': {
      enabled: false,
      description: 'Update admin body_type',
    },
    'admin:body_type:delete': {
      enabled: false,
      description: 'Delete admin body_type',
    },
    'admin:body_type:get': {
      enabled: false,
      description: 'Get admin body_type',
    }
  }
};
