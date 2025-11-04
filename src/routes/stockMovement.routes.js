import express from "express";
import StockMovementController from "../controllers/stockMovementController.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// Rotas de movimentações de estoque
router.get("/", StockMovementController.index);          // GET /stockmovements - Listar com filtros
router.get("/:id", StockMovementController.show);        // GET /stockmovements/:id - Obter por ID
router.post("/", StockMovementController.store);         // POST /stockmovements - Registrar entrada/saída (estoquista)

// Rota restrita a admin
router.delete("/:id", adminMiddleware, StockMovementController.destroy);  // DELETE /stockmovements/:id - Excluir (admin)

export default router;
