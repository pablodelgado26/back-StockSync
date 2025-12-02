# 🛣️ Guia Completo de Rotas da API StockSync

Documentação detalhada de todas as rotas disponíveis na API, com exemplos práticos de uso.

---

## 📋 Índice

- [Base URL](#base-url)
- [Autenticação](#autenticação)
- [Fornecedores](#fornecedores)
- [Produtos](#produtos)
- [Movimentações de Estoque](#movimentações-de-estoque)
- [Dashboard](#dashboard)
- [Códigos de Status HTTP](#códigos-de-status-http)

---

## 🌐 Base URL

```
http://localhost:4000
```

---

## 🔐 Autenticação

Todas as rotas (exceto login e register) requerem um token JWT no header:

```
Authorization: Bearer seu_token_aqui
```

### 📍 Rotas Públicas (Não requerem autenticação)

#### 1. Registrar Novo Usuário

**POST** `/auth/register`

Cria um novo usuário no sistema.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@stocksync.com",
  "password": "senha123",
  "role": "estoquista"
}
```

**Campos:**
- `name` *(obrigatório)*: Nome completo do usuário
- `email` *(obrigatório)*: Email único
- `password` *(obrigatório)*: Senha (mínimo 6 caracteres)
- `role` *(opcional)*: "admin" ou "estoquista" (padrão: "estoquista")

**Resposta de Sucesso (201):**
```json
{
  "message": "Usuário registrado com sucesso!",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@stocksync.com",
    "role": "estoquista",
    "createdAt": "2025-12-02T10:00:00.000Z",
    "updatedAt": "2025-12-02T10:00:00.000Z"
  }
}
```

**Exemplo cURL:**
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@stocksync.com",
    "password": "senha123",
    "role": "estoquista"
  }'
```

---

#### 2. Login

**POST** `/auth/login`

Autentica um usuário e retorna um token JWT.

**Body:**
```json
{
  "email": "admin@stocksync.com",
  "password": "123456"
}
```

**Resposta de Sucesso (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin Geral",
    "email": "admin@stocksync.com",
    "role": "admin"
  }
}
```

**Exemplo cURL:**
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@stocksync.com",
    "password": "123456"
  }'
```

**💡 Dica:** Salve o token retornado para usar nas próximas requisições.

---

#### 3. Listar Todos os Usuários

**GET** `/auth/users`

Lista todos os usuários cadastrados no sistema.

**Permissão:** Usuários autenticados

**Resposta de Sucesso (200):**
```json
[
  {
    "id": 1,
    "name": "Admin Geral",
    "email": "admin@stocksync.com",
    "role": "admin",
    "createdAt": "2025-11-06T11:47:16.655Z",
    "updatedAt": "2025-11-06T11:47:16.655Z"
  },
  {
    "id": 2,
    "name": "Maria Santos",
    "email": "maria.estoquista@stocksync.com",
    "role": "estoquista",
    "createdAt": "2025-11-06T11:47:16.656Z",
    "updatedAt": "2025-11-06T11:47:16.656Z"
  }
]
```

**Exemplo cURL:**
```bash
curl -X GET http://localhost:4000/auth/users \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 🏭 Fornecedores

### 1. Listar Todos os Fornecedores

**GET** `/suppliers`

Lista todos os fornecedores cadastrados.

**Permissão:** Admin e Estoquista

**Resposta de Sucesso (200):**
```json
[
  {
    "id": 1,
    "nome": "Tech Distribuidora",
    "contato": "(11) 98765-4321",
    "cnpj": "12345678/0001-90",
    "createdAt": "2025-11-06T11:47:16.656Z",
    "updatedAt": "2025-11-06T11:47:16.656Z"
  },
  {
    "id": 2,
    "nome": "Eletrônicos Silva",
    "contato": "(21) 97654-3210",
    "cnpj": "98765432/0001-10",
    "createdAt": "2025-11-06T11:47:16.657Z",
    "updatedAt": "2025-11-06T11:47:16.657Z"
  }
]
```

**Exemplo cURL:**
```bash
curl -X GET http://localhost:4000/suppliers \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

### 2. Buscar Fornecedor por ID

**GET** `/suppliers/:id`

Retorna os detalhes de um fornecedor específico.

**Permissão:** Admin e Estoquista

**Parâmetros de URL:**
- `id`: ID do fornecedor

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "nome": "Tech Distribuidora",
  "contato": "(11) 98765-4321",
  "cnpj": "12345678/0001-90",
  "createdAt": "2025-11-06T11:47:16.656Z",
  "updatedAt": "2025-11-06T11:47:16.656Z"
}
```

**Exemplo cURL:**
```bash
curl -X GET http://localhost:4000/suppliers/1 \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

### 3. Criar Fornecedor

**POST** `/suppliers`

Cria um novo fornecedor.

**Permissão:** Apenas Admin

**Body:**
```json
{
  "nome": "Novo Fornecedor LTDA",
  "contato": "(11) 99999-8888",
  "cnpj": "11222333/0001-44"
}
```

**Campos:**
- `nome` *(obrigatório)*: Nome do fornecedor
- `contato` *(obrigatório)*: Telefone de contato
- `cnpj` *(obrigatório)*: CNPJ único (formato: XX.XXX.XXX/XXXX-XX ou XXXXXXXX/XXXX-XX)

**Resposta de Sucesso (201):**
```json
{
  "id": 21,
  "nome": "Novo Fornecedor LTDA",
  "contato": "(11) 99999-8888",
  "cnpj": "11222333/0001-44",
  "createdAt": "2025-12-02T10:30:00.000Z",
  "updatedAt": "2025-12-02T10:30:00.000Z"
}
```

**Exemplo cURL:**
```bash
curl -X POST http://localhost:4000/suppliers \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Novo Fornecedor LTDA",
    "contato": "(11) 99999-8888",
    "cnpj": "11222333/0001-44"
  }'
```

---

### 4. Atualizar Fornecedor

**PUT** `/suppliers/:id`

Atualiza os dados de um fornecedor existente.

**Permissão:** Apenas Admin

**Parâmetros de URL:**
- `id`: ID do fornecedor

**Body:**
```json
{
  "nome": "Fornecedor Atualizado LTDA",
  "contato": "(11) 98888-7777",
  "cnpj": "11222333/0001-44"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Fornecedor atualizado com sucesso!",
  "supplier": {
    "id": 1,
    "nome": "Fornecedor Atualizado LTDA",
    "contato": "(11) 98888-7777",
    "cnpj": "11222333/0001-44",
    "createdAt": "2025-11-06T11:47:16.656Z",
    "updatedAt": "2025-12-02T10:35:00.000Z"
  }
}
```

**Exemplo cURL:**
```bash
curl -X PUT http://localhost:4000/suppliers/1 \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Fornecedor Atualizado LTDA",
    "contato": "(11) 98888-7777"
  }'
```

---

### 5. Excluir Fornecedor

**DELETE** `/suppliers/:id`

Exclui um fornecedor do sistema.

**Permissão:** Apenas Admin

**⚠️ Atenção:** Remove também todos os produtos associados a este fornecedor (CASCADE).

**Parâmetros de URL:**
- `id`: ID do fornecedor

**Resposta de Sucesso (200):**
```json
{
  "message": "Fornecedor excluído com sucesso!"
}
```

**Exemplo cURL:**
```bash
curl -X DELETE http://localhost:4000/suppliers/1 \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 📦 Produtos

### 1. Listar Todos os Produtos

**GET** `/products`

Lista todos os produtos com estoque atual e dados do fornecedor.

**Permissão:** Admin e Estoquista

**Resposta de Sucesso (200):**
```json
[
  {
    "id": 1,
    "barcode": "1234567890123",
    "name": "Mouse Gamer RGB",
    "description": "Mouse com iluminação RGB e 7 botões programáveis",
    "price": 159.90,
    "stock": 45,
    "category": "Periféricos",
    "estoqueMinimo": 10,
    "fornecedorId": 1,
    "estoqueAtual": 45,
    "fornecedor": {
      "id": 1,
      "nome": "Tech Distribuidora",
      "contato": "(11) 98765-4321",
      "cnpj": "12345678/0001-90"
    },
    "stockMovements": [],
    "createdAt": "2025-11-06T11:47:16.659Z",
    "updatedAt": "2025-12-02T10:40:00.000Z"
  }
]
```

**Exemplo cURL:**
```bash
curl -X GET http://localhost:4000/products \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

### 2. Buscar Produto por ID

**GET** `/products/:id`

Retorna os detalhes de um produto específico.

**Permissão:** Admin e Estoquista

**Parâmetros de URL:**
- `id`: ID do produto

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "barcode": "1234567890123",
  "name": "Mouse Gamer RGB",
  "description": "Mouse com iluminação RGB e 7 botões programáveis",
  "price": 159.90,
  "stock": 45,
  "category": "Periféricos",
  "estoqueMinimo": 10,
  "fornecedorId": 1,
  "estoqueAtual": 45,
  "fornecedor": {
    "id": 1,
    "nome": "Tech Distribuidora",
    "contato": "(11) 98765-4321",
    "cnpj": "12345678/0001-90"
  },
  "stockMovements": [
    {
      "id": 1,
      "tipo": "entrada",
      "quantidade": 50,
      "data": "2025-11-06T11:47:17.029Z"
    },
    {
      "id": 2,
      "tipo": "saida",
      "quantidade": 5,
      "data": "2025-11-10T14:30:00.000Z"
    }
  ],
  "createdAt": "2025-11-06T11:47:16.659Z",
  "updatedAt": "2025-12-02T10:40:00.000Z"
}
```

**Exemplo cURL:**
```bash
curl -X GET http://localhost:4000/products/1 \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

### 3. Buscar Produto por Código de Barras

**GET** `/products/barcode/:barcode`

Retorna os detalhes de um produto através do código de barras.

**Permissão:** Admin e Estoquista

**Parâmetros de URL:**
- `barcode`: Código de barras do produto (EAN-13)

**💡 Útil para:** Integração com leitores de código de barras no frontend

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "barcode": "1234567890123",
  "name": "Mouse Gamer RGB",
  "description": "Mouse com iluminação RGB e 7 botões programáveis",
  "price": 159.90,
  "stock": 45,
  "category": "Periféricos",
  "estoqueMinimo": 10,
  "fornecedorId": 1,
  "estoqueAtual": 45,
  "fornecedor": {
    "id": 1,
    "nome": "Tech Distribuidora"
  },
  "createdAt": "2025-11-06T11:47:16.659Z",
  "updatedAt": "2025-12-02T10:40:00.000Z"
}
```

**Exemplo cURL:**
```bash
curl -X GET http://localhost:4000/products/barcode/1234567890123 \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

### 4. Criar Produto

**POST** `/products`

Cria um novo produto no sistema.

**Permissão:** Apenas Admin

**Body:**
```json
{
  "barcode": "7891234567890",
  "name": "Teclado Mecânico RGB",
  "description": "Teclado mecânico com switches blue e iluminação RGB personalizável",
  "price": 299.90,
  "stock": 0,
  "category": "Periféricos",
  "estoqueMinimo": 5,
  "fornecedorId": 1
}
```

**Campos:**
- `barcode` *(obrigatório)*: Código de barras único (EAN-13)
- `name` *(obrigatório)*: Nome do produto
- `description` *(opcional)*: Descrição detalhada
- `price` *(obrigatório)*: Preço do produto (número decimal)
- `stock` *(opcional)*: Estoque inicial (padrão: 0)
- `category` *(obrigatório)*: Categoria do produto
- `estoqueMinimo` *(opcional)*: Estoque mínimo para alerta (padrão: 10)
- `fornecedorId` *(obrigatório)*: ID do fornecedor

**Resposta de Sucesso (201):**
```json
{
  "id": 101,
  "barcode": "7891234567890",
  "name": "Teclado Mecânico RGB",
  "description": "Teclado mecânico com switches blue e iluminação RGB personalizável",
  "price": 299.90,
  "stock": 0,
  "category": "Periféricos",
  "estoqueMinimo": 5,
  "fornecedorId": 1,
  "fornecedor": {
    "id": 1,
    "nome": "Tech Distribuidora"
  },
  "createdAt": "2025-12-02T10:45:00.000Z",
  "updatedAt": "2025-12-02T10:45:00.000Z"
}
```

**Exemplo cURL:**
```bash
curl -X POST http://localhost:4000/products \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "barcode": "7891234567890",
    "name": "Teclado Mecânico RGB",
    "description": "Teclado mecânico com switches blue e iluminação RGB personalizável",
    "price": 299.90,
    "stock": 0,
    "category": "Periféricos",
    "estoqueMinimo": 5,
    "fornecedorId": 1
  }'
```

---

### 5. Atualizar Produto

**PUT** `/products/:id`

Atualiza os dados de um produto existente.

**Permissão:** Apenas Admin

**Parâmetros de URL:**
- `id`: ID do produto

**Body (todos os campos são opcionais):**
```json
{
  "name": "Teclado Mecânico RGB Plus",
  "description": "Teclado mecânico com switches blue, iluminação RGB e descanso de pulso",
  "price": 349.90,
  "category": "Periféricos",
  "estoqueMinimo": 8
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Produto atualizado com sucesso!",
  "product": {
    "id": 1,
    "barcode": "1234567890123",
    "name": "Teclado Mecânico RGB Plus",
    "description": "Teclado mecânico com switches blue, iluminação RGB e descanso de pulso",
    "price": 349.90,
    "stock": 45,
    "category": "Periféricos",
    "estoqueMinimo": 8,
    "fornecedorId": 1,
    "createdAt": "2025-11-06T11:47:16.659Z",
    "updatedAt": "2025-12-02T10:50:00.000Z"
  }
}
```

**Exemplo cURL:**
```bash
curl -X PUT http://localhost:4000/products/1 \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teclado Mecânico RGB Plus",
    "price": 349.90,
    "estoqueMinimo": 8
  }'
```

---

### 6. Excluir Produto

**DELETE** `/products/:id`

Exclui um produto do sistema.

**Permissão:** Apenas Admin

**⚠️ Atenção:** Remove também todas as movimentações associadas a este produto (CASCADE).

**Parâmetros de URL:**
- `id`: ID do produto

**Resposta de Sucesso (200):**
```json
{
  "message": "Produto excluído com sucesso!"
}
```

**Exemplo cURL:**
```bash
curl -X DELETE http://localhost:4000/products/1 \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 📊 Movimentações de Estoque

### 1. Listar Todas as Movimentações

**GET** `/stockmovements`

Lista todas as movimentações de estoque, ordenadas por data (mais recentes primeiro).

**Permissão:** Admin e Estoquista

**Query Parameters (opcionais):**
- `tipo`: Filtrar por tipo ("entrada" ou "saida")
- `produtoId`: Filtrar por ID do produto
- `dataInicio`: Data inicial (formato: YYYY-MM-DD)
- `dataFim`: Data final (formato: YYYY-MM-DD)

**Resposta de Sucesso (200):**
```json
[
  {
    "id": 1,
    "tipo": "entrada",
    "quantidade": 50,
    "data": "2025-11-06T11:47:17.029Z",
    "produtoId": 1,
    "produto": {
      "id": 1,
      "barcode": "1234567890123",
      "name": "Mouse Gamer RGB",
      "price": 159.90,
      "category": "Periféricos"
    },
    "createdAt": "2025-11-06T11:47:17.029Z",
    "updatedAt": "2025-11-06T11:47:17.029Z"
  },
  {
    "id": 2,
    "tipo": "saida",
    "quantidade": 5,
    "data": "2025-11-10T14:30:00.000Z",
    "produtoId": 1,
    "produto": {
      "id": 1,
      "barcode": "1234567890123",
      "name": "Mouse Gamer RGB"
    },
    "createdAt": "2025-11-10T14:30:00.000Z",
    "updatedAt": "2025-11-10T14:30:00.000Z"
  }
]
```

**Exemplos cURL:**

```bash
# Listar todas
curl -X GET http://localhost:4000/stockmovements \
  -H "Authorization: Bearer SEU_TOKEN"

# Filtrar apenas entradas
curl -X GET "http://localhost:4000/stockmovements?tipo=entrada" \
  -H "Authorization: Bearer SEU_TOKEN"

# Filtrar por produto
curl -X GET "http://localhost:4000/stockmovements?produtoId=1" \
  -H "Authorization: Bearer SEU_TOKEN"

# Filtrar por intervalo de datas
curl -X GET "http://localhost:4000/stockmovements?dataInicio=2025-11-01&dataFim=2025-11-30" \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

### 2. Buscar Movimentação por ID

**GET** `/stockmovements/:id`

Retorna os detalhes de uma movimentação específica.

**Permissão:** Admin e Estoquista

**Parâmetros de URL:**
- `id`: ID da movimentação

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "tipo": "entrada",
  "quantidade": 50,
  "data": "2025-11-06T11:47:17.029Z",
  "produtoId": 1,
  "produto": {
    "id": 1,
    "barcode": "1234567890123",
    "name": "Mouse Gamer RGB",
    "price": 159.90,
    "category": "Periféricos",
    "stock": 45
  },
  "createdAt": "2025-11-06T11:47:17.029Z",
  "updatedAt": "2025-11-06T11:47:17.029Z"
}
```

**Exemplo cURL:**
```bash
curl -X GET http://localhost:4000/stockmovements/1 \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

