export const StatCard = ({ titulo, valor, subtitulo, icon, accent = 'purple' }) => {
  const accents = {
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-start justify-between hover:border-slate-700 transition-colors">
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {titulo}
        </p>
        <p className="text-2xl font-bold text-white tracking-tight">
          {valor}
        </p>
        {subtitulo && (
          <p className="text-[11px] text-slate-500">
            {subtitulo}
          </p>
        )}
      </div>

      {icon && (
        <div className={`p-2.5 rounded-lg border ${accents[accent] || accents.purple}`}>
          {icon}
        </div>
      )}
    </div>
  );
};
