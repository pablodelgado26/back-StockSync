import express from "express";
import SupplierController from "../controllers/supplierController.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { supplierValidation } from "../validators/index.js";
import validate from "../middleware/validationMiddleware.js";
import { createLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

// Rotas de fornecedores (leitura para todos autenticados)
router.get("/", SupplierController.index);          // GET /suppliers - Listar todos
router.get("/:id", SupplierController.show);        // GET /suppliers/:id - Obter por ID

// Rotas restritas a admin (com validação)
router.post(
    "/", 
    adminMiddleware,
    createLimiter,
    supplierValidation.create,
    validate,
    SupplierController.store
);

router.put(
    "/:id", 
    adminMiddleware,
    supplierValidation.update,
    validate,
    SupplierController.update
);

router.delete("/:id", adminMiddleware, SupplierController.destroy);

export default router;