### 3. Registrar Movimentação (Entrada)

**POST** `/stockmovements`

Registra uma entrada de mercadoria no estoque.

**Permissão:** Admin e Estoquista

**⚠️ Importante:** O campo `stock` do produto é atualizado automaticamente.

**Body:**
```json
{
  "tipo": "entrada",
  "quantidade": 25,
  "produtoId": 1
}
```

**Campos:**
- `tipo` *(obrigatório)*: "entrada"
- `quantidade` *(obrigatório)*: Quantidade a adicionar (número positivo)
- `produtoId` *(obrigatório)*: ID do produto

**Resposta de Sucesso (201):**
```json
{
  "id": 573,
  "tipo": "entrada",
  "quantidade": 25,
  "data": "2025-12-02T11:00:00.000Z",
  "produtoId": 1,
  "createdAt": "2025-12-02T11:00:00.000Z",
  "updatedAt": "2025-12-02T11:00:00.000Z"
}
```

**Exemplo cURL:**
```bash
curl -X POST http://localhost:4000/stockmovements \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "entrada",
    "quantidade": 25,
    "produtoId": 1
  }'
```

---

### 4. Registrar Movimentação (Saída)

**POST** `/stockmovements`

Registra uma saída de mercadoria do estoque.

**Permissão:** Admin e Estoquista

