import { PermissionModule } from '../../schema/user';

export const adminApprovalPermission: PermissionModule = {
  moduleName: 'Admin Approval',
  enabled: false,
  features: {
    // View approvals
    'admin:approval:users:get': {
      enabled: false,
      description: 'View user verification approvals',
    },
    'admin:approval:feeds:get': {
      enabled: false,
      description: 'View feed approvals',
    },
    'admin:approval:comments:get': {
      enabled: false,
      description: 'View comment approvals',
    },
    'admin:approval:reviews:get': {
      enabled: false,
      description: 'View review approvals',
    },
    'admin:approval:cover_photos:get': {
      enabled: false,
      description: 'View cover photo approvals',
    },
    'admin:approval:profile_photos:get': {
      enabled: false,
      description: 'View profile photo approvals',
    },

    // Approve / Reject actions
    'admin:approval:users:update': {
      enabled: false,
      description: 'Approve or reject user ID/video',
    },
    'admin:approval:feeds:update': {
      enabled: false,
      description: 'Approve or reject feeds',
    },
    'admin:approval:comments:update': {
      enabled: false,
      description: 'Approve or reject comments',
    },
    'admin:approval:reviews:update': {
      enabled: false,
      description: 'Approve or reject reviews',
    },
    'admin:approval:cover_photos:update': {
      enabled: false,
      description: 'Approve or reject cover photos',
    },
    'admin:approval:profile_photos:update': {
      enabled: false,
      description: 'Approve or reject profile photos',
    }
  }
};
