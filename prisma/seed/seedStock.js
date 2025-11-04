import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Arrays para gerar dados variados
const categorias = ['Eletrônicos', 'Informática', 'Periféricos', 'Cabos e Acessórios', 'Componentes'];
const marcas = ['TechPro', 'GameMax', 'ProGear', 'UltraPlus', 'MegaTech', 'PowerCore', 'SmartDevice', 'NextGen'];
const tiposProdutos = {
    'Eletrônicos': ['Mouse', 'Teclado', 'Monitor', 'Webcam', 'Headset', 'Speaker', 'Microfone'],
    'Informática': ['HD Externo', 'SSD', 'Memória RAM', 'Processador', 'Placa de Vídeo', 'Notebook', 'Desktop'],
    'Periféricos': ['Mouse Pad', 'Suporte Monitor', 'Hub USB', 'Dock Station', 'Mesa Digitalizadora'],
    'Cabos e Acessórios': ['Cabo HDMI', 'Cabo USB', 'Cabo DisplayPort', 'Adaptador', 'Carregador', 'Fonte'],
    'Componentes': ['Cooler', 'Ventoinha', 'Pasta Térmica', 'Gabinete', 'Placa Mãe', 'HD Interno']
};

const estados = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'PE', 'CE'];
const dddsPorEstado = {
    'SP': ['11', '12', '13', '14', '15', '16', '17', '18', '19'],
    'RJ': ['21', '22', '24'],
    'MG': ['31', '32', '33', '34', '35', '37', '38'],
    'RS': ['51', '53', '54', '55'],
    'PR': ['41', '42', '43', '44', '45', '46'],
    'SC': ['47', '48', '49'],
    'BA': ['71', '73', '74', '75', '77'],
    'PE': ['81', '87'],
    'CE': ['85', '88']
};

// Funções auxiliares
function gerarCNPJ() {
    const num = Math.floor(Math.random() * 100000000);
    const seq = Math.floor(Math.random() * 10000);
    return `${num.toString().padStart(8, '0')}/0001-${seq.toString().padStart(2, '0')}`;
}

function gerarTelefone(estado) {
    const ddds = dddsPorEstado[estado] || ['11'];
    const ddd = ddds[Math.floor(Math.random() * ddds.length)];
    const numero = Math.floor(90000000 + Math.random() * 10000000);
    return `(${ddd}) 9${numero}`;
}

