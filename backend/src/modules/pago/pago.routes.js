import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { pagoController } from './pago.controller.js';
import { verificarAuth } from '../../middlewares/auth.middleware.js';
import { requiereRol } from '../../middlewares/role.middleware.js';
import { validar } from '../../middlewares/validate.middleware.js';
import { registrarAbonoSchema } from './pago.schema.js';

// Asegurar que exista la carpeta física de destino
const uploadDir = 'uploads/comprobantes';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `comprobante-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Máximo 5MB como indica tu interfaz
  fileFilter: (_req, file, cb) => {
    const permitidos = ['application/pdf', 'image/jpeg', 'image/png'];
    if (permitidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF, JPG o PNG.'));
    }
  },
});

const router = Router();
router.use(verificarAuth);

router.get('/', requiereRol('JEFE', 'CONTADOR'), pagoController.listar);
router.post(
  '/abonos',
  requiereRol('JEFE', 'CONTADOR'),
  upload.single('comprobante'),
  validar(registrarAbonoSchema),
  pagoController.registrarAbono
);

export default router;
