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

  constructor(user: {
    id: string;
    email: string;
    roles: UserRole[];
    name: string | null;
    phoneNumber: string | null;
    bio: string | null;
    organizationId: string | null;
    language: string;
    timezone: string;
  }) {
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

export class Organization {
  public id!: string;
  public name!: string;
  public type!: 'COMPANY' | 'PUBLIC' | 'NGO';
  public size!: 'SOLO' | 'SMALL' | 'MEDIUM' | 'ENTERPRISE';
  public website!: string | null;
  public status!: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

  constructor(org: {
    id: string;
    name: string;
    type: 'COMPANY' | 'PUBLIC' | 'NGO';
    size: 'SOLO' | 'SMALL' | 'MEDIUM' | 'ENTERPRISE';
    website: string | null;
    status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  }) {
    this.id = org.id;
    this.name = org.name;
    this.type = org.type;
    this.size = org.size;
    this.website = org.website;
    this.status = org.status;
  }
}

export type ProjectTheme = '운영비 절감' | '자산 가치 향상' | '생물 다양성';

export type ProjectStatus =
  | 'REGISTERED'
  | 'ANALYZING'
  | 'PROVIDING'
  | 'COMPLETED'
  | 'PAUSED';

export class ProjectStatusLog {
  id!: string;
  status!: ProjectStatus;
  changedBy!: string;
  description!: string | undefined | null;

  constructor(statusLog: {
    id: string;
    status: ProjectStatus;
    changedBy: string;
    description: string | undefined | null;
  }) {
    this.id = statusLog.id;
    this.status = statusLog.status;
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

  constructor(project: {
    id: string;
    name: string;
    description: string | null;
    location: string | null;
    theme: ProjectTheme;
    organizationId: string | null;
    managerId: string | null;
    currentStatus: ProjectStatus;
  }) {
    this.id = project.id;
    this.name = project.name;
    this.description = project.description;
    this.location = project.location;
    this.theme = project.theme;
    this.organizationId = project.organizationId;
    this.managerId = project.managerId;
    this.currentStatus = project.currentStatus;
  }
}
