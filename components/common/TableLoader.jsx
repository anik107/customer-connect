import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

const TableLoader = ({ table, rowCount = 10 }) => {
  const columnCount = table.getAllColumns().length;

  return Array.from({ length: rowCount }).map((_, rowIndex) => (
    <TableRow key={rowIndex}>
      {Array.from({ length: columnCount }).map((_, colIndex) => (
        <TableCell key={colIndex}>
          <Skeleton className="h-[20px] w-full rounded-full" />
        </TableCell>
      ))}
    </TableRow>
  ));
};

export default TableLoader;
