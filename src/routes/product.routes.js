import express from "express";
import ProductController from "../controllers/productController.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// Rotas de produtos (leitura para todos autenticados)
router.get("/", ProductController.index);          // GET /products - Listar todos
router.get("/:id", ProductController.show);        // GET /products/:id - Obter por ID

// Rotas restritas a admin
router.post("/", adminMiddleware, ProductController.store);         // POST /products - Criar (admin)
router.put("/:id", adminMiddleware, ProductController.update);      // PUT /products/:id - Atualizar (admin)
router.delete("/:id", adminMiddleware, ProductController.destroy);  // DELETE /products/:id - Excluir (admin)

export default router;
