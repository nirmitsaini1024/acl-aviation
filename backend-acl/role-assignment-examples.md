# Role Management API

## 1. Create Role

### Endpoint
`POST /roles`

### Request Body
```json
{
  "domain": "Technology",
  "department": "Software Development",
  "roleName": "Senior Developer",
  "middlename": "Lead",
  "roleTitle": "Senior Software Developer",
  "description": "Responsible for leading development teams and architectural decisions",
  "documentRepoAccess": {
    "inReview": {
      "permission": "read-write",
      "actions": {
        "referenceDocumentAccess": "full",
        "notify": "immediate"
      }
    },
    "referenceDocument": "read-only",
    "approved": "read-write",
    "deactivated": "no-access"
  }
}
```

### Success Response
```json
{
  "message": "Role has been created successfully",
  "newRole": {
    "_id": "64a7b8c9d1234567890abce0",
    "domain": "Technology",
    "department": "Software Development", 
    "roleName": "Senior Developer",
    "middlename": "Lead",
    "roleTitle": "Senior Software Developer",
    "description": "Responsible for leading development teams and architectural decisions",
    "documentRepoAccess": {
      "inReview": {
        "permission": "read-write",
        "actions": {
          "referenceDocumentAccess": "full",
          "notify": "immediate"
        }
      },
      "referenceDocument": "read-only",
      "approved": "read-write", 
      "deactivated": "no-access"
    },
    "userIds": [],
    "groupIds": [],
    "__v": 0
  }
}
```

## 2. Get Role with Assignments

### Endpoint
`GET /roles/:id/assignments`

### Success Response
```json
{
  "message": "Role with assignments fetched successfully",
  "role": {
    "_id": "64a7b8c9d1234567890abce0",
    "domain": "Technology",
    "department": "Software Development",
    "roleName": "Senior Developer",
    "roleTitle": "Senior Software Developer",
    "description": "Responsible for leading development teams and architectural decisions",
    "userIds": [
      {
        "_id": "64a7b8c9d1234567890abcde",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@company.com"
      }
    ],
    "groupIds": [
      {
        "_id": "64a7b8c9d1234567890abcdf",
        "groupName": "Development Team",
        "description": "Main development team for core products"
      }
    ]
  }
}
```

## 3. Role Assignment

### Endpoint
`POST /roles/assign/:id`

Where `:id` is the MongoDB ObjectId of the role to assign.

### Request Body Options

#### Option 1: Assign to User Only
```json
{
  "userId": "64a7b8c9d1234567890abcde"
}
```

#### Option 2: Assign to Group Only
```json
{
  "groupId": "64a7b8c9d1234567890abcdf"
}
```

#### Option 3: Assign to Both User and Group
```json
{
  "userId": "64a7b8c9d1234567890abcde",
  "groupId": "64a7b8c9d1234567890abcdf"
}
```

### Success Response
```json
{
  "message": "Role assigned successfully to user and group",
  "roleId": "64a7b8c9d1234567890abce0",
  "roleName": "Senior Developer",
  "userUpdated": true,
  "groupUpdated": true,
  "roleUpdated": true
}
```

### Features
- **Bidirectional Relationships**: Updates both User/Group documents AND Role document
- **Idempotent**: Won't create duplicates if role is already assigned
- **Validation**: Ensures at least one of userId or groupId is provided
- **Error Handling**: Validates all IDs exist before assignment
- **Flexible**: Can assign to user only, group only, or both simultaneously

## 4. Schema Structure

### Role Schema (Updated)
```javascript
{
  domain: String,
  department: String,
  roleName: String,
  middlename: String (optional),
  roleTitle: String,
  description: String,
  documentRepoAccess: Object,
  userIds: [ObjectId], // Array of assigned user IDs
  groupIds: [ObjectId] // Array of assigned group IDs
}
```

### User Schema
```javascript
{
  // ... other user fields
  roles: [ObjectId] // Array of assigned role IDs
}
```

### Group Schema
```javascript
{
  // ... other group fields
  roles: [ObjectId] // Array of assigned role IDs
}
```

## 5. Bidirectional Updates

When a role is assigned:
1. **User Document**: Role ID is added to `roles` array
2. **Group Document**: Role ID is added to `roles` array  
3. **Role Document**: User ID is added to `userIds` array, Group ID is added to `groupIds` array

This enables efficient querying in both directions:
- "What roles does this user have?" → Query User.roles
- "What users have this role?" → Query Role.userIds
- "What groups have this role?" → Query Role.groupIds

### Error Responses

#### Missing Parameters (Role Assignment)
```json
{
  "statusCode": 400,
  "message": "Error: Role assignment failed!",
  "error": "At least one of userId or groupId must be provided"
}
```

#### Invalid Role ID
```json
{
  "statusCode": 404,
  "message": "Error: Role assignment failed!",
  "error": "Role with ID 64a7b8c9d1234567890abce0 not found"
}
```

#### Invalid User ID
```json
{
  "statusCode": 404,
  "message": "Error: Role assignment failed!",
  "error": "User with ID 64a7b8c9d1234567890abcde not found"
}
```

#### Invalid Group ID
```json
{
  "statusCode": 404,
  "message": "Error: Role assignment failed!",
  "error": "Group with ID 64a7b8c9d1234567890abcdf not found"
}
```

## Additional Example Roles

### Manager Role
```json
{
  "domain": "Operations",
  "department": "Project Management",
  "roleName": "Project Manager",
  "roleTitle": "Senior Project Manager",
  "description": "Manages project timelines, resources, and stakeholder communication",
  "documentRepoAccess": {
    "inReview": {
      "permission": "read-write",
      "actions": {
        "referenceDocumentAccess": "full",
        "notify": "immediate"
      }
    },
    "referenceDocument": "read-write",
    "approved": "read-write",
    "deactivated": "read-only"
  }
}
```

### Analyst Role
```json
{
  "domain": "Finance", 
  "department": "Business Analysis",
  "roleName": "Business Analyst",
  "roleTitle": "Senior Business Analyst",
  "description": "Analyzes business requirements and creates detailed specifications",
  "documentRepoAccess": {
    "inReview": {
      "permission": "read-only",
      "actions": {
        "referenceDocumentAccess": "limited",
        "notify": "daily"
      }
    },
    "referenceDocument": "read-only",
    "approved": "read-only",
    "deactivated": "no-access"
  }
}
``` 