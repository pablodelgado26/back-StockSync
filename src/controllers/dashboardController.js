import ProductModel from "../models/productModel.js";
import StockMovementModel from "../models/stockMovementModel.js";
import SupplierModel from "../models/supplierModel.js";

class DashboardController {
    // Obter resumo do dashboard com alertas de estoque
    async index(req, res) {
        try {
            // Obter todas as contagens
            const allProducts = await ProductModel.findAll();
            const allSuppliers = await SupplierModel.findAll();
            const allMovements = await StockMovementModel.findAll({});
            
            // Contar total de produtos
            const totalProdutos = allProducts.length;
            const totalFornecedores = allSuppliers.length;
            const totalMovimentacoes = allMovements.length;
            
            // Contar entradas e saídas
            const totalEntradas = allMovements.filter(m => m.tipo === 'entrada').length;
            const totalSaidas = allMovements.filter(m => m.tipo === 'saida').length;

            // Obter produtos com estoque baixo para alertas
            const alertas = [];
            for (const product of allProducts) {
                const estoqueAtual = await ProductModel.getStockQuantity(product.id);
                if (estoqueAtual < product.estoqueMinimo) {
                    alertas.push({
                        id: product.id,
                        nome: product.nome,
                        sku: product.sku,
                        estoqueAtual,
                        estoqueMinimo: product.estoqueMinimo
                    });
                }
            }

            // Montar resposta do dashboard
            const dashboard = {
                resumo: {
                    totalProdutos,
                    totalFornecedores,
                    totalMovimentacoes,
                    totalEntradas,
                    totalSaidas
                },
                alertas
            };

            res.json(dashboard);
        } catch (error) {
            console.error("Erro ao obter dashboard:", error);
            res.status(500).json({ error: "Erro ao obter dashboard" });
        }
    }
}

export default new DashboardController();