**⚠️ Importante:** O campo `stock` do produto é atualizado automaticamente.

**Body:**
```json
{
  "tipo": "saida",
  "quantidade": 10,
  "produtoId": 1
}
```

**Campos:**
- `tipo` *(obrigatório)*: "saida"
- `quantidade` *(obrigatório)*: Quantidade a retirar (número positivo)
- `produtoId` *(obrigatório)*: ID do produto

**Resposta de Sucesso (201):**
```json
{
  "id": 574,
  "tipo": "saida",
  "quantidade": 10,
  "data": "2025-12-02T11:05:00.000Z",
  "produtoId": 1,
  "createdAt": "2025-12-02T11:05:00.000Z",
  "updatedAt": "2025-12-02T11:05:00.000Z"
}
```

**Exemplo cURL:**
```bash
curl -X POST http://localhost:4000/stockmovements \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "saida",
    "quantidade": 10,
    "produtoId": 1
  }'
```

---

### 5. Excluir Movimentação

**DELETE** `/stockmovements/:id`

Exclui uma movimentação do sistema.

**Permissão:** Apenas Admin

**⚠️ Atenção:** O campo `stock` do produto precisa ser recalculado manualmente após exclusão.

**Parâmetros de URL:**
- `id`: ID da movimentação

**Resposta de Sucesso (200):**
```json
{
  "message": "Movimentação excluída com sucesso!"
}
```

