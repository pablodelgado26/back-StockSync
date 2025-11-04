import express from "express";
import SupplierController from "../controllers/supplierController.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// Rotas de fornecedores (leitura para todos autenticados)
router.get("/", SupplierController.index);          // GET /suppliers - Listar todos
router.get("/:id", SupplierController.show);        // GET /suppliers/:id - Obter por ID

// Rotas restritas a admin
router.post("/", adminMiddleware, SupplierController.store);         // POST /suppliers - Criar (admin)
router.put("/:id", adminMiddleware, SupplierController.update);      // PUT /suppliers/:id - Atualizar (admin)
router.delete("/:id", adminMiddleware, SupplierController.destroy);  // DELETE /suppliers/:id - Excluir (admin)

export default router;
