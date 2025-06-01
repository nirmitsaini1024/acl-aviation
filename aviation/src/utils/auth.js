import { jwtDecode } from 'jwt-decode';

// Function to decode token
export const decodeToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Function to get tenant_id from token
export const getTenantId = async () => {
  try {
    // First try to get tenant_id from token
    const decoded = decodeToken();
    if (decoded?.tenant_id) {
      return decoded.tenant_id;
    }

    // If not in token, fetch first available tenant
    const response = await fetch('http://localhost:3000/tenants', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tenants');
    }

    const data = await response.json();
    if (data.tenants && data.tenants.length > 0) {
      return data.tenants[0]._id;
    }

    // If no tenants exist, create a default tenant
    const createResponse = await fetch('http://localhost:3000/tenants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        tenantName: 'Default Tenant',
        userName: 'Admin',
        mobileNumber: '1234567890'
      })
    });

    if (!createResponse.ok) {
      throw new Error('Failed to create default tenant');
    }

    const newTenant = await createResponse.json();
    return newTenant.newTenant._id;
  } catch (error) {
    console.error('Error getting tenant ID:', error);
    throw error;
  }
};

// Function to get auth headers with tenant_id
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export const isAuthenticated = () => {
  // Check if the JWT cookie exists
  return document.cookie.includes('jwt=');
};

export const logout = () => {
  // Clear the JWT cookie
  document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  // Clear any other user-related state
  localStorage.removeItem('user');
}; 