**Exemplo cURL:**
```bash
curl -X DELETE http://localhost:4000/stockmovements/1 \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 📈 Dashboard

### 1. Obter Dashboard Completo

**GET** `/dashboard`

Retorna estatísticas do sistema e alertas de estoque baixo.

**Permissão:** Admin e Estoquista

**Resposta de Sucesso (200):**
```json
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
      "barcode": "7891234567899",
      "estoqueAtual": 3,
      "estoqueMinimo": 10,
      "category": "Periféricos",
      "fornecedor": {
        "id": 5,
        "nome": "Tech Distribuidora"
      }
    },
    {
      "id": 47,
      "name": "Cabo HDMI 2.0",
      "barcode": "1234567890124",
      "estoqueAtual": 5,
      "estoqueMinimo": 15,
      "category": "Cabos e Acessórios",
      "fornecedor": {
        "id": 8,
        "nome": "Cable Tech"
      }
    }
  ]
}
```

**Campos do Resumo:**
- `totalProdutos`: Total de produtos cadastrados
- `totalFornecedores`: Total de fornecedores cadastrados
- `totalMovimentacoes`: Total de movimentações registradas
- `totalEntradas`: Total de movimentações de entrada
- `totalSaidas`: Total de movimentações de saída
- `valorTotalEstoque`: Valor total do estoque (soma de price × stock)

**Campos dos Alertas:**
- Lista de produtos com `stock < estoqueMinimo`
- Inclui dados do fornecedor

**Exemplo cURL:**
```bash
curl -X GET http://localhost:4000/dashboard \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 🏥 Health Check

