import { AccessLevel } from "src/ability/enums/access-level.enum";

export interface User_ {
  _id: string;
  email: string;
  groupIds?: string[];
}

export interface Group {
  _id: string;
  name: string;
  userIds: string[];
}

export interface Role {
  _id: string;
  domain: string;
  department: string;
  roleName: string;
  roleTitle: string;
  description: string;
  documentRepoAccess: DocumentRepoAccess;
  reviewAdministration: ReviewAdministration;
  userIds: string[];
  groupIds: string[];
}

export interface DocumentRepoAccess {
  inReview: {
    permission: AccessLevel;
    actions: {
      referenceDocumentAccess: AccessLevel;
      notify: AccessLevel;
    };
  };
  referenceDocument: AccessLevel;
  approved: AccessLevel;
  deactivated: AccessLevel;
}

export interface ReviewAdministration {
  reviewAdministrationAccess: {
    permission: AccessLevel;
    upload: {
      permission: AccessLevel;
      actions: {
        uploadWorkingCopy: AccessLevel;
        uploadReferenceDocument: AccessLevel;
      };
    };
    signOff: AccessLevel;
  };
  reviewManagement: AccessLevel;
  adminDocumentRepositoryView: {
    permission: AccessLevel;
    pending: AccessLevel;
    approved: {
      permission: AccessLevel;
      actions: {
        finalCopy: AccessLevel;
        summary: AccessLevel;
        annotatedDocs: AccessLevel;
      };
    };
    deactivated: AccessLevel;
    referenceDocuments: AccessLevel;
  };
}