function gerarSKU(categoria, index) {
    const prefixo = categoria.substring(0, 3).toUpperCase();
    return `${prefixo}-${(index + 1).toString().padStart(4, '0')}`;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function gerarDataAleatoria(diasAtras) {
    const data = new Date();
    data.setDate(data.getDate() - Math.floor(Math.random() * diasAtras));
    return data;
}

async function main() {
    console.log('🌱 Iniciando seed completo do banco de dados...\n');

    // Limpar dados existentes
    console.log('🗑️  Limpando dados existentes...');
    await prisma.stockMovement.deleteMany();
    await prisma.product.deleteMany();
    await prisma.supplier.deleteMany();
    await prisma.user.deleteMany();
    console.log('✅ Dados limpos!\n');

    // ========================================
    // CRIAR USUÁRIOS (5 usuários)
    // ========================================
    console.log('👥 Criando usuários...');
    const hashedPassword = await bcrypt.hash('123456', 10);

    const usuarios = [
        { name: 'Admin Geral', email: 'admin@stocksync.com', role: 'admin' },
        { name: 'João Silva', email: 'joao.admin@stocksync.com', role: 'admin' },
        { name: 'Maria Santos', email: 'maria.estoquista@stocksync.com', role: 'estoquista' },
        { name: 'Pedro Costa', email: 'pedro.estoquista@stocksync.com', role: 'estoquista' },
        { name: 'Ana Oliveira', email: 'ana.estoquista@stocksync.com', role: 'estoquista' }
    ];

    for (const userData of usuarios) {
        await prisma.user.create({
            data: {
                ...userData,
                password: hashedPassword
            }
        });
    }
    console.log(`✅ ${usuarios.length} usuários criados!\n`);

    // ========================================
    // CRIAR FORNECEDORES (20 fornecedores)
    // ========================================
    console.log('🏭 Criando fornecedores...');
    const nomesFornecedores = [
        'Tech Distribuidora', 'Eletrônicos Silva', 'Mega Suprimentos', 'InfoTech Atacado',
        'Digital Store', 'Componentes Brasil', 'TechWorld', 'Eletro Master',
        'Periféricos Plus', 'Gamer Store', 'Office Supplies', 'Network Solutions',
        'Hardware Store', 'Cable Tech', 'Power Systems', 'Smart Devices',
        'Pro Tech', 'Ultra Components', 'Next Tech', 'Future Electronics'
    ];

    const fornecedores = [];
    for (let i = 0; i < 20; i++) {
        const estado = getRandomElement(estados);
        const fornecedor = await prisma.supplier.create({
            data: {
                nome: nomesFornecedores[i],
                contato: gerarTelefone(estado),
                cnpj: gerarCNPJ()
            }
        });
        fornecedores.push(fornecedor);
    }
    console.log(`✅ ${fornecedores.length} fornecedores criados!\n`);

    // ========================================
    // CRIAR PRODUTOS (100 produtos)
    // ========================================
    console.log('📦 Criando produtos...');
    const produtos = [];
    let produtoIndex = 0;

    for (const categoria of categorias) {
        const tiposProduto = tiposProdutos[categoria];
        const produtosPorTipo = Math.ceil(100 / categorias.length / tiposProduto.length);

        for (const tipo of tiposProduto) {
            for (let j = 0; j < produtosPorTipo && produtoIndex < 100; j++) {
                const marca = getRandomElement(marcas);
                const modelo = `${marca} ${tipo}`;
                const variacao = j > 0 ? ` v${j + 1}` : '';
                
                const produto = await prisma.product.create({
                    data: {
                        sku: gerarSKU(categoria, produtoIndex),
                        nome: `${modelo}${variacao}`,
                        estoqueMinimo: getRandomInt(5, 30),
                        fornecedorId: getRandomElement(fornecedores).id
                    }
                });
                produtos.push(produto);
                produtoIndex++;
            }
        }
    }
    console.log(`✅ ${produtos.length} produtos criados!\n`);

    // ========================================
    // CRIAR MOVIMENTAÇÕES (300+ movimentações)
    // ========================================
    console.log('📊 Criando movimentações de estoque...');
    let totalMovimentacoes = 0;

    // Para cada produto, criar várias movimentações
    for (const produto of produtos) {
        const numMovimentacoes = getRandomInt(3, 8);
        
        // Primeira movimentação sempre é uma entrada inicial
        await prisma.stockMovement.create({
            data: {
                tipo: 'entrada',
                quantidade: getRandomInt(30, 100),
                produtoId: produto.id,
                data: gerarDataAleatoria(90) // Últimos 90 dias
            }
        });
        totalMovimentacoes++;

        // Criar movimentações aleatórias
        for (let i = 1; i < numMovimentacoes; i++) {
            const tipo = Math.random() > 0.4 ? 'saida' : 'entrada';
            const quantidade = tipo === 'entrada' 
                ? getRandomInt(20, 80) 
                : getRandomInt(5, 40);

            await prisma.stockMovement.create({
                data: {
                    tipo,
                    quantidade,
                    produtoId: produto.id,
                    data: gerarDataAleatoria(60)
                }
            });
            totalMovimentacoes++;
        }
    }
    console.log(`✅ ${totalMovimentacoes} movimentações criadas!\n`);

    // ========================================
    // ESTATÍSTICAS FINAIS
    // ========================================
    console.log('📊 Estatísticas do Banco de Dados:');
    console.log('=====================================');
    
    const totalUsers = await prisma.user.count();
    const totalSuppliers = await prisma.supplier.count();
    const totalProducts = await prisma.product.count();
    const totalMovements = await prisma.stockMovement.count();
    const totalEntradas = await prisma.stockMovement.count({ where: { tipo: 'entrada' } });
    const totalSaidas = await prisma.stockMovement.count({ where: { tipo: 'saida' } });
    
    console.log(`👥 Usuários: ${totalUsers}`);
    console.log(`🏭 Fornecedores: ${totalSuppliers}`);
    console.log(`📦 Produtos: ${totalProducts}`);
    console.log(`📊 Movimentações: ${totalMovements}`);
    console.log(`   └─ Entradas: ${totalEntradas}`);
    console.log(`   └─ Saídas: ${totalSaidas}`);
    console.log(`\n✨ Total de Registros: ${totalUsers + totalSuppliers + totalProducts + totalMovements}`);
    
    console.log('\n🎉 Seed concluído com sucesso!\n');
    console.log('📝 Credenciais de acesso:');
    console.log('=====================================');
    console.log('Admin: admin@stocksync.com / 123456');
    console.log('Admin 2: joao.admin@stocksync.com / 123456');
    console.log('Estoquista 1: maria.estoquista@stocksync.com / 123456');
    console.log('Estoquista 2: pedro.estoquista@stocksync.com / 123456');
    console.log('Estoquista 3: ana.estoquista@stocksync.com / 123456');
    console.log('=====================================\n');
}

main()
    .catch((e) => {
        console.error('❌ Erro ao executar seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
