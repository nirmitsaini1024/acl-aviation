// src/AbilityProvider.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createContextualCan } from '@casl/react';
import { Ability, AbilityBuilder } from '@casl/ability';

// Create ability context
export const AbilityContext = createContext(new Ability([]));

// Create Can component
export const Can = createContextualCan(AbilityContext);

// Custom hook to access ability
export function useAbility() {
  const ability = useContext(AbilityContext);
  
  return {
    ability,
    can: (action, subject, field) => ability.can(action, subject, field),
    cannot: (action, subject, field) => ability.cannot(action, subject, field)
  };
}

/**
 * Helper to get permissions from localStorage
 */
function getStoredPermissions() {
  try {
    const permissionsStr = localStorage.getItem('permissions');
    if (permissionsStr) {
      const parsedPermissions = JSON.parse(permissionsStr);
      console.log('Retrieved permissions from localStorage:', JSON.stringify(parsedPermissions, null, 2));
      return parsedPermissions;
    }
    console.log('No permissions found in localStorage');
    return null;
  } catch (error) {
    console.error('Error parsing permissions from localStorage:', error);
    return null;
  }
}

/**
 * Helper function to check if permission should be denied
 */
function shouldDenyAccess(permission) {
  return permission === 'no_access';
}

/**
 * Creates ability rules based on permissions
 */
function createAbilityFromPermissions(permissions) {
  console.log('Creating ability from permissions:', JSON.stringify(permissions, null, 2));
  
  const { can, cannot, build } = new AbilityBuilder(Ability);
  
  // Start by denying all
  cannot('view', 'PendingTab');
  cannot('view', 'ReferenceTab');
  cannot('view', 'ApprovedTab');
  cannot('view', 'DeactivatedTab');
  
  if (!permissions) {
    console.log('No permissions provided, denying all access');
    return build();
  }
  
  // Check reviewAdministration permissions first
  if (permissions.reviewAdministration?.adminDocumentRepositoryView) {
    const adminView = permissions.reviewAdministration.adminDocumentRepositoryView;
    console.log('Processing adminDocumentRepositoryView permissions:', JSON.stringify(adminView, null, 2));
    
    // Pending tab
    if (!shouldDenyAccess(adminView.pending)) {
      can('view', 'PendingTab');
      console.log('Granted PendingTab permission');
    }
    
    // Approved tab
    if (!shouldDenyAccess(adminView.approved?.permission)) {
      can('view', 'ApprovedTab');
      console.log('Granted ApprovedTab permission');
    }
    
    // Deactivated tab
    if (!shouldDenyAccess(adminView.deactivated)) {
      can('view', 'DeactivatedTab');
      console.log('Granted DeactivatedTab permission');
    }
    
    // Reference Documents tab
    if (!shouldDenyAccess(adminView.referenceDocuments)) {
      can('view', 'ReferenceTab');
      console.log('Granted ReferenceTab permission');
    }
  }
  // Fallback to documentRepoAccess permissions
  else if (permissions.documentRepoAccess) {
    const docAccess = permissions.documentRepoAccess;
    console.log('Processing documentRepoAccess permissions:', JSON.stringify(docAccess, null, 2));
    
    // Pending tab
    if (!shouldDenyAccess(docAccess.inReview?.permission)) {
      can('view', 'PendingTab');
      console.log('Granted PendingTab permission (from documentRepoAccess)');
    }
    
    // Reference Documents tab
    if (!shouldDenyAccess(docAccess.referenceDocument)) {
      can('view', 'ReferenceTab');
      console.log('Granted ReferenceTab permission (from documentRepoAccess)');
    }
    
    // Approved tab
    if (!shouldDenyAccess(docAccess.approved)) {
      can('view', 'ApprovedTab');
      console.log('Granted ApprovedTab permission (from documentRepoAccess)');
    }
    
    // Deactivated tab
    if (!shouldDenyAccess(docAccess.deactivated)) {
      can('view', 'DeactivatedTab');
      console.log('Granted DeactivatedTab permission (from documentRepoAccess)');
    }
  }
  
  const ability = build();
  console.log('Generated ability rules:', JSON.stringify(ability.rules, null, 2));
  return ability;
}

/**
 * AbilityProvider component
 */
export function AbilityProvider({ children }) {
  const [ability, setAbility] = useState(() => {
    console.log('Initializing AbilityProvider');
    const permissions = getStoredPermissions();
    return createAbilityFromPermissions(permissions);
  });
  
  // Update ability when localStorage changes
  useEffect(() => {
    console.log('Setting up storage change listener');
    
    function handleStorageChange(e) {
      if (e.key === 'permissions') {
        try {
          const newPermissions = e.newValue ? JSON.parse(e.newValue) : null;
          console.log('Permissions updated in localStorage:', JSON.stringify(newPermissions, null, 2));
          const newAbility = createAbilityFromPermissions(newPermissions);
          setAbility(newAbility);
        } catch (error) {
          console.error('Error updating ability:', error);
        }
      }
    }
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  console.log('AbilityProvider rendering with rules:', JSON.stringify(ability.rules, null, 2));
  
  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}