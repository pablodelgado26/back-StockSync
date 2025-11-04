import prisma from '../../prisma/prisma.js';

class SupplierModel {
    // Obter todos os fornecedores
    async findAll() {
        const suppliers = await prisma.supplier.findMany({
            include: {
                products: true
            }
        });

        return suppliers;
    }

    // Obter um fornecedor pelo ID
    async findById(id) {
        const supplier = await prisma.supplier.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                products: true
            }
        });

        return supplier;
    }

    // Obter um fornecedor pelo CNPJ
    async findByCnpj(cnpj) {
        const supplier = await prisma.supplier.findUnique({
            where: {
                cnpj,
            },
        });

        return supplier;
    }

    // Criar um novo fornecedor
    async create(data) {
        const supplier = await prisma.supplier.create({
            data,
        });

        return supplier;
    }

    // Atualizar um fornecedor
    async update(id, data) {
        const supplier = await prisma.supplier.update({
            where: {
                id: Number(id)
            },
            data
        });

        return supplier;
    }

    // Excluir um fornecedor
    async delete(id) {
        await prisma.supplier.delete({
            where: {
                id: Number(id)
            }
        });

        return true;
    }
}

export default new SupplierModel();
