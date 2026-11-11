export const DataTable = ({ columns, data, emptyMessage = 'No hay registros disponibles.' }) => {
  return (
    <div className="w-full overflow-x-auto bg-slate-900 border border-slate-800 rounded-xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-950/50">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="py-3.5 px-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/70 text-xs text-slate-300">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={row.id || rowIdx}
                className="hover:bg-slate-800/40 transition-colors"
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
