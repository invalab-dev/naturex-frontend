'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const speciesData = [
  {
    species: 'Pinus densiflora',
    korean: '소나무',
    grade: 'I',
    habitat: 'Forest',
    area: '12.4 ha',
    count: 847,
  },
  {
    species: 'Quercus mongolica',
    korean: '신갈나무',
    grade: 'II',
    habitat: 'Forest',
    area: '8.7 ha',
    count: 623,
  },
  {
    species: 'Zelkova serrata',
    korean: '느티나무',
    grade: 'I',
    habitat: 'Forest',
    area: '5.2 ha',
    count: 234,
  },
  {
    species: 'Miscanthus sinensis',
    korean: '억새',
    grade: 'III',
    habitat: 'Grassland',
    area: '15.3 ha',
    count: 2840,
  },
  {
    species: 'Carex dimorpholepis',
    korean: '이삭사초',
    grade: 'II',
    habitat: 'Wetland',
    area: '6.8 ha',
    count: 1523,
  },
  {
    species: 'Salix koreensis',
    korean: '버드나무',
    grade: 'II',
    habitat: 'Wetland',
    area: '4.1 ha',
    count: 412,
  },
];

export function EIARawDataView() {
  return (
    <Card className="h-full">
      <CardContent className="p-0">
        <ScrollArea className="h-full">
          <div className="p-4">
            <table className="w-full">
              <thead className="sticky top-0 bg-background z-10">
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">
                    Species
                  </th>
                  <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">
                    Grade
                  </th>
                  <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">
                    Habitat
                  </th>
                  <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">
                    Area
                  </th>
                  <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">
                    Count
                  </th>
                </tr>
              </thead>
              <tbody>
                {speciesData.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-2 px-2">
                      <div className="text-xs font-medium">{item.species}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.korean}
                      </div>
                    </td>
                    <td className="py-2 px-2">
                      <Badge
                        variant={
                          item.grade === 'I'
                            ? 'destructive'
                            : item.grade === 'II'
                              ? 'default'
                              : 'secondary'
                        }
                        className="text-xs"
                      >
                        {item.grade}
                      </Badge>
                    </td>
                    <td className="py-2 px-2 text-xs">{item.habitat}</td>
                    <td className="py-2 px-2 text-xs text-right">
                      {item.area}
                    </td>
                    <td className="py-2 px-2 text-xs text-right font-medium">
                      {item.count.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
