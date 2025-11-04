# 📦 StockSync - Sistema de Gerenciamento de Estoque

Sistema completo de gerenciamento de estoque com controle de produtos, fornecedores e movimentações.

## 🚀 Tecnologias

- Node.js + Express
- Prisma ORM
- SQLite
- JWT + Bcrypt

## 📋 DER (Modelo de Dados)

```
┌─────────────┐
│    User     │
├─────────────┤
│ id          │
│ name        │
│ email       │
│ password    │
│ role        │
└─────────────┘

┌─────────────┐           ┌─────────────┐
│  Supplier   │           │   Product   │
├─────────────┤           ├─────────────┤
│ id (PK)     │───────────│ id (PK)     │
│ nome        │   1:N     │ sku         │
│ contato     │           │ nome        │
│ cnpj        │           │estoqueMinimo│
└─────────────┘           │fornecedorId │
                          └─────────────┘
                                 │
                                 │ 1:N
                                 │
                          ┌──────▼──────┐
                          │StockMovement│
                          ├─────────────┤
                          │ id (PK)     │
                          │ tipo        │
                          │ quantidade  │
                          │ data        │
                          │ produtoId   │
                          └─────────────┘
```

## 🔧 Instalação

```bash
# Instalar dependências
npm install

# Configurar banco de dados
npx prisma migrate dev

# Popular com dados (698 registros: 5 users, 20 fornecedores, 100 produtos, 573 movimentações)
node prisma/seed/seedStock.js

# Iniciar servidor
npm run dev
```

## 🧪 Testes

O projeto inclui testes automatizados completos com Jest e Supertest.

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Gerar relatório de cobertura
npm run test:coverage
```

### Suítes de Testes Implementadas

✅ **Autenticação** (`auth.test.js`)
- Registro de usuários
- Login com validação de credenciais
- Validação de tokens JWT
- Controle de permissões

✅ **Fornecedores** (`suppliers.test.js`)
- CRUD completo
- Permissões (Admin vs Estoquista)
- Validação de dados

✅ **Produtos** (`products.test.js`)
- CRUD completo
- Validação de SKU único
- Relacionamento com fornecedores
- Permissões por role

✅ **Movimentações** (`stockmovements.test.js`)
- Registro de entradas/saídas
- Filtros por tipo, data e produto
- Validações de quantidade
- Cálculo de estoque

✅ **Dashboard** (`dashboard.test.js`)
- Estatísticas do sistema
- Alertas de estoque mínimo
- Validação de cálculos


## 🔐 Credenciais de Teste

| Tipo | Email | Senha |
|------|-------|-------|
| Admin | admin@stocksync.com | 123456 |
| Estoquista | maria.estoquista@stocksync.com | 123456 |

## 📚 Endpoints da API

### 📖 Documentação Postman

Importe a collection completa no Postman: **`postman/StockSync-API.postman_collection.json`**

A collection inclui:
- ✅ Todos os endpoints documentados
- ✅ Exemplos de requisição e resposta
- ✅ Variáveis de ambiente (baseUrl, authToken)
- ✅ Scripts automáticos para salvar token após login
- ✅ Descrições detalhadas de cada endpoint

### Autenticação
- `POST /auth/register` - Registrar usuário
- `POST /auth/login` - Login

### Fornecedores (Admin para POST/PUT/DELETE)
- `GET /suppliers` - Listar todos
- `GET /suppliers/:id` - Obter por ID
- `POST /suppliers` - Criar
- `PUT /suppliers/:id` - Atualizar
- `DELETE /suppliers/:id` - Excluir

### Produtos (Admin para POST/PUT/DELETE)
- `GET /products` - Listar todos
- `GET /products/:id` - Obter por ID
- `POST /products` - Criar
- `PUT /products/:id` - Atualizar
- `DELETE /products/:id` - Excluir

### Movimentações
- `GET /stockmovements` - Listar (com filtros: tipo, dataInicio, dataFim, produtoId)
- `GET /stockmovements/:id` - Obter por ID
- `POST /stockmovements` - Registrar entrada/saída
- `DELETE /stockmovements/:id` - Excluir (Admin)

### Dashboard
- `GET /dashboard` - Resumo de estoque e alertas

## 📝 Requisitos Funcionais Implementados

✅ Autenticação segura (admin e estoquista)  
✅ CRUD de produtos (admin)  
✅ CRUD de fornecedores (admin)  
✅ Registro de entradas/saídas (estoquista)  
✅ Cálculo automático de estoque  
✅ Dashboard com alertas de estoque mínimo  
✅ Relatórios com filtros por data e tipo  

## 🔒 Autenticação

Todas as rotas (exceto `/auth/login` e `/auth/register`) requerem token JWT:

```bash
Authorization: Bearer <seu_token>
```

### Permissões

| Ação | Admin | Estoquista |
|------|-------|------------|
| Visualizar | ✅ | ✅ |
| Criar Produto/Fornecedor | ✅ | ❌ |
| Editar Produto/Fornecedor | ✅ | ❌ |
| Excluir Produto/Fornecedor | ✅ | ❌ |
| Registrar Movimentação | ✅ | ✅ |
| Excluir Movimentação | ✅ | ❌ |

## 📊 Exemplo de Uso

```bash
# 1. Login
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@stocksync.com","password":"123456"}'

