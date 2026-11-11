export const StatCard = ({ titulo, valor, subtitulo, icon, accent = 'indigo' }) => {
  const accents = {
    indigo: 'text-[#5b73e8] bg-[#5b73e8]/10 border-[#5b73e8]/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  };

  return (
    <div className="bg-[#1c1c1e] border border-[#2e2e32] rounded-lg p-5 flex items-start justify-between hover:border-neutral-700 transition-colors">
      <div className="space-y-1.5">
        <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
          {titulo}
        </p>
        <p className="text-2xl font-extrabold text-white tracking-tight">
          {valor}
        </p>
        {subtitulo && (
          <p className="text-[11px] text-neutral-500">
            {subtitulo}
          </p>
        )}
      </div>

      {icon && (
        <div className={`p-2.5 rounded-md border ${accents[accent] || accents.indigo}`}>
          {icon}
        </div>
      )}
    </div>
  );
};
