'use client';

import { Badge } from '@/components/ui/badge';

const trees = [
  {
    id: 'TR-001',
    species: 'Ginkgo',
    height: 12.5,
    crownWidth: 8.2,
    risk: 'Low',
  },
  {
    id: 'TR-002',
    species: 'Cherry',
    height: 9.8,
    crownWidth: 6.5,
    risk: 'Medium',
  },
  {
    id: 'TR-003',
    species: 'Pine',
    height: 15.2,
    crownWidth: 9.8,
    risk: 'High',
  },
  {
    id: 'TR-004',
    species: 'Maple',
    height: 11.3,
    crownWidth: 7.5,
    risk: 'Low',
  },
  {
    id: 'TR-005',
    species: 'Oak',
    height: 13.7,
    crownWidth: 8.9,
    risk: 'Medium',
  },
  {
    id: 'TR-006',
    species: 'Birch',
    height: 10.2,
    crownWidth: 6.8,
    risk: 'Low',
  },
  {
    id: 'TR-007',
    species: 'Willow',
    height: 14.5,
    crownWidth: 10.2,
    risk: 'High',
  },
  {
    id: 'TR-008',
    species: 'Ash',
    height: 12.1,
    crownWidth: 7.9,
    risk: 'Medium',
  },
];

export function TreeTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 px-3 font-medium text-muted-foreground">
              Tree ID
            </th>
            <th className="text-left py-2 px-3 font-medium text-muted-foreground">
              Species
            </th>
            <th className="text-right py-2 px-3 font-medium text-muted-foreground">
              Height (m)
            </th>
            <th className="text-right py-2 px-3 font-medium text-muted-foreground">
              Crown (m)
            </th>
            <th className="text-left py-2 px-3 font-medium text-muted-foreground">
              Risk
            </th>
          </tr>
        </thead>
        <tbody>
          {trees.map((tree) => (
            <tr
              key={tree.id}
              className="border-b border-border hover:bg-muted/50 transition-colors"
            >
              <td className="py-2 px-3 font-mono text-xs">{tree.id}</td>
              <td className="py-2 px-3">{tree.species}</td>
              <td className="py-2 px-3 text-right tabular-nums">
                {tree.height}
              </td>
              <td className="py-2 px-3 text-right tabular-nums">
                {tree.crownWidth}
              </td>
              <td className="py-2 px-3">
                <Badge
                  variant={
                    tree.risk === 'High'
                      ? 'destructive'
                      : tree.risk === 'Medium'
                        ? 'secondary'
                        : 'default'
                  }
                  className="text-xs"
                >
                  {tree.risk}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
