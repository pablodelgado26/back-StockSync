import StockMovementModel from "../models/stockMovementModel.js";
import ProductModel from "../models/productModel.js";

class StockMovementController {
    // Listar todas as movimentações com filtros
    async index(req, res) {
        try {
            const { tipo, dataInicio, dataFim, produtoId } = req.query;

            const filters = {};
            if (tipo) filters.tipo = tipo;
            if (dataInicio) filters.dataInicio = dataInicio;
            if (dataFim) filters.dataFim = dataFim;
            if (produtoId) filters.produtoId = produtoId;

            const movements = await StockMovementModel.findAll(filters);
            res.json(movements);
        } catch (error) {
            console.error("Erro ao listar movimentações:", error);
            res.status(500).json({ error: "Erro ao listar movimentações" });
        }
    }

    // Obter uma movimentação pelo ID
    async show(req, res) {
        try {
            const { id } = req.params;
            const movement = await StockMovementModel.findById(id);

            if (!movement) {
                return res.status(404).json({ error: "Movimentação não encontrada" });
            }

            res.json(movement);
        } catch (error) {
            console.error("Erro ao buscar movimentação:", error);
            res.status(500).json({ error: "Erro ao buscar movimentação" });
        }
    }

    // Registrar uma nova movimentação (entrada ou saída)
    async store(req, res) {
        try {
            const { tipo, quantidade, produtoId, data } = req.body;

            // Validação básica
            if (!tipo || !quantidade || !produtoId) {
                return res.status(400).json({ 
                    error: "Os campos tipo, quantidade e produtoId são obrigatórios" 
                });
            }

            // Validar tipo
            if (tipo !== 'entrada' && tipo !== 'saida') {
                return res.status(400).json({ 
                    error: "O tipo deve ser 'entrada' ou 'saida'" 
                });
            }

            // Validar quantidade
            if (quantidade <= 0) {
                return res.status(400).json({ 
                    error: "A quantidade deve ser maior que zero" 
                });
            }

            // Verificar se o produto existe
            const productExists = await ProductModel.findById(produtoId);
            if (!productExists) {
                return res.status(404).json({ error: "Produto não encontrado" });
            }

            // Se for saída, verificar se há estoque suficiente
            if (tipo === 'saida') {
                const estoqueAtual = await ProductModel.getStockQuantity(produtoId);
                if (estoqueAtual < quantidade) {
                    return res.status(400).json({ 
                        error: `Estoque insuficiente. Estoque atual: ${estoqueAtual}` 
                    });
                }
            }

            // Criar a movimentação
            const movementData = { 
                tipo, 
                quantidade: Number(quantidade),
                produtoId: Number(produtoId),
                data: data ? new Date(data) : new Date()
            };
            const movement = await StockMovementModel.create(movementData);

            // Obter estoque atualizado
            const estoqueAtual = await ProductModel.getStockQuantity(produtoId);

            return res.status(201).json({
                message: "Movimentação registrada com sucesso!",
                movement,
                estoqueAtual
            });
        } catch (error) {
            console.error("Erro ao registrar movimentação:", error);
            res.status(500).json({ error: "Erro ao registrar movimentação" });
        }
    }

    // Excluir uma movimentação (somente admin - opcional)
    async destroy(req, res) {
        try {
            const { id } = req.params;

            // Verificar se a movimentação existe
            const movementExists = await StockMovementModel.findById(id);
            if (!movementExists) {
                return res.status(404).json({ error: "Movimentação não encontrada" });
            }

            await StockMovementModel.delete(id);

            return res.json({ message: "Movimentação excluída com sucesso!" });
        } catch (error) {
            console.error("Erro ao excluir movimentação:", error);
            res.status(500).json({ error: "Erro ao excluir movimentação" });
        }
    }
}

export default new StockMovementController();
