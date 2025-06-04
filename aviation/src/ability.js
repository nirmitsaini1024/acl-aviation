// src/ability.js
import { Ability } from '@casl/ability';

/**
 * Creates ability rules based on permissions
 * @param {Object} permissions - Permissions from backend
 * @returns {Array} - Array of CASL rules
 */
export function defineRules(permissions) {
  // Default empty rules
  const rules = [];
  
  // If no permissions, return empty rules
  if (!permissions || !permissions.documentRepoAccess) {
    console.log('No permissions found, returning empty rules');
    return rules;
  }
  
  const { documentRepoAccess } = permissions;
  console.log('Processing documentRepoAccess:', documentRepoAccess);
  
  // Process inReview permissions
  if (documentRepoAccess.inReview) {
    const access = documentRepoAccess.inReview.permission;
    
    // Tab visibility
    if (access === 'admin_access' || access === 'write_access' || access === 'view_access') {
      rules.push({ action: 'view', subject: 'InReviewTab' });
    }
    
    // Document management
    if (access === 'admin_access') {
      rules.push({ action: 'manage', subject: 'Document' });
      rules.push({ action: 'edit', subject: 'Document' });
      rules.push({ action: 'delete', subject: 'Document' });
      rules.push({ action: 'add', subject: 'ReferenceDocument' });
    } else if (access === 'write_access') {
      rules.push({ action: 'edit', subject: 'Document' });
      rules.push({ action: 'add', subject: 'ReferenceDocument' });
    }
    
    // Reference document access in review
    if (documentRepoAccess.inReview.actions?.referenceDocumentAccess === 'view_access' || 
        documentRepoAccess.inReview.actions?.referenceDocumentAccess === 'admin_access') {
      rules.push({ action: 'view', subject: 'ReferenceDocumentInReview' });
    }
  }
  
  // Process reference document permissions
  if (documentRepoAccess.referenceDocument === 'view_access' || 
      documentRepoAccess.referenceDocument === 'admin_access') {
    rules.push({ action: 'view', subject: 'ReferenceTab' });
    rules.push({ action: 'read', subject: 'ReferenceDocument' });
  }
  
  // Process approved document permissions
  if (documentRepoAccess.approved === 'view_access' || 
      documentRepoAccess.approved === 'admin_access') {
    rules.push({ action: 'view', subject: 'ApprovedTab' });
    rules.push({ action: 'read', subject: 'Document', conditions: { status: 'approved' } });
  }
  
  // Process deactivated document permissions
  if (documentRepoAccess.deactivated === 'view_access' || 
      documentRepoAccess.deactivated === 'admin_access') {
    rules.push({ action: 'view', subject: 'DeactivatedTab' });
    rules.push({ action: 'read', subject: 'Document', conditions: { status: 'deactivated' } });
  }
  
  console.log('Generated rules:', rules);
  return rules;
}

/**
 * Creates a CASL Ability instance
 * @param {Object} permissions - Permissions from backend
 * @returns {Ability} - CASL Ability instance
 */
export function createAbility(permissions) {
  const rules = defineRules(permissions);
  return new Ability(rules);
}

// For debugging - create an ability with all permissions
export function createDebugAbility() {
  return new Ability([
    { action: 'manage', subject: 'all' } // Can do anything
  ]);
}

// Helper functions to get data from localStorage
export function getStoredPermissions() {
  try {
    const permissionsStr = localStorage.getItem('permissions');
    return permissionsStr ? JSON.parse(permissionsStr) : null;
  } catch (error) {
    console.error('Error parsing permissions from localStorage:', error);
    return null;
  }
}

export function getStoredUser() {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
}