### 1. Verificar Status da API

**GET** `/health`

Verifica se a API está funcionando.

**Permissão:** Público (não requer autenticação)

**Resposta de Sucesso (200):**
```json
{
  "status": "OK",
  "timestamp": "2025-12-02T11:10:00.000Z",
  "uptime": 3600,
  "environment": "development"
}
```

**Exemplo cURL:**
```bash
curl -X GET http://localhost:4000/health
```

---

## 📋 Códigos de Status HTTP

| Código | Significado | Quando Ocorre |
|--------|-------------|---------------|
| **200** | OK | Requisição bem-sucedida (GET, PUT, DELETE) |
| **201** | Created | Recurso criado com sucesso (POST) |
| **400** | Bad Request | Dados inválidos ou campos obrigatórios faltando |
| **401** | Unauthorized | Token JWT ausente ou inválido |
| **403** | Forbidden | Usuário sem permissão para a ação (ex: estoquista tentando criar produto) |
| **404** | Not Found | Recurso não encontrado (ID inexistente) |
| **500** | Internal Server Error | Erro no servidor |

---

## 🔒 Controle de Permissões

### Tabela de Permissões por Rota

| Rota | Admin | Estoquista |
|------|-------|------------|
| **Autenticação** | | |
| POST /auth/register | ✅ | ✅ |
| POST /auth/login | ✅ | ✅ |
| GET /auth/users | ✅ | ✅ |
| **Fornecedores** | | |
| GET /suppliers | ✅ | ✅ |
| GET /suppliers/:id | ✅ | ✅ |
| POST /suppliers | ✅ | ❌ |
| PUT /suppliers/:id | ✅ | ❌ |
| DELETE /suppliers/:id | ✅ | ❌ |
| **Produtos** | | |
| GET /products | ✅ | ✅ |
| GET /products/:id | ✅ | ✅ |
| GET /products/barcode/:barcode | ✅ | ✅ |
| POST /products | ✅ | ❌ |
| PUT /products/:id | ✅ | ❌ |
| DELETE /products/:id | ✅ | ❌ |
| **Movimentações** | | |
| GET /stockmovements | ✅ | ✅ |
| GET /stockmovements/:id | ✅ | ✅ |
| POST /stockmovements | ✅ | ✅ |
| DELETE /stockmovements/:id | ✅ | ❌ |
| **Dashboard** | | |
| GET /dashboard | ✅ | ✅ |

