import { ArrowDownUp, ChevronDown, ChevronUp } from "lucide-react";
import { flexRender } from "@tanstack/react-table";

const TanstackTableHeader = ({ table }) => {
  return (
    <>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id} className="border-b">
          {headerGroup.headers.map((header, index) => (
            <th
              key={header.id}
              className={`${
                index === 0
                  ? "sticky left-0 top-0 bg-slate-50 dark:bg-slate-700 p-2 sm:p-3 text-left font-medium border-r whitespace-nowrap"
                  : "sticky top-0 bg-slate-50 dark:bg-slate-700 p-2 sm:p-3 text-left font-medium whitespace-nowrap"
              }`}
              style={{
                top: 0,
                left: index === 0 ? 0 : undefined,
                zIndex: index === 0 ? 50 : 40,
              }}
            >
              {header.isPlaceholder ? null : header.column.getCanSort() ? (
                <button
                  type="button"
                  onClick={header.column.getToggleSortingHandler()}
                  className={`inline-flex items-center gap-1 transition hover:text-slate-900 dark:hover:text-slate-100 ${
                    index === 0 ? "justify-start text-left" : ""
                  }`}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() === "asc" ? (
                    <ChevronUp className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                  ) : header.column.getIsSorted() === "desc" ? (
                    <ChevronDown className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <ArrowDownUp className="h-3 w-3 text-slate-300 dark:text-slate-500" />
                  )}
                </button>
              ) : (
                flexRender(header.column.columnDef.header, header.getContext())
              )}
            </th>
          ))}
        </tr>
      ))}
    </>
  );
};

export default TanstackTableHeader;
