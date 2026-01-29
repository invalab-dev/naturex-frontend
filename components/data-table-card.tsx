import type React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

interface TableRow {
  [key: string]: string | number | React.ReactNode;
}

interface DataTableCardProps {
  title: string;
  description?: string;
  columns: {
    key: string;
    label: string;
    className?: string;
  }[];
  data: TableRow[];
}

export function DataTableCard({
  title,
  description,
  columns,
  data,
}: DataTableCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="text-left py-3 px-4 text-sm font-medium text-muted-foreground"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`py-3 px-4 text-sm ${column.className || ''}`}
                    >
                      {row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
