// New localStorage-based auth database for MVP
import { UserRole } from "@/lib/data-service";

export interface User {
  id: string;
  roles: UserRole[];
  name: string;
  email: string;
  password: string; // MVP plain; later Supabase handles securely
  orgId: string | null; // customer must have orgId, admin can be null
  createdAt: string;
}

export interface Org {
  id: string;
  name: string;
  createdAt: string;
}

export interface AuthSession {
  userId: string;
  roles: UserRole[];
  orgId: string | null;
  name: string;
  email: string;
}

const KEYS = {
  users: "naturex_users",
  orgs: "naturex_orgs",
  auth: "naturex_auth",
};

// Get all orgs
export function getOrgs(): Org[] {
  const data = localStorage.getItem(KEYS.orgs);
  return data ? JSON.parse(data) : [];
}

// Create new org
export function createOrg(name: string): Org {
  const orgs = getOrgs();
  const newOrg: Org = {
    id: `org-customer-${String(orgs.length + 1).padStart(3, "0")}`,
    name,
    createdAt: new Date().toISOString(),
  };
  orgs.push(newOrg);
  localStorage.setItem(KEYS.orgs, JSON.stringify(orgs));
  return newOrg;
}

// Get auth session
export function getAuthSession(): AuthSession | null {
  const data = localStorage.getItem(KEYS.auth);
  return data ? JSON.parse(data) : null;
}
