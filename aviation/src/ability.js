import { Ability } from '@casl/ability';

export const AppAbility = Ability;

export function defineAbilityFor(permissionsRaw) {
  const permissions = permissionsRaw || {};
  const rules = [];

  function processPermissions(obj, path = []) {
    Object.entries(obj).forEach(([key, value]) => {
      const currentPath = [...path, key].join('.'); // path like "reviewAdministration.reviewManagement"

      if (typeof value === 'string') {
        // direct permission
        addRuleForPermission(value, currentPath);
      } else if (typeof value === 'object' && value !== null) {
        // check for .permission key
        if (value.permission) {
          addRuleForPermission(value.permission, currentPath);
        }
        // recursively process other keys
        processPermissions(value, [...path, key]);
      }
    });
  }

  function addRuleForPermission(permissionLevel, subject) {
    if (permissionLevel === 'view_access') {
      rules.push({ action: 'read', subject });
    } else if (permissionLevel === 'write_access') {
      rules.push({ action: 'read', subject });
      rules.push({ action: 'manage', subject });
    }
    // no_access → do nothing
  }

  processPermissions(permissions);

  return new Ability(rules);
}
