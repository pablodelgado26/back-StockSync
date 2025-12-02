# 📘 Documentação Backend - StockSync

Sistema de gerenciamento de estoque com controle de produtos, fornecedores e movimentações.

---

## 📋 Índice

- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Instalação](#-instalação)
- [Banco de Dados](#-banco-de-dados)
- [Autenticação](#-autenticação)
- [API Endpoints](#-api-endpoints)
- [Middlewares](#-middlewares)
- [Testes](#-testes)

---

## 🛠 Tecnologias

- **Node.js** + **Express 5.1.0** - Framework web
- **Prisma 6.18.0** - ORM para banco de dados
- **SQLite** - Banco de dados (desenvolvimento)
- **JWT** - Autenticação e autorização
- **Jest + Supertest** - Testes automatizados
- **Bcrypt** - Criptografia de senhas

### Dependências Principais

```json
{
  "express": "^5.1.0",
  "@prisma/client": "^6.18.0",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^3.0.2",
  "express-validator": "^7.3.0",
  "helmet": "^8.1.0",
  "cors": "^2.8.5"
}
```

---

## 🏗 Arquitetura

### Estrutura MVC

```
src/
├── server.js              # Configuração do servidor
├── controllers/           # Lógica de negócio
│   ├── authController.js
│   ├── productController.js
│   ├── supplierController.js
│   └── ...
├── models/                # Acesso aos dados
│   ├── userModel.js
│   ├── productModel.js
│   └── ...
├── routes/                # Definição de rotas
│   ├── auth.routes.js
│   ├── product.routes.js
│   └── ...
└── middleware/            # Middlewares
    ├── authMiddleware.js
    ├── validationMiddleware.js
    └── ...
```

### Fluxo de Requisição

```
Cliente → Middleware (Auth/Validation) → Router → Controller → Model → Database
                                                       ↓
                                                   Response ← Controller
```

---

## 🚀 Instalação

```bash
# 1. Clonar repositório
git clone https://github.com/pablodelgado26/back-StockSync.git
cd back-StockSync

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# 4. Executar migrações do banco
npx prisma migrate dev

# 5. Popular banco de dados (694 registros)
npm run prisma:seed

# 6. Iniciar servidor
npm run dev  # Desenvolvimento
npm start    # Produção
```

### Variáveis de Ambiente (.env)

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="seu_secret_aqui"
PORT=4000
NODE_ENV="development"
```

---

## 💾 Banco de Dados

### Modelos (Prisma Schema)

#### User
```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String   # Bcrypt hash
  role      String   @default("estoquista") # admin | estoquista
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### Supplier
```prisma
model Supplier {
  id        Int       @id @default(autoincrement())
  nome      String
  contato   String
  cnpj      String    @unique
  products  Product[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

#### Product
```prisma
model Product {
  id             Int             @id @default(autoincrement())
  barcode        String          @unique # Código de barras EAN-13
  name           String
  description    String?
  price          Float
  stock          Int             @default(0)
  category       String
  estoqueMinimo  Int             @default(10)
  fornecedorId   Int
  fornecedor     Supplier        @relation(...)
  stockMovements StockMovement[]
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
}
```

#### StockMovement
```prisma
model StockMovement {
  id         Int      @id @default(autoincrement())
  tipo       String   # entrada | saida
  quantidade Int
  data       DateTime @default(now())
  produtoId  Int
  produto    Product  @relation(...)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

### Relacionamentos

- **Supplier** → **Product** (1:N) - CASCADE on delete
- **Product** → **StockMovement** (1:N) - CASCADE on delete

---

## 🔐 Autenticação

### Sistema JWT

```javascript
// Login retorna token
POST /auth/login
{
  "email": "admin@stocksync.com",
  "password": "123456"
}

// Resposta
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "name": "Admin", "role": "admin" }
}
```

### Uso do Token

```javascript
// Header obrigatório em rotas protegidas
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Roles (Papéis)

| Role | Permissões |
|------|------------|
| **admin** | CRUD completo em todos os recursos |
| **estoquista** | Leitura (GET) + Movimentações de estoque |

---

## 🌐 API Endpoints

### Base URL
```
http://localhost:4000
```

### Autenticação

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/auth/register` | Registrar usuário | ❌ |
| POST | `/auth/login` | Login | ❌ |
| GET | `/auth/users` | Listar usuários | ✅ |

### Fornecedores

| Método | Endpoint | Descrição | Permissão |
|--------|----------|-----------|-----------|
| GET | `/suppliers` | Listar todos | Admin/Estoquista |
| GET | `/suppliers/:id` | Buscar por ID | Admin/Estoquista |
| POST | `/suppliers` | Criar novo | Admin |
| PUT | `/suppliers/:id` | Atualizar | Admin |
| DELETE | `/suppliers/:id` | Excluir | Admin |

### Produtos

| Método | Endpoint | Descrição | Permissão |
|--------|----------|-----------|-----------|
| GET | `/products` | Listar todos | Admin/Estoquista |
| GET | `/products/:id` | Buscar por ID | Admin/Estoquista |
| GET | `/products/barcode/:barcode` | Buscar por código | Admin/Estoquista |
| POST | `/products` | Criar novo | Admin |
| PUT | `/products/:id` | Atualizar | Admin |
| DELETE | `/products/:id` | Excluir | Admin |

### Movimentações

| Método | Endpoint | Descrição | Permissão |
|--------|----------|-----------|-----------|
| GET | `/stockmovements` | Listar todas | Admin/Estoquista |
| GET | `/stockmovements/:id` | Buscar por ID | Admin/Estoquista |
| POST | `/stockmovements` | Registrar (entrada/saída) | Admin/Estoquista |
| DELETE | `/stockmovements/:id` | Excluir | Admin |

### Dashboard

| Método | Endpoint | Descrição | Permissão |
|--------|----------|-----------|-----------|
| GET | `/dashboard` | Estatísticas + Alertas | Admin/Estoquista |

### Health Check

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/health` | Status da API | ❌ |

---

## 📝 Exemplos de Requisições

### Criar Produto

```bash
POST /products
Authorization: Bearer {token}
Content-Type: application/json

{
  "barcode": "7891234567890",
  "name": "Mouse Gamer RGB",
  "description": "Mouse com 7 botões programáveis",
  "price": 159.90,
  "stock": 0,
  "category": "Periféricos",
  "estoqueMinimo": 10,
  "fornecedorId": 1
}
```

### Registrar Entrada de Estoque

```bash
POST /stockmovements
Authorization: Bearer {token}
Content-Type: application/json

{
  "tipo": "entrada",
  "quantidade": 50,
  "produtoId": 1
}

# O campo product.stock é atualizado automaticamente
```

### Dashboard

```bash
GET /dashboard
Authorization: Bearer {token}

# Resposta
{
  "resumo": {
    "totalProdutos": 100,
    "totalFornecedores": 20,
    "totalMovimentacoes": 569,
    "totalEntradas": 296,
    "totalSaidas": 273,
    "valorTotalEstoque": 45780.50
  },
  "alertas": [
    {
      "id": 25,
      "name": "Mouse Pad RGB",
      "estoqueAtual": 3,
      "estoqueMinimo": 10
    }
  ]
}
```

---

## 🛡 Middlewares

### 1. authMiddleware
Valida JWT e adiciona `req.user` com dados do usuário.

```javascript
// Uso
router.get('/products', authMiddleware, ProductController.index);
```

### 2. adminMiddleware
Verifica se o usuário tem role "admin".

```javascript
// Uso
router.post('/products', authMiddleware, adminMiddleware, ProductController.store);
```

### 3. validationMiddleware
Valida dados de entrada usando express-validator.

```javascript
import { body } from 'express-validator';

router.post('/products',
  body('barcode').notEmpty(),
  body('name').notEmpty(),
  body('price').isFloat({ min: 0 }),
  validationMiddleware,
  ProductController.store
);
```

### 4. rateLimitMiddleware
Limita requisições por IP (100 req/15min).

```javascript
// Aplicado globalmente no server.js
app.use(apiLimiter);
```

### 5. errorMiddleware
Trata erros e retorna respostas padronizadas.

```javascript
// 404 - Rota não encontrada
// 500 - Erro interno do servidor
```

---

## 🧪 Testes

### Executar Testes

```bash
# Todos os testes
npm test

# Watch mode
npm run test:watch

# Com coverage
npm run test:coverage
```

### Suítes de Teste

```
70 testes automatizados:
✅ Auth (13 testes)
✅ Suppliers (13 testes)
✅ Products (15 testes)
✅ StockMovements (20 testes)
✅ Dashboard (9 testes)
```

### Exemplo de Teste

```javascript
describe('POST /products', () => {
  it('Admin deve criar produto com sucesso', async () => {
    const response = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        barcode: '1234567890123',
        name: 'Produto Teste',
        price: 99.90,
        category: 'Teste',
        fornecedorId: 1
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});
```

---

## 🔄 Fluxos Principais

### Fluxo de Venda (Saída de Estoque)

1. Cliente escaneia código de barras
2. Frontend busca produto: `GET /products/barcode/:barcode`
3. Verifica estoque disponível
4. Registra saída: `POST /stockmovements { tipo: "saida", quantidade, produtoId }`
5. Sistema atualiza `product.stock` automaticamente

### Fluxo de Recebimento (Entrada de Estoque)

1. Recebe nota fiscal do fornecedor
2. Para cada produto:
   - Busca por barcode: `GET /products/barcode/:barcode`
   - Registra entrada: `POST /stockmovements { tipo: "entrada", quantidade, produtoId }`
3. Sistema atualiza estoques automaticamente

### Alertas de Estoque Baixo

- Dashboard monitora `product.stock < product.estoqueMinimo`
- Retorna lista de produtos que precisam reposição
- Frontend pode exibir notificações

---

## 📊 Estatísticas do Seed

Ao executar `npm run prisma:seed`, o sistema popula:

- **5 usuários** (2 admin, 3 estoquista)
- **20 fornecedores**
- **100 produtos** com códigos de barras EAN-13
- **569 movimentações** de estoque
- **Total: 694 registros**

### Credenciais de Teste

```javascript
// Admin
email: "admin@stocksync.com"
password: "123456"

// Estoquista
email: "estoquista@stocksync.com"
password: "123456"
```

---

## 🔒 Segurança

### Implementações

- ✅ **Helmet** - Headers de segurança HTTP
- ✅ **CORS** - Controle de origem cruzada
- ✅ **Rate Limiting** - Proteção contra DDoS
- ✅ **JWT** - Autenticação stateless
- ✅ **Bcrypt** - Hash de senhas (salt rounds: 10)
- ✅ **Express Validator** - Validação de entrada
- ✅ **SQL Injection** - Prevenido pelo Prisma ORM

### Boas Práticas

- Senhas nunca retornadas nas respostas
- Tokens expiram em 7 dias
- Validação de dados em todas as rotas
- Tratamento centralizado de erros

---

## 📈 Performance

- **Compression** - Gzip nas respostas
- **Prisma** - Queries otimizadas
- **Indexes** - Em campos únicos (email, cnpj, barcode)
- **Cascade Delete** - Manutenção automática de integridade

---

## 🐛 Debugging

### Logs

```bash
# Desenvolvimento (morgan 'dev')
GET /products 200 45ms

# Produção (morgan 'combined')
::1 - - [02/Dec/2025:10:00:00 +0000] "GET /products HTTP/1.1" 200 1234
```

### Health Check

```bash
curl http://localhost:4000/health

{
  "status": "OK",
  "timestamp": "2025-12-02T10:00:00.000Z",
  "uptime": 3600,
  "environment": "development"
}
```

---

## 📚 Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Servidor com nodemon

# Produção
npm start                # Servidor Node.js

# Banco de Dados
npx prisma migrate dev   # Criar migração
npx prisma migrate reset # Resetar banco
npm run prisma:seed      # Popular banco
npx prisma studio        # Interface visual

# Testes
npm test                 # Executar testes
npm run test:watch       # Modo watch
npm run test:coverage    # Com cobertura
```

---

## 🚨 Códigos de Status HTTP

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Sucesso (GET, PUT, DELETE) |
| 201 | Created | Recurso criado (POST) |
| 400 | Bad Request | Dados inválidos |
| 401 | Unauthorized | Token ausente/inválido |
| 403 | Forbidden | Sem permissão |
| 404 | Not Found | Recurso não encontrado |
| 500 | Internal Server Error | Erro no servidor |

---

## 👥 Autores

**Alexandra Aversani, Gabriela Moleta e Pablo Delgado**

---

## 📄 Licença

MIT License - Veja LICENSE para detalhes.

---

## 🔗 Links Úteis

- [Express.js](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [JWT.io](https://jwt.io/)
- [Jest](https://jestjs.io/)

---

**Última atualização:** 02 de dezembro de 2025
