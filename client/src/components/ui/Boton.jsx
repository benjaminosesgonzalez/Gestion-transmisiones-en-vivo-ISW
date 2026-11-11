export const Boton = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  icon = null,
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-xs font-semibold tracking-wider uppercase transition-all duration-150 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-[#5b73e8] hover:bg-[#4c63d2] text-white border border-[#788ef5]/30',
    danger:
      'bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30',
    secondary:
      'bg-[#252528] hover:bg-[#2e2e32] text-neutral-200 border border-[#3a3a3f]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
    >
      {icon && <span className="w-4 h-4 flex items-center justify-center">{icon}</span>}
      {children}
    </button>
  );
};
