import express from "express";
import DashboardController from "../controllers/dashboardController.js";

const router = express.Router();

// Rota do dashboard
router.get("/", DashboardController.index);  // GET /dashboard - Obter resumo e alertas

export default router;
