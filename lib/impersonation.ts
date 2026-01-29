// // Admin impersonation utilities for customer preview
//
// export interface ImpersonationSession {
//   isImpersonating: boolean
//   originalAdminSession: {
//     userId: string
//     role: "admin"
//     orgId?: string
//   }
//   impersonatedOrgId: string
//   impersonatedUserId: string
//   startedAt: string
// }
//
// const IMPERSONATION_KEY = "naturex_impersonation"
//
// export function startImpersonation(orgId: string, userId: string): void {
//   const adminSession = localStorage.getItem("naturex_auth_session")
//   if (!adminSession) {
//     throw new Error("No admin session found")
//   }
//
//   const session: ImpersonationSession = {
//     isImpersonating: true,
//     originalAdminSession: JSON.parse(adminSession),
//     impersonatedOrgId: orgId,
//     impersonatedUserId: userId,
//     startedAt: new Date().toISOString(),
//   }
//
//   localStorage.setItem(IMPERSONATION_KEY, JSON.stringify(session))
//
//   // Temporarily switch auth context to customer
//   const customerSession = {
//     userId: userId,
//     role: "customer" as const,
//     orgId: orgId,
//   }
//   localStorage.setItem("naturex_auth_session", JSON.stringify(customerSession))
// }
//
// export function endImpersonation(): void {
//   const impersonationData = getImpersonationSession()
//   if (!impersonationData) return
//
//   // Restore original admin session
//   localStorage.setItem("naturex_auth_session", JSON.stringify(impersonationData.originalAdminSession))
//
//   // Clear impersonation state
//   localStorage.removeItem(IMPERSONATION_KEY)
// }
//
// export function getImpersonationSession(): ImpersonationSession | null {
//   const data = localStorage.getItem(IMPERSONATION_KEY)
//   return data ? JSON.parse(data) : null
// }
//
// export function isCurrentlyImpersonating(): boolean {
//   return getImpersonationSession() !== null
// }
