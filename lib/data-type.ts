export const enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
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
  public type!: 'company' | 'public' | 'ngo';
  public size!: 'solo' | 'small' | 'medium' | 'enterprise';
  public contact!: string | null;
  public website!: string | null;
  public status!: 'active' | 'inactive' | 'archived';

  constructor(org: {
    id: string;
    name: string;
    type: 'company' | 'public' | 'ngo';
    size: 'solo' | 'small' | 'medium' | 'enterprise';
    contact: string | null;
    website: string | null;
    status: 'active' | 'inactive' | 'archived';
  }) {
    this.id = org.id;
    this.name = org.name;
    this.type = org.type;
    this.size = org.size;
    this.contact = org.contact;
    this.website = org.website;
    this.status = org.status;
  }
}

export enum ProjectTheme {
  EFFICIENCY = 'efficiency',
  ASSET = 'asset',
  BIODIVERSITY = 'biodiversity',
}

export enum ProjectStatus {
  PENDING = 'pending',
  ANALYZING = 'analyzing',
  DELIVERING = 'delivering',
  EXECUTING = 'executing',
  COMPLETED = 'completed',
}

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
