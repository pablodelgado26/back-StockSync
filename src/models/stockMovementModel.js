import prisma from '../../prisma/prisma.js';

class StockMovementModel {
    // Obter todas as movimentações
    async findAll(filters = {}) {
        const where = {};

        // Filtro por tipo
        if (filters.tipo) {
            where.tipo = filters.tipo;
        }

        // Filtro por data
        if (filters.dataInicio || filters.dataFim) {
            where.data = {};
            if (filters.dataInicio) {
                where.data.gte = new Date(filters.dataInicio);
            }
            if (filters.dataFim) {
                where.data.lte = new Date(filters.dataFim);
            }
        }

        // Filtro por produto
        if (filters.produtoId) {
            where.produtoId = Number(filters.produtoId);
        }

        const movements = await prisma.stockMovement.findMany({
            where,
            include: {
                produto: {
                    include: {
                        fornecedor: true
                    }
                }
            },
            orderBy: {
                data: 'desc'
            }
        });

        return movements;
    }

    // Obter uma movimentação pelo ID
    async findById(id) {
        const movement = await prisma.stockMovement.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                produto: {
                    include: {
                        fornecedor: true
                    }
                }
            }
        });

        return movement;
    }

    // Obter movimentações de um produto
    async findByProductId(productId) {
        const movements = await prisma.stockMovement.findMany({
            where: {
                produtoId: Number(productId)
            },
            include: {
                produto: true
            },
            orderBy: {
                data: 'desc'
            }
        });

        return movements;
    }

    // Criar uma nova movimentação
    async create(data) {
        const movement = await prisma.stockMovement.create({
            data,
            include: {
                produto: {
                    include: {
                        fornecedor: true
                    }
                }
            }
        });

        return movement;
    }

    // Excluir uma movimentação
    async delete(id) {
        await prisma.stockMovement.delete({
            where: {
                id: Number(id)
            }
        });

        return true;
    }
}

export default new StockMovementModel();
