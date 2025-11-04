import ProductModel from "../models/productModel.js";
import StockMovementModel from "../models/stockMovementModel.js";

class DashboardController {
    // Obter resumo do dashboard com alertas de estoque
    async index(req, res) {
        try {
            // Obter produtos com estoque baixo
            const lowStockProducts = await ProductModel.getLowStockProducts();

            // Obter todas os produtos para estatísticas
            const allProducts = await ProductModel.findAll();
            
            // Calcular estoque total e produtos com estoque crítico
            let totalProducts = allProducts.length;
            let productsWithStock = 0;
            let productsOutOfStock = 0;

            for (const product of allProducts) {
                const estoqueAtual = await ProductModel.getStockQuantity(product.id);
                if (estoqueAtual > 0) {
                    productsWithStock++;
                }
                if (estoqueAtual === 0) {
                    productsOutOfStock++;
                }
            }

            // Obter movimentações recentes (últimos 7 dias)
            const dataInicio = new Date();
            dataInicio.setDate(dataInicio.getDate() - 7);
            
            const recentMovements = await StockMovementModel.findAll({
                dataInicio: dataInicio.toISOString()
            });

            // Calcular total de entradas e saídas dos últimos 7 dias
            let totalEntradas = 0;
            let totalSaidas = 0;

            recentMovements.forEach(movement => {
                if (movement.tipo === 'entrada') {
                    totalEntradas += movement.quantidade;
                } else if (movement.tipo === 'saida') {
                    totalSaidas += movement.quantidade;
                }
            });

            // Montar resposta do dashboard
            const dashboard = {
                alertas: {
                    produtosComEstoqueBaixo: lowStockProducts.length,
                    produtos: lowStockProducts
                },
                estatisticas: {
                    totalProdutos,
                    produtosComEstoque: productsWithStock,
                    produtosSemEstoque: productsOutOfStock,
                    produtosEstoqueBaixo: lowStockProducts.length
                },
                movimentacoesRecentes: {
                    periodo: "Últimos 7 dias",
                    totalEntradas,
                    totalSaidas,
                    saldo: totalEntradas - totalSaidas,
                    movimentacoes: recentMovements.slice(0, 10) // Últimas 10 movimentações
                }
            };

            res.json(dashboard);
        } catch (error) {
            console.error("Erro ao obter dashboard:", error);
            res.status(500).json({ error: "Erro ao obter dashboard" });
        }
    }
}

export default new DashboardController();
