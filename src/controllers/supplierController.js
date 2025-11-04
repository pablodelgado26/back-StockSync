import SupplierModel from "../models/supplierModel.js";

class SupplierController {
    // Listar todos os fornecedores
    async index(req, res) {
        try {
            const suppliers = await SupplierModel.findAll();
            res.json(suppliers);
        } catch (error) {
            console.error("Erro ao listar fornecedores:", error);
            res.status(500).json({ error: "Erro ao listar fornecedores" });
        }
    }

    // Obter um fornecedor pelo ID
    async show(req, res) {
        try {
            const { id } = req.params;
            const supplier = await SupplierModel.findById(id);

            if (!supplier) {
                return res.status(404).json({ error: "Fornecedor não encontrado" });
            }

            res.json(supplier);
        } catch (error) {
            console.error("Erro ao buscar fornecedor:", error);
            res.status(500).json({ error: "Erro ao buscar fornecedor" });
        }
    }

    // Criar um novo fornecedor (somente admin)
    async store(req, res) {
        try {
            const { nome, contato, cnpj } = req.body;

            // Validação básica
            if (!nome || !contato || !cnpj) {
                return res.status(400).json({ 
                    error: "Os campos nome, contato e CNPJ são obrigatórios" 
                });
            }

            // Verificar se o CNPJ já existe
            const supplierExists = await SupplierModel.findByCnpj(cnpj);
            if (supplierExists) {
                return res.status(400).json({ error: "Este CNPJ já está cadastrado!" });
            }

            // Criar o fornecedor
            const data = { nome, contato, cnpj };
            const supplier = await SupplierModel.create(data);

            return res.status(201).json({
                message: "Fornecedor criado com sucesso!",
                supplier,
            });
        } catch (error) {
            console.error("Erro ao criar fornecedor:", error);
            res.status(500).json({ error: "Erro ao criar fornecedor" });
        }
    }

    // Atualizar um fornecedor (somente admin)
    async update(req, res) {
        try {
            const { id } = req.params;
            const { nome, contato, cnpj } = req.body;

            // Verificar se o fornecedor existe
            const supplierExists = await SupplierModel.findById(id);
            if (!supplierExists) {
                return res.status(404).json({ error: "Fornecedor não encontrado" });
            }

            // Se o CNPJ foi alterado, verificar se já não existe
            if (cnpj && cnpj !== supplierExists.cnpj) {
                const cnpjExists = await SupplierModel.findByCnpj(cnpj);
                if (cnpjExists) {
                    return res.status(400).json({ error: "Este CNPJ já está cadastrado!" });
                }
            }

            // Atualizar o fornecedor
            const data = {};
            if (nome) data.nome = nome;
            if (contato) data.contato = contato;
            if (cnpj) data.cnpj = cnpj;

            const supplier = await SupplierModel.update(id, data);

            return res.json({
                message: "Fornecedor atualizado com sucesso!",
                supplier,
            });
        } catch (error) {
            console.error("Erro ao atualizar fornecedor:", error);
            res.status(500).json({ error: "Erro ao atualizar fornecedor" });
        }
    }

    // Excluir um fornecedor (somente admin)
    async destroy(req, res) {
        try {
            const { id } = req.params;

            // Verificar se o fornecedor existe
            const supplierExists = await SupplierModel.findById(id);
            if (!supplierExists) {
                return res.status(404).json({ error: "Fornecedor não encontrado" });
            }

            await SupplierModel.delete(id);

            return res.json({ message: "Fornecedor excluído com sucesso!" });
        } catch (error) {
            console.error("Erro ao excluir fornecedor:", error);
            res.status(500).json({ error: "Erro ao excluir fornecedor" });
        }
    }
}

export default new SupplierController();
