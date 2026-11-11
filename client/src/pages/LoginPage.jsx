import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { loginSchema } from '../utils/schemas/auth.schema.js';
import { Boton } from '../components/ui/Boton.jsx';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const usuario = await login(data.email, data.password);

      const rutasDestino = {
        JEFE: '/jefe/dashboard',
        JEFE_TECNICO: '/tecnico/inventario',
        CONTADOR: '/contador/finanzas',
      };

      navigate(rutasDestino[usuario.rol] || '/jefe/dashboard');
    } catch (error) {
      const mensaje =
        error.response?.data?.message || 'Error al conectar con el servidor. Verifica tus credenciales.';
      setServerError(mensaje);
    }
  };

  return (
    <div className="min-h-screen bg-[#18181a] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1c1c1e] border border-[#2e2e32] rounded-xl p-8 shadow-2xl space-y-6">
        {/* Cabecera */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-lg bg-[#252528] border border-[#2e2e32] flex items-center justify-center text-[#5b73e8]">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <h1 className="text-base font-bold tracking-wide text-neutral-300">
            GESTIÓN DE TRANSMISIONES EN VIVO
          </h1>
        </div>

        {/* Alerta de error del Backend */}
        {serverError && (
          <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center">
            {serverError}
          </div>
        )}

        {/* Formulario controlado por React Hook Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="jefe@productora.com"
              {...register('email')}
              className="w-full px-3.5 py-2.5 rounded-md bg-[#18181a] border border-[#2e2e32] text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-[#5b73e8] transition-colors"
            />
            {errors.email && (
              <p className="text-[11px] text-rose-400">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className="w-full px-3.5 py-2.5 rounded-md bg-[#18181a] border border-[#2e2e32] text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-[#5b73e8] transition-colors"
            />
            {errors.password && (
              <p className="text-[11px] text-rose-400">{errors.password.message}</p>
            )}
          </div>

          <Boton
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 mt-2"
          >
            {isSubmitting ? 'Verificando acceso...' : 'Iniciar Sesión'}
          </Boton>
        </form>
      </div>
    </div>
  );
};
