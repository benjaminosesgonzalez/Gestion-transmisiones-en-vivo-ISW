export const DataTable = ({ columns, data, emptyMessage = 'No hay registros disponibles.' }) => {
  return (
    <div className="w-full overflow-x-auto bg-[#1c1c1e] border border-[#2e2e32] rounded-lg">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#2e2e32] bg-[#18181a]/60">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-neutral-400"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2e2e32] text-xs text-neutral-300">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-neutral-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={row.id || rowIdx}
                className="hover:bg-[#252528]/60 transition-colors"
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="py-3.5 px-4 whitespace-nowrap">
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