---

## 💡 Dicas de Uso

### 1. Salvando o Token

Após o login, salve o token retornado para usar nas próximas requisições:

```javascript
// JavaScript/Frontend
const response = await fetch('http://localhost:4000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@stocksync.com',
    password: '123456'
  })
});

const data = await response.json();
localStorage.setItem('token', data.token);
```

### 2. Usando o Token nas Requisições

```javascript
// JavaScript/Frontend
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:4000/products', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const products = await response.json();
```

### 3. Tratamento de Erros

```javascript
// JavaScript/Frontend
try {
  const response = await fetch('http://localhost:4000/products', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token inválido ou expirado - redirecionar para login
      window.location.href = '/login';
    } else if (response.status === 403) {
      // Sem permissão
      alert('Você não tem permissão para esta ação');
    } else {
      // Outro erro
      const error = await response.json();
      alert(error.error || 'Erro ao carregar produtos');
    }
    return;
  }

  const products = await response.json();
  console.log(products);
} catch (error) {
  console.error('Erro de rede:', error);
}
```

### 4. Fluxo Completo: Registrar Entrada de Produto

```bash
# 1. Fazer login
TOKEN=$(curl -s -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@stocksync.com","password":"123456"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# 2. Buscar produto por barcode
curl -X GET http://localhost:4000/products/barcode/1234567890123 \
  -H "Authorization: Bearer $TOKEN"

# 3. Registrar entrada de 50 unidades
curl -X POST http://localhost:4000/stockmovements \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "entrada",
    "quantidade": 50,
    "produtoId": 1
  }'

# 4. Verificar estoque atualizado
curl -X GET http://localhost:4000/products/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🎯 Exemplos de Integração

### Exemplo: Sistema de Vendas

```javascript
// 1. Cliente escaneia código de barras
const barcode = '1234567890123';

