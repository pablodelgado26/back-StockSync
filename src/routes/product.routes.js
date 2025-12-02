import express from "express";
import ProductController from "../controllers/productController.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { productValidation } from "../validators/index.js";
import validate from "../middleware/validationMiddleware.js";
import { createLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

// Rotas de produtos (leitura para todos autenticados)
router.get("/", ProductController.index);                    // GET /products - Listar todos
router.get("/barcode/:barcode", ProductController.showByBarcode); // GET /products/barcode/:barcode - Buscar por barcode
router.get("/:id", ProductController.show);                  // GET /products/:id - Obter por ID

// Rotas restritas a admin (com validação)
router.post(
    "/", 
    adminMiddleware,
    createLimiter,
    productValidation.create,
    validate,
    ProductController.store
);

router.put(
    "/:id", 
    adminMiddleware,
    productValidation.update,
    validate,
    ProductController.update
);

router.delete("/:id", adminMiddleware, ProductController.destroy);

export default router;
