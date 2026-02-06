// Placeholder module.
// The original widget catalog feature is treated as removed/dead code for Milestone 1.
// Keeping this file prevents build failures from legacy imports.

export type WidgetCatalogItem = never;
export const categoryLabels: Record<string, string> = {};

export function getWidgetCatalog(): WidgetCatalogItem[] {
  return [];
}

export function getProjectOverrides(): any[] {
  return [];
}

export function saveProjectOverride(): void {
  // no-op
}

export function deleteProjectOverride(): void {
  // no-op
}
