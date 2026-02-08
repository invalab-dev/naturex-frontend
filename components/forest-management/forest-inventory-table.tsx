import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const inventoryData = [
  {
    species: "Pinus densiflora",
    common: "소나무",
    count: 487,
    avgHeight: "19.2 m",
    avgDbh: "35.1 cm",
    health: "Excellent",
  },
  {
    species: "Quercus acutissima",
    common: "상수리나무",
    count: 312,
    avgHeight: "16.8 m",
    avgDbh: "28.3 cm",
    health: "Good",
  },
  {
    species: "Pinus koraiensis",
    common: "잣나무",
    count: 248,
    avgHeight: "21.5 m",
    avgDbh: "42.7 cm",
    health: "Excellent",
  },
  {
    species: "Larix kaempferi",
    common: "일본잎갈나무",
    count: 156,
    avgHeight: "18.9 m",
    avgDbh: "31.2 cm",
    health: "Good",
  },
  {
    species: "Abies holophylla",
    common: "전나무",
    count: 44,
    avgHeight: "17.3 m",
    avgDbh: "26.8 cm",
    health: "Fair",
  },
];

export function ForestInventoryTable() {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Species</TableHead>
            <TableHead>Common Name</TableHead>
            <TableHead className="text-right">Count</TableHead>
            <TableHead className="text-right">Avg Height</TableHead>
            <TableHead className="text-right">Avg DBH</TableHead>
            <TableHead>Health</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventoryData.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium text-xs">
                {item.species}
              </TableCell>
              <TableCell className="text-xs">{item.common}</TableCell>
              <TableCell className="text-right font-mono text-xs">
                {item.count}
              </TableCell>
              <TableCell className="text-right font-mono text-xs">
                {item.avgHeight}
              </TableCell>
              <TableCell className="text-right font-mono text-xs">
                {item.avgDbh}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    item.health === "Excellent"
                      ? "default"
                      : item.health === "Good"
                        ? "secondary"
                        : "outline"
                  }
                  className="text-xs"
                >
                  {item.health}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
