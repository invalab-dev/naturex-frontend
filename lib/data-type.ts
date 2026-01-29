
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



// export interface Org {
//   id: string
//   name: string
//   createdAt: string
// }
//
// export interface AuthSession {
//   userId: string
//   role: "ADMIN" | "USER"
//   orgId: string | null
//   name: string
//   email: string
// }
//
// const KEYS = {
//   users: "naturex_users",
//   orgs: "naturex_orgs",
//   auth: "naturex_auth",
// }
//
// // Initialize with seeded accounts
// export function initializeAuthData() {
//   // Check if already initialized
//   if (localStorage.getItem(KEYS.users)) return
//
//   // Seed orgs
//   const seedOrgs: Org[] = [
//     {
//       id: "org-customer-001",
//       name: "Customer 1 (Demo Org)",
//       createdAt: new Date().toISOString(),
//     },
//   ]
//   localStorage.setItem(KEYS.orgs, JSON.stringify(seedOrgs))
//
//   // Seed users
//   const seedUsers: User[] = [
//     {
//       id: "user-admin-001",
//       role: "admin",
//       name: "Dr. Shin",
//       email: "admin@naturex.test",
//       password: "Admin1234!",
//       orgId: null,
//       createdAt: new Date().toISOString(),
//     },
//     {
//       id: "user-customer-001",
//       role: "customer",
//       name: "Customer 1",
//       email: "customer1@naturex.test",
//       password: "Customer1234!",
//       orgId: "org-customer-001",
//       createdAt: new Date().toISOString(),
//     },
//   ]
//   localStorage.setItem(KEYS.users, JSON.stringify(seedUsers))
// }
//
// // Get all users
// export function getUsers(): User[] {
//   const data = localStorage.getItem(KEYS.users)
//   return data ? JSON.parse(data) : []
// }
//
// // Get all orgs
// export function getOrgs(): Org[] {
//   const data = localStorage.getItem(KEYS.orgs)
//   return data ? JSON.parse(data) : []
// }
//
// // Create new org
// export function createOrg(name: string): Org {
//   const orgs = getOrgs()
//   const newOrg: Org = {
//     id: `org-customer-${String(orgs.length + 1).padStart(3, "0")}`,
//     name,
//     createdAt: new Date().toISOString(),
//   }
//   orgs.push(newOrg)
//   localStorage.setItem(KEYS.orgs, JSON.stringify(orgs))
//   return newOrg
// }
//
// // Create new customer user
// export function createCustomerUser(email: string, password: string, name: string, orgId: string): User {
//   const users = getUsers()
//   const newUser: User = {
//     id: `user-customer-${Date.now()}`,
//     role: "customer",
//     name,
//     email,
//     password,
//     orgId,
//     createdAt: new Date().toISOString(),
//   }
//   users.push(newUser)
//   localStorage.setItem(KEYS.users, JSON.stringify(users))
//   return newUser
// }
//
// // Authenticate user
// export function authenticateUser(email: string, password: string): User | null {
//   const users = getUsers()
//   return users.find((u) => u.email === email && u.password === password) || null
// }
//
// // Set auth session
// export function setAuthSession(user: User): void {
//   const session: AuthSession = {
//     userId: user.id,
//     role: user.role,
//     orgId: user.orgId,
//     name: user.name,
//     email: user.email,
//   }
//   localStorage.setItem(KEYS.auth, JSON.stringify(session))
// }
//
// // Get auth session
// export function getAuthSession(): AuthSession | null {
//   const data = localStorage.getItem(KEYS.auth)
//   return data ? JSON.parse(data) : null
// }
//
// // Clear auth session
// export function clearAuthSession(): void {
//   localStorage.removeItem(KEYS.auth)
// }
//
// // Update user
// export function updateUser(userId: string, updates: Partial<User>): void {
//   const users = getUsers()
//   const index = users.findIndex((u) => u.id === userId)
//   if (index >= 0) {
//     users[index] = { ...users[index], ...updates }
//     localStorage.setItem(KEYS.users, JSON.stringify(users))
//   }
// }
//
// // Delete user
// export function deleteUser(userId: string): void {
//   const users = getUsers().filter((u) => u.id !== userId)
//   localStorage.setItem(KEYS.users, JSON.stringify(users))
// }