# Resposta: { "token": "eyJhbG...", "user": {...} }

# 2. Listar produtos
curl -X GET http://localhost:4000/products \
  -H "Authorization: Bearer SEU_TOKEN"

# 3. Registrar entrada
curl -X POST http://localhost:4000/stockmovements \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tipo":"entrada","quantidade":10,"produtoId":1}'

# 4. Ver dashboard
curl -X GET http://localhost:4000/dashboard \
  -H "Authorization: Bearer SEU_TOKEN"
```

## 📂 Estrutura do Projeto

```
back-StockSync/
├── __tests__/                 # Testes automatizados
│   ├── auth.test.js           # Testes de autenticação
│   ├── suppliers.test.js      # Testes de fornecedores
│   ├── products.test.js       # Testes de produtos
│   ├── stockmovements.test.js # Testes de movimentações
│   └── dashboard.test.js      # Testes de dashboard
├── postman/                   # Documentação da API
│   └── StockSync-API.postman_collection.json
├── prisma/
│   ├── schema.prisma          # Schema do banco
│   ├── migrations/            # Histórico de migrations
│   └── seed/
│       └── seedStock.js       # Seed com 698 registros
├── src/
│   ├── controllers/           # Lógica de negócio
│   │   ├── authController.js
│   │   ├── supplierController.js
│   │   ├── productController.js
│   │   ├── stockMovementController.js
│   │   └── dashboardController.js
│   ├── middleware/            # Autenticação e autorização
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   ├── models/                # Acesso ao banco
│   │   ├── userModel.js
│   │   ├── supplierModel.js
│   │   ├── productModel.js
│   │   └── stockMovementModel.js
│   ├── routes/                # Definição de endpoints
│   │   ├── index.routes.js
│   │   ├── auth.routes.js
│   │   ├── supplier.routes.js
│   │   ├── product.routes.js
│   │   ├── stockMovement.routes.js
│   │   └── dashboard.routes.js
│   └── server.js              # Servidor Express
├── .env                       # Variáveis de ambiente
├── jest.config.js             # Configuração do Jest
├── package.json
└── README.md
```

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
npm run dev                   # Inicia servidor com nodemon
npm start                     # Inicia servidor em produção

# Testes
npm test                      # Executa todos os testes
npm run test:watch            # Modo watch para desenvolvimento
npm run test:coverage         # Gera relatório de cobertura

# Prisma
npx prisma migrate dev        # Criar/aplicar migrations
npx prisma migrate reset      # Resetar banco
npx prisma studio             # Interface visual do banco
npx prisma generate           # Gerar Prisma Client

# Seed
node prisma/seed/seedStock.js # Popular banco (698 registros)
```

## 📊 Estatísticas do Banco

O seed popula o banco com:
- **5 usuários** (2 admins + 3 estoquistas)
- **20 fornecedores**
- **100 produtos** (5 categorias)
- **573 movimentações** (296 entradas + 277 saídas)
- **Total: 698 registros**

## 👥 Autores

- Alexandra Aversani
- Gabriela Moleta
- Pablo Delgado

## 📄 Licença

MIT
