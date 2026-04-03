import { flexRender } from "@tanstack/react-table";
import BlankMessage from "./BlankMessage";
import TableLoader from "./TableLoader";

const TanstackTableBody = ({
  table,
  data,
  loading,
  isError,
  error,
  columns,
}) => {
  if (loading) return <TableLoader table={table} />;
  if (isError)
    return (
      <tr className="border-b hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
        <td colSpan={columns.length}>
          <BlankMessage message={error} isError={isError} />
        </td>
      </tr>
    );
  if (!loading && data.length === 0)
    return (
      <tr>
        <td
          colSpan={columns.length}
          className="whitespace-nowrap p-2 text-center sm:p-3"
        >
          No posts found!
        </td>
      </tr>
    );

  return table.getRowModel().rows.map((row) => (
    <tr
      key={row.id}
      data-state={row.getIsSelected() && "selected"}
      className="border-b hover:bg-slate-50/50 dark:hover:bg-slate-700/50"
    >
      {row.getVisibleCells().map((cell, index) => (
        <td
          key={cell.id}
          className={`${
            index === 0
              ? "sticky left-0 bg-white dark:bg-slate-800 p-2 sm:p-3 border-r whitespace-nowrap"
              : "p-2 sm:p-3 whitespace-nowrap"
          }`}
          style={{
            left: index === 0 ? 0 : undefined,
            zIndex: index === 0 ? 20 : "auto",
          }}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  ));
};

export default TanstackTableBody;
