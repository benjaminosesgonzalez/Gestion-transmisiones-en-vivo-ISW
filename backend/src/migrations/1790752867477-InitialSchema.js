/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export class InitialSchema1790752867477 {
    name = 'InitialSchema1790752867477'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "asignacion" ("id" SERIAL NOT NULL, "hora_inicio" TIME NOT NULL, "hora_fin" TIME NOT NULL, "observacion" character varying(255), "evento_id" integer NOT NULL, "operador_id" integer NOT NULL, CONSTRAINT "PK_ffb1cb0124bf91ae194ef53cb78" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "asignacion_funcion" ("asignacion_id" integer NOT NULL, "funcion_id" integer NOT NULL, CONSTRAINT "PK_ebe34bf49a0769547578c6d2847" PRIMARY KEY ("asignacion_id", "funcion_id"))`);
        await queryRunner.query(`CREATE TABLE "ausencia" ("id" SERIAL NOT NULL, "operador_id" integer NOT NULL, "fecha_inicio" date NOT NULL, "fecha_fin" date NOT NULL, "motivo" character varying(255), CONSTRAINT "PK_5190a881f9bc8a4b76c38fd1086" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auspicio" ("id" SERIAL NOT NULL, "evento_id" integer NOT NULL, "empresa_auspiciadora_id" integer NOT NULL, "monto" numeric(12,2) NOT NULL, CONSTRAINT "PK_3d056a59efc8e18d0be644974d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cliente" ("id" SERIAL NOT NULL, "nombre" character varying(150) NOT NULL, "telefono" character varying(20), "rut" character varying(12), "razon_social" character varying(150), "direccion" character varying(255), CONSTRAINT "PK_18990e8df6cf7fe71b9dc0f5f39" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."distribucion_pago_estado_enum" AS ENUM('PENDIENTE', 'APROBADO', 'LIQUIDADO', 'RETENIDO')`);
        await queryRunner.query(`CREATE TABLE "distribucion_pago" ("id" SERIAL NOT NULL, "evento_id" integer NOT NULL, "operador_id" integer NOT NULL, "perdida_id" integer, "monto" numeric(12,2) NOT NULL, "porcentaje" numeric(5,2) NOT NULL, "fecha_distribucion" date NOT NULL, "estado" "public"."distribucion_pago_estado_enum" NOT NULL DEFAULT 'PENDIENTE', CONSTRAINT "PK_813bbe28154d837cb4fd3174074" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "empresa_auspiciadora" ("id" SERIAL NOT NULL, "nombre" character varying(150) NOT NULL, "contacto" character varying(100), CONSTRAINT "PK_62b04b798cf6bf43e4433a682e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."equipo_estado_enum" AS ENUM('OPERATIVO', 'EN_REPARACION', 'EXTRAVIADO', 'DE_BAJA')`);
        await queryRunner.query(`CREATE TABLE "equipo" ("id" SERIAL NOT NULL, "tipo_id" integer NOT NULL, "nombre" character varying(150) NOT NULL, "estado" "public"."equipo_estado_enum" NOT NULL DEFAULT 'OPERATIVO', "valor_reposicion" numeric(10,2), CONSTRAINT "PK_a545d29b4870688c462189447da" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."evento_estado_enum" AS ENUM('PROGRAMADO', 'FINALIZADO', 'CANCELADO')`);
        await queryRunner.query(`CREATE TABLE "evento" ("id" SERIAL NOT NULL, "cliente_id" integer NOT NULL, "tipo_id" integer NOT NULL, "nombre" character varying(150) NOT NULL, "fecha" date NOT NULL, "hora_inicio" TIME NOT NULL, "hora_fin" TIME NOT NULL, "zona" character varying(100) NOT NULL, "valor_total" numeric(12,2) NOT NULL, "porcentaje_utilidad" numeric(5,2) NOT NULL, "es_rentable" boolean, "estado" "public"."evento_estado_enum" NOT NULL DEFAULT 'PROGRAMADO', "notas" text, CONSTRAINT "PK_ceb2e9607555230aee6aff546b0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "evento_equipo" ("evento_id" integer NOT NULL, "equipo_id" integer NOT NULL, "cantidad" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_542eb1e1e671d40e23b2668b17b" PRIMARY KEY ("evento_id", "equipo_id"))`);
        await queryRunner.query(`CREATE TABLE "evento_kit" ("evento_id" integer NOT NULL, "kit_id" integer NOT NULL, "cantidad" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_d4391e9b69f1e43c42307bc4b6f" PRIMARY KEY ("evento_id", "kit_id"))`);
        await queryRunner.query(`CREATE TABLE "funcion" ("id" SERIAL NOT NULL, "nombre" character varying(100) NOT NULL, "descripcion" text, CONSTRAINT "PK_048102c1546244e94f6dab37f45" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "gasto" ("id" SERIAL NOT NULL, "evento_id" integer NOT NULL, "descripcion" character varying(255) NOT NULL, "monto" numeric(12,2) NOT NULL, "fecha" date NOT NULL, CONSTRAINT "PK_cf2336fd738eaca8aab31dcb07b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "kit" ("id" SERIAL NOT NULL, "nombre" character varying(150) NOT NULL, "descripcion" text, CONSTRAINT "PK_5dcdc8fbcdc84c412e7fafaac79" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "kit_equipo" ("kit_id" integer NOT NULL, "equipo_id" integer NOT NULL, "cantidad" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_13569f4a8f06623533edee32b51" PRIMARY KEY ("kit_id", "equipo_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."operador_estado_enum" AS ENUM('ACTIVO', 'INACTIVO')`);
        await queryRunner.query(`CREATE TABLE "operador" ("id" SERIAL NOT NULL, "nombre" character varying(120) NOT NULL, "rut" character varying(12), "telefono" character varying(20), "email" character varying(100), "estado" "public"."operador_estado_enum" NOT NULL DEFAULT 'ACTIVO', CONSTRAINT "PK_6cd1ed38785b46d815458885dfd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "operador_funcion" ("operador_id" integer NOT NULL, "funcion_id" integer NOT NULL, CONSTRAINT "PK_2d28d3d073d3151df389f6f34af" PRIMARY KEY ("operador_id", "funcion_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."pago_tipo_pago_enum" AS ENUM('ANTICIPO', 'SALDO_TOTAL', 'ABONO')`);
        await queryRunner.query(`CREATE TYPE "public"."pago_estado_pago_enum" AS ENUM('PENDIENTE', 'PAGADO', 'RECHAZADO')`);
        await queryRunner.query(`CREATE TABLE "pago" ("id" SERIAL NOT NULL, "evento_id" integer NOT NULL, "monto_total" numeric(12,2) NOT NULL, "tipo_pago" "public"."pago_tipo_pago_enum" NOT NULL, "estado_pago" "public"."pago_estado_pago_enum" NOT NULL DEFAULT 'PENDIENTE', "fecha_esperada" date NOT NULL, CONSTRAINT "PK_6be14be998d5e41f10e58c0e651" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."pago_abono_metodo_pago_enum" AS ENUM('TRANSFERENCIA', 'EFECTIVO', 'TARJETA')`);
        await queryRunner.query(`CREATE TABLE "pago_abono" ("id" SERIAL NOT NULL, "pago_id" integer NOT NULL, "monto" numeric(12,2) NOT NULL, "fecha_pago" date NOT NULL, "metodo_pago" "public"."pago_abono_metodo_pago_enum" NOT NULL, CONSTRAINT "PK_8b097c90591a39e72e21a7d7990" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "perdida" ("id" SERIAL NOT NULL, "evento_id" integer NOT NULL, "equipo_id" integer NOT NULL, "descripcion" text NOT NULL, "monto" numeric(12,2) NOT NULL, "fecha" date NOT NULL, CONSTRAINT "PK_7f18e90b84a4cafeaab1c8cfabd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tipo_equipo" ("id" SERIAL NOT NULL, "nombre" character varying(100) NOT NULL, CONSTRAINT "PK_398bd8d683dae62a56de4fca0f2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tipo_evento" ("id" SERIAL NOT NULL, "nombre" character varying(100) NOT NULL, CONSTRAINT "PK_45ff00a4d2887f64c9cbc52f865" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."usuario_rol_enum" AS ENUM('JEFE', 'JEFE_TECNICO', 'CONTADOR')`);
        await queryRunner.query(`CREATE TABLE "usuario" ("id" SERIAL NOT NULL, "nombre" character varying(120) NOT NULL, "email" character varying(160) NOT NULL, "password" character varying(100) NOT NULL, "rol" "public"."usuario_rol_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2863682842e688ca198eb25c124" UNIQUE ("email"), CONSTRAINT "PK_a56c58e5cabaa04fb2c98d2d7e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "asignacion" ADD CONSTRAINT "FK_eb5b9539010955dd511a9f252c2" FOREIGN KEY ("evento_id") REFERENCES "evento"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "asignacion" ADD CONSTRAINT "FK_e6617728428839ce625298cdc85" FOREIGN KEY ("operador_id") REFERENCES "operador"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "asignacion_funcion" ADD CONSTRAINT "FK_7d86f8448c4df2d8334fb98dfb5" FOREIGN KEY ("asignacion_id") REFERENCES "asignacion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "asignacion_funcion" ADD CONSTRAINT "FK_3ca0bfc8048f48ac4ad09791cd0" FOREIGN KEY ("funcion_id") REFERENCES "funcion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ausencia" ADD CONSTRAINT "FK_cd84dec879d5c09fa92b208c9ef" FOREIGN KEY ("operador_id") REFERENCES "operador"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "auspicio" ADD CONSTRAINT "FK_2f34ab84cfe4cb630947684f6b2" FOREIGN KEY ("evento_id") REFERENCES "evento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "auspicio" ADD CONSTRAINT "FK_e0d5726257442eb42c97085397b" FOREIGN KEY ("empresa_auspiciadora_id") REFERENCES "empresa_auspiciadora"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "distribucion_pago" ADD CONSTRAINT "FK_aafcf040dac6125638dab487497" FOREIGN KEY ("evento_id") REFERENCES "evento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "distribucion_pago" ADD CONSTRAINT "FK_e76a6d892678e59a175c18308fa" FOREIGN KEY ("operador_id") REFERENCES "operador"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "distribucion_pago" ADD CONSTRAINT "FK_5d5a405bb15b8464c6d6c968760" FOREIGN KEY ("perdida_id") REFERENCES "perdida"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "equipo" ADD CONSTRAINT "FK_d49c4c4fa3e829a201711ffe696" FOREIGN KEY ("tipo_id") REFERENCES "tipo_equipo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "evento" ADD CONSTRAINT "FK_14237899bcd62f52172078c0cc0" FOREIGN KEY ("cliente_id") REFERENCES "cliente"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "evento" ADD CONSTRAINT "FK_e02c55a4e8a1f6e4f266e03b198" FOREIGN KEY ("tipo_id") REFERENCES "tipo_evento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "evento_equipo" ADD CONSTRAINT "FK_bee0e4f71b41dcc0246743508ff" FOREIGN KEY ("evento_id") REFERENCES "evento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "evento_equipo" ADD CONSTRAINT "FK_6a79addedbbecac501a665d8efe" FOREIGN KEY ("equipo_id") REFERENCES "equipo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "evento_kit" ADD CONSTRAINT "FK_62f5ce70e99f9b4868acbae002f" FOREIGN KEY ("evento_id") REFERENCES "evento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "evento_kit" ADD CONSTRAINT "FK_fa00cb99a786c24ffa25f252717" FOREIGN KEY ("kit_id") REFERENCES "kit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "gasto" ADD CONSTRAINT "FK_c02967456678b7006b018d14e68" FOREIGN KEY ("evento_id") REFERENCES "evento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "kit_equipo" ADD CONSTRAINT "FK_d6b59d37437afa9bbe3c84b1aa2" FOREIGN KEY ("kit_id") REFERENCES "kit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "kit_equipo" ADD CONSTRAINT "FK_ca6b3e2cbfda543fe105cbc454b" FOREIGN KEY ("equipo_id") REFERENCES "equipo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "operador_funcion" ADD CONSTRAINT "FK_603e46dedde8150ef9837341990" FOREIGN KEY ("operador_id") REFERENCES "operador"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "operador_funcion" ADD CONSTRAINT "FK_4c9b3341b285b9d7cd23d2f22b3" FOREIGN KEY ("funcion_id") REFERENCES "funcion"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pago" ADD CONSTRAINT "FK_c0783889b782476779fac548048" FOREIGN KEY ("evento_id") REFERENCES "evento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pago_abono" ADD CONSTRAINT "FK_d97e285281e447db5ae11b187f7" FOREIGN KEY ("pago_id") REFERENCES "pago"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "perdida" ADD CONSTRAINT "FK_76f334a50909273b75ae081a6c1" FOREIGN KEY ("evento_id") REFERENCES "evento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "perdida" ADD CONSTRAINT "FK_1e2596ca320c1229f985d05e9b6" FOREIGN KEY ("equipo_id") REFERENCES "equipo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "perdida" DROP CONSTRAINT "FK_1e2596ca320c1229f985d05e9b6"`);
        await queryRunner.query(`ALTER TABLE "perdida" DROP CONSTRAINT "FK_76f334a50909273b75ae081a6c1"`);
        await queryRunner.query(`ALTER TABLE "pago_abono" DROP CONSTRAINT "FK_d97e285281e447db5ae11b187f7"`);
        await queryRunner.query(`ALTER TABLE "pago" DROP CONSTRAINT "FK_c0783889b782476779fac548048"`);
        await queryRunner.query(`ALTER TABLE "operador_funcion" DROP CONSTRAINT "FK_4c9b3341b285b9d7cd23d2f22b3"`);
        await queryRunner.query(`ALTER TABLE "operador_funcion" DROP CONSTRAINT "FK_603e46dedde8150ef9837341990"`);
        await queryRunner.query(`ALTER TABLE "kit_equipo" DROP CONSTRAINT "FK_ca6b3e2cbfda543fe105cbc454b"`);
        await queryRunner.query(`ALTER TABLE "kit_equipo" DROP CONSTRAINT "FK_d6b59d37437afa9bbe3c84b1aa2"`);
        await queryRunner.query(`ALTER TABLE "gasto" DROP CONSTRAINT "FK_c02967456678b7006b018d14e68"`);
        await queryRunner.query(`ALTER TABLE "evento_kit" DROP CONSTRAINT "FK_fa00cb99a786c24ffa25f252717"`);
        await queryRunner.query(`ALTER TABLE "evento_kit" DROP CONSTRAINT "FK_62f5ce70e99f9b4868acbae002f"`);
        await queryRunner.query(`ALTER TABLE "evento_equipo" DROP CONSTRAINT "FK_6a79addedbbecac501a665d8efe"`);
        await queryRunner.query(`ALTER TABLE "evento_equipo" DROP CONSTRAINT "FK_bee0e4f71b41dcc0246743508ff"`);
        await queryRunner.query(`ALTER TABLE "evento" DROP CONSTRAINT "FK_e02c55a4e8a1f6e4f266e03b198"`);
        await queryRunner.query(`ALTER TABLE "evento" DROP CONSTRAINT "FK_14237899bcd62f52172078c0cc0"`);
        await queryRunner.query(`ALTER TABLE "equipo" DROP CONSTRAINT "FK_d49c4c4fa3e829a201711ffe696"`);
        await queryRunner.query(`ALTER TABLE "distribucion_pago" DROP CONSTRAINT "FK_5d5a405bb15b8464c6d6c968760"`);
        await queryRunner.query(`ALTER TABLE "distribucion_pago" DROP CONSTRAINT "FK_e76a6d892678e59a175c18308fa"`);
        await queryRunner.query(`ALTER TABLE "distribucion_pago" DROP CONSTRAINT "FK_aafcf040dac6125638dab487497"`);
        await queryRunner.query(`ALTER TABLE "auspicio" DROP CONSTRAINT "FK_e0d5726257442eb42c97085397b"`);
        await queryRunner.query(`ALTER TABLE "auspicio" DROP CONSTRAINT "FK_2f34ab84cfe4cb630947684f6b2"`);
        await queryRunner.query(`ALTER TABLE "ausencia" DROP CONSTRAINT "FK_cd84dec879d5c09fa92b208c9ef"`);
        await queryRunner.query(`ALTER TABLE "asignacion_funcion" DROP CONSTRAINT "FK_3ca0bfc8048f48ac4ad09791cd0"`);
        await queryRunner.query(`ALTER TABLE "asignacion_funcion" DROP CONSTRAINT "FK_7d86f8448c4df2d8334fb98dfb5"`);
        await queryRunner.query(`ALTER TABLE "asignacion" DROP CONSTRAINT "FK_e6617728428839ce625298cdc85"`);
        await queryRunner.query(`ALTER TABLE "asignacion" DROP CONSTRAINT "FK_eb5b9539010955dd511a9f252c2"`);
        await queryRunner.query(`DROP TABLE "usuario"`);
        await queryRunner.query(`DROP TYPE "public"."usuario_rol_enum"`);
        await queryRunner.query(`DROP TABLE "tipo_evento"`);
        await queryRunner.query(`DROP TABLE "tipo_equipo"`);
        await queryRunner.query(`DROP TABLE "perdida"`);
        await queryRunner.query(`DROP TABLE "pago_abono"`);
        await queryRunner.query(`DROP TYPE "public"."pago_abono_metodo_pago_enum"`);
        await queryRunner.query(`DROP TABLE "pago"`);
        await queryRunner.query(`DROP TYPE "public"."pago_estado_pago_enum"`);
        await queryRunner.query(`DROP TYPE "public"."pago_tipo_pago_enum"`);
        await queryRunner.query(`DROP TABLE "operador_funcion"`);
        await queryRunner.query(`DROP TABLE "operador"`);
        await queryRunner.query(`DROP TYPE "public"."operador_estado_enum"`);
        await queryRunner.query(`DROP TABLE "kit_equipo"`);
        await queryRunner.query(`DROP TABLE "kit"`);
        await queryRunner.query(`DROP TABLE "gasto"`);
        await queryRunner.query(`DROP TABLE "funcion"`);
        await queryRunner.query(`DROP TABLE "evento_kit"`);
        await queryRunner.query(`DROP TABLE "evento_equipo"`);
        await queryRunner.query(`DROP TABLE "evento"`);
        await queryRunner.query(`DROP TYPE "public"."evento_estado_enum"`);
        await queryRunner.query(`DROP TABLE "equipo"`);
        await queryRunner.query(`DROP TYPE "public"."equipo_estado_enum"`);
        await queryRunner.query(`DROP TABLE "empresa_auspiciadora"`);
        await queryRunner.query(`DROP TABLE "distribucion_pago"`);
        await queryRunner.query(`DROP TYPE "public"."distribucion_pago_estado_enum"`);
        await queryRunner.query(`DROP TABLE "cliente"`);
        await queryRunner.query(`DROP TABLE "auspicio"`);
        await queryRunner.query(`DROP TABLE "ausencia"`);
        await queryRunner.query(`DROP TABLE "asignacion_funcion"`);
        await queryRunner.query(`DROP TABLE "asignacion"`);
    }
}
