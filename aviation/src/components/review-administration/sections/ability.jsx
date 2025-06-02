import { AbilityBuilder, Ability } from '@casl/ability';

// Define user abilities based on role
export function defineAbilitiesFor(user) {
  const { can, cannot, rules } = new AbilityBuilder(Ability);

  if (user.role === 'admin') {
    // Admin can manage everything
    can('manage', 'all');
    
    // Admin can see department and category but not domain
    can('select', 'Department');
    can('select', 'Category');
    cannot('select', 'Domain');
    
    // Admin can edit and delete documents
    can('edit', 'Document');
    can('delete', 'Document');
    
    // Admin can view all main tabs
    can('view', 'PendingTab');
    can('view', 'ApprovedTab');
    can('view', 'DeactivatedTab');
    can('view', 'ReferenceTab');
    
  } else if (user.role === 'manager') {
    // Manager can read and manage documents
    can('read', 'Document');
    can('create', 'Document');
    can('update', 'Document');
    can('manage', 'Department');
    
    // Manager can only select department (not domain or category)
    can('select', 'Department');
    cannot('select', 'Domain');
    cannot('select', 'Category');
    
    // Manager can edit documents but cannot delete them
    can('edit', 'Document');
    cannot('delete', 'Document');
    
    // Manager can view pending, approved, and reference tabs (NOT deactivated)
    can('view', 'PendingTab');
    can('view', 'ApprovedTab');
    cannot('view', 'DeactivatedTab');
    can('view', 'ReferenceTab');
    
    // Manager can read their own profile
    can('read', 'User', { id: user.id });
    
  } else if (user.role === 'user' || user.role === 'normal') {
    // Normal users can read and create documents
    can('read', 'Document');
    can('create', 'Document');
    can('update', 'Document');
    
    // Normal users can select domain and category
    can('select', 'Domain');
    can('select', 'Category');
    can('select', 'Department');
    
    // Normal users cannot edit or delete documents
    cannot('edit', 'Document');
    cannot('delete', 'Document');
    
    // Normal users can only view pending and reference tabs (NOT approved or deactivated)
    can('view', 'PendingTab');
    cannot('view', 'ApprovedTab');
    cannot('view', 'DeactivatedTab');
    can('view', 'ReferenceTab');
    
    // Normal users can read their own profile
    can('read', 'User', { id: user.id });
    
  } else {
    // Guest users - very limited permissions
    can('read', 'Document', { isPublic: true });
    
    // Guests can only view reference documents
    cannot('view', 'PendingTab');
    cannot('view', 'ApprovedTab');
    cannot('view', 'DeactivatedTab');
    can('view', 'ReferenceTab');
  }

  return new Ability(rules);
}

// Create a default ability instance
export const ability = defineAbilitiesFor({ role: 'user' }); // Default to normal user

// Function to update ability when user logs in/out
export function updateAbility(newUser) {
  const updatedAbility = defineAbilitiesFor(newUser);
  ability.update(updatedAbility.rules);
  return ability;
}