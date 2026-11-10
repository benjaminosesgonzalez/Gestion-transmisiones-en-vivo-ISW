-- CreateEnum
CREATE TYPE "DistribucionEstado" AS ENUM ('PENDIENTE', 'APROBADO', 'LIQUIDADO', 'RETENIDO');

-- CreateEnum
CREATE TYPE "EquipoEstado" AS ENUM ('DISPONIBLE', 'DANADO', 'PERDIDO', 'EN_USO');

-- CreateEnum
CREATE TYPE "EventoEstado" AS ENUM ('BORRADOR', 'PROGRAMADO', 'FINALIZADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('TRANSFERENCIA', 'EFECTIVO', 'TARJETA');

-- CreateEnum
CREATE TYPE "OperadorEstado" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "PagoEstado" AS ENUM ('PENDIENTE', 'PAGADO', 'RECHAZADO');

-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('JEFE', 'JEFE_TECNICO', 'CONTADOR');

-- CreateEnum
CREATE TYPE "TipoPago" AS ENUM ('ANTICIPO', 'SALDO_TOTAL', 'ABONO');

-- CreateTable
CREATE TABLE "asignacion" (
    "id" SERIAL NOT NULL,
    "evento_id" INTEGER NOT NULL,
    "operador_id" INTEGER NOT NULL,
    "hora_inicio" TIME(6) NOT NULL,
    "hora_fin" TIME(6) NOT NULL,
    "observacion" VARCHAR(255),

    CONSTRAINT "asignacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asignacion_funcion" (
    "asignacion_id" INTEGER NOT NULL,
    "funcion_id" INTEGER NOT NULL,

    CONSTRAINT "asignacion_funcion_pkey" PRIMARY KEY ("asignacion_id","funcion_id")
);

-- CreateTable
CREATE TABLE "ausencia" (
    "id" SERIAL NOT NULL,
    "operador_id" INTEGER NOT NULL,
    "fecha_inicio" DATE NOT NULL,
    "fecha_fin" DATE NOT NULL,
    "motivo" VARCHAR(255),

    CONSTRAINT "ausencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auspicio" (
    "id" SERIAL NOT NULL,
    "evento_id" INTEGER NOT NULL,
    "empresa_auspiciadora_id" INTEGER NOT NULL,
    "monto" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "auspicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cliente" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "telefono" VARCHAR(20),
    "rut" VARCHAR(12),
    "razon_social" VARCHAR(150),
    "direccion" VARCHAR(255),

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "distribucion_pago" (
    "id" SERIAL NOT NULL,
    "evento_id" INTEGER NOT NULL,
    "operador_id" INTEGER NOT NULL,
    "perdida_id" INTEGER,
    "monto" DECIMAL(12,2) NOT NULL,
    "porcentaje" DECIMAL(5,2),
    "fecha_distribucion" DATE NOT NULL,
    "estado" "DistribucionEstado" NOT NULL DEFAULT 'PENDIENTE',

    CONSTRAINT "distribucion_pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empresa_auspiciadora" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "contacto" VARCHAR(100),

    CONSTRAINT "empresa_auspiciadora_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipo" (
    "id" SERIAL NOT NULL,
    "tipo_id" INTEGER NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "estado" "EquipoEstado" NOT NULL DEFAULT 'DISPONIBLE',
    "valor_reposicion" DECIMAL(10,2),

    CONSTRAINT "equipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evento" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "tipo" VARCHAR(80),
    "fecha" DATE NOT NULL,
    "hora_inicio" TIME(6) NOT NULL,
    "hora_fin" TIME(6) NOT NULL,
    "zona" VARCHAR(100) NOT NULL,
    "valor_total" DECIMAL(12,2) NOT NULL,
    "porcentaje_utilidad" DECIMAL(5,2) NOT NULL,
    "es_rentable" BOOLEAN,
    "estado" "EventoEstado" NOT NULL DEFAULT 'PROGRAMADO',
    "notas" TEXT,

    CONSTRAINT "evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evento_equipo" (
    "evento_id" INTEGER NOT NULL,
    "equipo_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "evento_equipo_pkey" PRIMARY KEY ("evento_id","equipo_id")
);

-- CreateTable
CREATE TABLE "evento_kit" (
    "evento_id" INTEGER NOT NULL,
    "kit_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "evento_kit_pkey" PRIMARY KEY ("evento_id","kit_id")
);

-- CreateTable
CREATE TABLE "funcion" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "funcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gasto" (
    "id" SERIAL NOT NULL,
    "evento_id" INTEGER NOT NULL,
    "descripcion" VARCHAR(255) NOT NULL,
    "monto" DECIMAL(12,2) NOT NULL,
    "fecha" DATE NOT NULL,

    CONSTRAINT "gasto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kit" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "kit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kit_equipo" (
    "kit_id" INTEGER NOT NULL,
    "equipo_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "kit_equipo_pkey" PRIMARY KEY ("kit_id","equipo_id")
);

-- CreateTable
CREATE TABLE "operador" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(120) NOT NULL,
    "rut" VARCHAR(12),
    "telefono" VARCHAR(20),
    "email" VARCHAR(100),
    "estado" "OperadorEstado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "operador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operador_funcion" (
    "operador_id" INTEGER NOT NULL,
    "funcion_id" INTEGER NOT NULL,

    CONSTRAINT "operador_funcion_pkey" PRIMARY KEY ("operador_id","funcion_id")
);

-- CreateTable
CREATE TABLE "pago" (
    "id" SERIAL NOT NULL,
    "evento_id" INTEGER NOT NULL,
    "monto_total" DECIMAL(12,2) NOT NULL,
    "tipo_pago" "TipoPago" NOT NULL,
    "estado_pago" "PagoEstado" NOT NULL DEFAULT 'PENDIENTE',
    "fecha_esperada" DATE NOT NULL,

    CONSTRAINT "pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pago_abono" (
    "id" SERIAL NOT NULL,
    "pago_id" INTEGER NOT NULL,
    "monto" DECIMAL(12,2) NOT NULL,
    "fecha_pago" DATE NOT NULL,
    "metodo_pago" "MetodoPago" NOT NULL,

    CONSTRAINT "pago_abono_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perdida" (
    "id" SERIAL NOT NULL,
    "evento_id" INTEGER NOT NULL,
    "equipo_id" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "monto" DECIMAL(12,2) NOT NULL,
    "fecha" DATE NOT NULL,

    CONSTRAINT "perdida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipo_equipo" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "tipo_equipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(120) NOT NULL,
    "email" VARCHAR(160) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "rol" "Rol" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "funcion_nombre_key" ON "funcion"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "kit_nombre_key" ON "kit"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "operador_rut_key" ON "operador"("rut");

-- CreateIndex
CREATE UNIQUE INDEX "operador_email_key" ON "operador"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tipo_equipo_nombre_key" ON "tipo_equipo"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- AddForeignKey
ALTER TABLE "asignacion" ADD CONSTRAINT "asignacion_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignacion" ADD CONSTRAINT "asignacion_operador_id_fkey" FOREIGN KEY ("operador_id") REFERENCES "operador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignacion_funcion" ADD CONSTRAINT "asignacion_funcion_asignacion_id_fkey" FOREIGN KEY ("asignacion_id") REFERENCES "asignacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignacion_funcion" ADD CONSTRAINT "asignacion_funcion_funcion_id_fkey" FOREIGN KEY ("funcion_id") REFERENCES "funcion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ausencia" ADD CONSTRAINT "ausencia_operador_id_fkey" FOREIGN KEY ("operador_id") REFERENCES "operador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auspicio" ADD CONSTRAINT "auspicio_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auspicio" ADD CONSTRAINT "auspicio_empresa_auspiciadora_id_fkey" FOREIGN KEY ("empresa_auspiciadora_id") REFERENCES "empresa_auspiciadora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distribucion_pago" ADD CONSTRAINT "distribucion_pago_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distribucion_pago" ADD CONSTRAINT "distribucion_pago_operador_id_fkey" FOREIGN KEY ("operador_id") REFERENCES "operador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distribucion_pago" ADD CONSTRAINT "distribucion_pago_perdida_id_fkey" FOREIGN KEY ("perdida_id") REFERENCES "perdida"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipo" ADD CONSTRAINT "equipo_tipo_id_fkey" FOREIGN KEY ("tipo_id") REFERENCES "tipo_equipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento" ADD CONSTRAINT "evento_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento_equipo" ADD CONSTRAINT "evento_equipo_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento_equipo" ADD CONSTRAINT "evento_equipo_equipo_id_fkey" FOREIGN KEY ("equipo_id") REFERENCES "equipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento_kit" ADD CONSTRAINT "evento_kit_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento_kit" ADD CONSTRAINT "evento_kit_kit_id_fkey" FOREIGN KEY ("kit_id") REFERENCES "kit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gasto" ADD CONSTRAINT "gasto_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kit_equipo" ADD CONSTRAINT "kit_equipo_kit_id_fkey" FOREIGN KEY ("kit_id") REFERENCES "kit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kit_equipo" ADD CONSTRAINT "kit_equipo_equipo_id_fkey" FOREIGN KEY ("equipo_id") REFERENCES "equipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operador_funcion" ADD CONSTRAINT "operador_funcion_operador_id_fkey" FOREIGN KEY ("operador_id") REFERENCES "operador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operador_funcion" ADD CONSTRAINT "operador_funcion_funcion_id_fkey" FOREIGN KEY ("funcion_id") REFERENCES "funcion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pago" ADD CONSTRAINT "pago_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pago_abono" ADD CONSTRAINT "pago_abono_pago_id_fkey" FOREIGN KEY ("pago_id") REFERENCES "pago"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perdida" ADD CONSTRAINT "perdida_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perdida" ADD CONSTRAINT "perdida_equipo_id_fkey" FOREIGN KEY ("equipo_id") REFERENCES "equipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
