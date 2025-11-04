import prisma from '../../prisma/prisma.js';

class ProductModel {
    // Obter todos os produtos
    async findAll() {
        const products = await prisma.product.findMany({
            include: {
                fornecedor: true,
                stockMovements: true
            }
        });

        return products;
    }

    // Obter um produto pelo ID
    async findById(id) {
        const product = await prisma.product.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                fornecedor: true,
                stockMovements: true
            }
        });

        return product;
    }

    // Obter um produto pelo SKU
    async findBySku(sku) {
        const product = await prisma.product.findUnique({
            where: {
                sku,
            },
            include: {
                fornecedor: true,
                stockMovements: true
            }
        });

        return product;
    }

    // Criar um novo produto
    async create(data) {
        const product = await prisma.product.create({
            data,
            include: {
                fornecedor: true
            }
        });

        return product;
    }

    // Atualizar um produto
    async update(id, data) {
        const product = await prisma.product.update({
            where: {
                id: Number(id)
            },
            data,
            include: {
                fornecedor: true
            }
        });

        return product;
    }

    // Excluir um produto
    async delete(id) {
        await prisma.product.delete({
            where: {
                id: Number(id)
            }
        });

        return true;
    }

    // Calcular estoque atual de um produto
    async getStockQuantity(productId) {
        const movements = await prisma.stockMovement.findMany({
            where: {
                produtoId: Number(productId)
            }
        });

        let total = 0;
        movements.forEach(movement => {
            if (movement.tipo === 'entrada') {
                total += movement.quantidade;
            } else if (movement.tipo === 'saida') {
                total -= movement.quantidade;
            }
        });

        return total;
    }

    // Obter produtos com estoque baixo
    async getLowStockProducts() {
        const products = await this.findAll();
        const lowStockProducts = [];

        for (const product of products) {
            const currentStock = await this.getStockQuantity(product.id);
            if (currentStock < product.estoqueMinimo) {
                lowStockProducts.push({
                    ...product,
                    estoqueAtual: currentStock
                });
            }
        }

        return lowStockProducts;
    }
}

export default new ProductModel();
