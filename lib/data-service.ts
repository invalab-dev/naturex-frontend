import { apiFetch } from './api-client';
import { Organization, Project, ProjectStatus, User, UserRole } from './data-type';

// META
export type ProjectThemeMeta = {
  value: Project['theme'];
  label: string;
  description: string;
  examples: string;
};

export async function getProjectThemeMeta(): Promise<ProjectThemeMeta[]> {
  return apiFetch('/meta/project-themes');
}

// ADMIN STATS
export type AdminOverviewStats = {
  orgsCount: number;
  projectsCount: number;
  byTheme: Record<string, number>;
  byStatus: Record<string, number>;
};

export async function getAdminOverviewStats(): Promise<AdminOverviewStats> {
  return apiFetch('/admin/stats/overview');
}

// AUTH
export async function getMe(): Promise<User> {
  return apiFetch('/auth/me');
}

// ORGS
export async function getOrganizations(): Promise<Organization[]> {
  return apiFetch('/organizations');
}

export async function getOrganizationById(id: string): Promise<Organization> {
  return apiFetch(`/organizations/${id}`);
}

export async function createOrganization(input: {
  name: string;
  type: Organization['type'];
  size: Organization['size'];
  website?: string | null;
  status?: Organization['status'] | null;
}): Promise<Organization> {
  return apiFetch('/organizations', { method: 'POST', json: input });
}

export async function updateOrganization(input: {
  id: string;
  name?: string | null;
  type?: Organization['type'] | null;
  size?: Organization['size'] | null;
  website?: string | null;
  status?: Organization['status'] | null;
}): Promise<Organization> {
  return apiFetch('/organizations', { method: 'PATCH', json: input });
}

export async function deleteOrganization(id: string): Promise<void> {
  return apiFetch('/organizations', { method: 'DELETE', json: { id } });
}

// PROJECTS
export async function getProjectsByOrganization(organizationId: string): Promise<Project[]> {
  return apiFetch(`/projects/organization/${organizationId}`);
}

export async function getProjectById(id: string): Promise<Project> {
  return apiFetch(`/projects/${id}`);
}

export async function getProjectStatusLogs(id: string): Promise<any[]> {
  return apiFetch(`/projects/${id}/status-logs`);
}

export async function createProject(input: {
  name: string;
  description?: string | null;
  location?: string | null;
  theme: Project['theme'];
  organizationId?: string | null;
  managerId?: string | null;
  status: ProjectStatus;
  changedBy: string;
  statusDescription?: string | null;
}): Promise<Project> {
  return apiFetch('/projects', {
    method: 'POST',
    json: {
      name: input.name,
      description: input.description,
      location: input.location,
      theme: input.theme,
      organizationId: input.organizationId,
      managerId: input.managerId,
      status: input.status,
      changedBy: input.changedBy,
      // backend expects description for status log; keep separate if needed
      // we'll pass statusDescription if provided
      ...(input.statusDescription ? { statusDescription: input.statusDescription } : {}),
    },
  });
}

export async function updateProject(input: {
  id: string;
  name?: string | null;
  description?: string | null;
  location?: string | null;
  organizationId?: string | null;
  managerId?: string | null;
  status?: ProjectStatus;
  changedBy?: string;
  statusDescription?: string | null;
}): Promise<Project> {
  return apiFetch('/projects', { method: 'PATCH', json: input });
}

export async function deleteProject(id: string): Promise<void> {
  return apiFetch('/projects', { method: 'DELETE', json: { id } });
}

// USERS
export async function getUsers(): Promise<User[]> {
  return apiFetch('/users');
}

export async function createUser(input: {
  email: string;
  password: string;
  roles?: UserRole[] | null;
  name?: string | null;
  phoneNumber?: string | null;
  bio?: string | null;
  organizationId?: string | null;
  language?: string | null;
  timezone?: string | null;
}): Promise<User> {
  return apiFetch('/users', { method: 'POST', json: input });
}

export async function deleteUser(id: string): Promise<void> {
  return apiFetch(`/users/${id}`, { method: 'DELETE' });
}
