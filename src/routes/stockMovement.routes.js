import express from "express";
import StockMovementController from "../controllers/stockMovementController.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { stockMovementValidation } from "../validators/index.js";
import validate from "../middleware/validationMiddleware.js";
import { createLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

// Rotas de movimentações de estoque
router.get("/", StockMovementController.index);          // GET /stockmovements - Listar com filtros
router.get("/:id", StockMovementController.show);        // GET /stockmovements/:id - Obter por ID

// POST - Registrar movimentação (com validação e rate limit)
router.post(
    "/",
    createLimiter,
    stockMovementValidation.create,
    validate,
    StockMovementController.store
);

// DELETE - Rota restrita a admin
router.delete("/:id", adminMiddleware, StockMovementController.destroy);

export default router;
