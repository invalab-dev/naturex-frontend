export const enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export class User {
  public id!: string;
  public email!: string;
  public roles!: UserRole[];
  public name!: string | null;
  public phoneNumber!: string | null;
  public bio!: string | null;
  public organizationId!: string | null;
  public language!: string;
  public timezone!: string;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.roles = user.roles;
    this.name = user.name;
    this.phoneNumber = user.phoneNumber;
    this.bio = user.bio;
    this.organizationId = user.organizationId;
    this.language = user.language;
    this.timezone = user.timezone;
  }
}

export enum OrganizationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export enum OrganizationType {
  'COMPANY' = 'COMPANY',
  'PUBLIC' = 'PUBLIC',
  'NGO' = 'NGO',
}

export enum OrganizationSize {
  'SOLO' = 'SOLO',
  'SMALL' = 'SMALL',
  'MEDIUM' = 'MEDIUM',
  'ENTERPRISE' = 'ENTERPRISE',
}

export class Organization {
  public id!: string;
  public name!: string;
  public type!: OrganizationType;
  public size!: OrganizationSize;
  public contact!: string | null;
  public website!: string | null;
  public status!: OrganizationStatus;
  public createdAt!: Date;

  constructor(
    org: Omit<Organization, 'type' | 'size' | 'status' | 'createdAt'> & {
      type: keyof typeof OrganizationType;
      size: keyof typeof OrganizationSize;
      status: keyof typeof OrganizationStatus;
      createdAt: string;
    },
  ) {
    this.id = org.id;
    this.name = org.name;
    this.type = OrganizationType[org.type];
    this.size = OrganizationSize[org.size];
    this.status = OrganizationStatus[org.status];
    this.contact = org.contact;
    this.website = org.website;
    this.createdAt = new Date(org.createdAt);
  }
}

export enum ProjectTheme {
  EFFICIENCY = 'EFFICIENCY',
  ASSET = 'ASSET',
  BIODIVERSITY = 'BIODIVERSITY',
}

export enum ProjectStatus {
  PENDING = 'PENDING',
  ANALYZING = 'ANALYZING',
  DELIVERING = 'DELIVERING',
  EXECUTING = 'EXECUTING',
  COMPLETED = 'COMPLETED',
}

export class ProjectStatusLog {
  id!: string;
  status!: ProjectStatus;
  changedBy!: string;
  description!: string | undefined | null;

  constructor(
    statusLog: Omit<ProjectStatusLog, 'status'> & {
      status: keyof typeof ProjectStatus;
    },
  ) {
    this.id = statusLog.id;
    this.status = ProjectStatus[statusLog.status];
    this.changedBy = statusLog.changedBy;
    this.description = statusLog.description;
  }
}

export class Project {
  public id!: string;
  public name!: string;
  public description!: string | null;
  public location!: string | null;
  public theme!: ProjectTheme;
  public organizationId!: string | null;
  public managerId!: string | null;
  public currentStatus!: ProjectStatus;

  constructor(
    project: Omit<Project, 'theme' | 'currentStatus'> & {
      theme: keyof typeof ProjectTheme;
      currentStatus: keyof typeof ProjectStatus;
    },
  ) {
    this.id = project.id;
    this.name = project.name;
    this.description = project.description;
    this.location = project.location;
    this.theme = ProjectTheme[project.theme];
    this.organizationId = project.organizationId;
    this.managerId = project.managerId;
    this.currentStatus = ProjectStatus[project.currentStatus];
  }
}

export class Resource {
  public id!: string;
  public projectId!: string;
  public uploaderId!: string;
  public originalName!: string;
  public storedName!: string;
  public fullPath!: string;
  public byteSize!: bigint;
  public extension!: string | null;
  public mimeType!: string | null;
  public isPublic: boolean;
  public isDeleted: boolean;
  public createdAt!: Date;

  constructor(
    resource: Omit<Resource, 'createdAt'> & {
      createdAt: string;
    },
  ) {
    this.id = resource.id;
    this.projectId = resource.projectId;
    this.uploaderId = resource.uploaderId;
    this.originalName = resource.originalName;
    this.storedName = resource.storedName;
    this.fullPath = resource.fullPath;
    this.byteSize = resource.byteSize;
    this.extension = resource.extension;
    this.mimeType = resource.mimeType;
    this.isPublic = resource.isPublic;
    this.isDeleted = resource.isDeleted;
    this.createdAt = new Date(resource.createdAt);
  }
}