// 2. Buscar produto
const product = await fetch(`http://localhost:4000/products/barcode/${barcode}`, {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());

// 3. Verificar estoque disponível
if (product.stock < quantidadeVenda) {
  alert('Estoque insuficiente!');
  return;
}

// 4. Registrar saída
await fetch('http://localhost:4000/stockmovements', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    tipo: 'saida',
    quantidade: quantidadeVenda,
    produtoId: product.id
  })
});

// 5. Processar venda
console.log('Venda realizada com sucesso!');
```

### Exemplo: Sistema de Recebimento

```javascript
// 1. Recebimento de nota fiscal
const notaFiscal = {
  fornecedorId: 1,
  produtos: [
    { barcode: '1234567890123', quantidade: 50 },
    { barcode: '7891234567890', quantidade: 30 }
  ]
};

// 2. Processar cada produto
for (const item of notaFiscal.produtos) {
  // Buscar produto por barcode
  const product = await fetch(
    `http://localhost:4000/products/barcode/${item.barcode}`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  ).then(r => r.json());

  // Registrar entrada
  await fetch('http://localhost:4000/stockmovements', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tipo: 'entrada',
      quantidade: item.quantidade,
      produtoId: product.id
    })
  });
}

console.log('Nota fiscal processada!');
```

---

## 📚 Recursos Adicionais

- **Postman Collection:** Importe o arquivo `postman/StockSync-API.postman_collection.json` para ter todos os endpoints documentados
- **README.md:** Documentação geral do projeto
- **COMANDOS.md:** Comandos úteis para desenvolvimento

---

## 🆘 Problemas Comuns

### Token Inválido

**Erro:** `401 Unauthorized - Token inválido`

**Solução:** Faça login novamente e atualize o token

### Permissão Negada

**Erro:** `403 Forbidden`

**Solução:** Verifique se o usuário tem a role adequada (admin para criar/editar/excluir)

### Produto Não Encontrado

**Erro:** `404 Not Found - Produto não encontrado`

**Solução:** Verifique se o ID ou barcode está correto

### Campos Obrigatórios

**Erro:** `400 Bad Request - Campos obrigatórios faltando`

**Solução:** Verifique se todos os campos obrigatórios estão presentes no body

---

**Desenvolvido por Alexandra, Gabriela e Pablo**

📞 **Suporte:** Para dúvidas, consulte o README.md ou abra uma issue no repositório.
