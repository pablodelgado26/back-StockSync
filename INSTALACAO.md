# 🚀 Guia Rápido de Instalação - StockSync

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- ✅ **Node.js 18+** ([Download](https://nodejs.org))
- ✅ **NPM** (vem com Node.js)
- ✅ **Git** (opcional, para clonar)

---

## ⚡ Instalação em 5 Passos

### **1️⃣ Clone o projeto**

```bash
git clone https://github.com/pablodelgado26/back-StockSync.git
cd back-StockSync
```

Ou baixe o ZIP e extraia.

---

### **2️⃣ Instale as dependências**

```bash
npm install
```

Aguarde a instalação de todas as dependências (~30 pacotes).

---

### **3️⃣ Configure o arquivo .env**

**Opção A - Criar manualmente:**

Crie um arquivo `.env` na raiz do projeto com:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="sua-chave-secreta-aqui"
JWT_EXPIRES_IN="7d"
PORT=4000
NODE_ENV="development"
```

**Opção B - Copiar do exemplo:**

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Linux/Mac
cp .env.example .env
```

Depois edite o `.env` e altere `JWT_SECRET` para uma chave forte.

**💡 Como gerar JWT_SECRET segura:**

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

### **4️⃣ Configure o banco de dados**

```bash
# Criar as tabelas
npx prisma migrate dev

# Popular com dados de teste (698 registros)
node prisma/seed/seedStock.js
```

Isso criará:
- 5 usuários (2 admins, 3 estoquistas)
- 20 fornecedores
- 100 produtos
- 573 movimentações

---

### **5️⃣ Inicie o servidor**

```bash
npm run dev
```

Você verá:
```
Servidor rodando na porta 4000
```

---

## ✅ Verificar se está funcionando

### **1. Health Check**

Abra o navegador ou use curl:

```bash
curl http://localhost:4000/health
```

Resposta esperada:
```json
{
  "status": "OK",
  "timestamp": "2025-11-04T...",
  "uptime": 5,
  "environment": "development"
}
```

### **2. Login de teste**

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@stocksync.com\",\"password\":\"123456\"}"
```

Você deve receber um token JWT.

### **3. Executar testes**

```bash
npm test
```

Resultado esperado:
```
Test Suites: 5 passed, 5 total
Tests:       70 passed, 70 total
```

---

## 🎉 Pronto!

Sua API está rodando em: **http://localhost:4000**

### **Próximos passos:**

1. **Importe a collection do Postman:**
   - Arquivo: `postman/StockSync-API.postman_collection.json`
   - Contém 47 endpoints documentados

2. **Use as credenciais de teste:**
   - Admin: `admin@stocksync.com` / `123456`
   - Estoquista: `maria.estoquista@stocksync.com` / `123456`

3. **Explore o banco de dados:**
   ```bash
   npx prisma studio
   ```
   Abre interface visual em http://localhost:5555

---

## 🐛 Problemas Comuns

### **Erro: "Port 4000 already in use"**

```bash
# Mude a porta no .env
PORT=4001
```

### **Erro: "Cannot find module '@prisma/client'"**

```bash
npx prisma generate
```

### **Erro: "JWT_SECRET is not defined"**

Certifique-se de criar o arquivo `.env` (passo 3).

### **Testes falhando**

```bash
# Reset o banco
npx prisma migrate reset
node prisma/seed/seedStock.js
npm test
```

---

## 📚 Documentação Completa

Consulte o **README.md** para documentação detalhada.

---

## 🆘 Ajuda

Se ainda tiver problemas:

1. Verifique se Node.js está instalado: `node -v`
2. Verifique se está na pasta correta: `ls` (deve ver package.json)
3. Leia a seção Troubleshooting no README.md

---

**Boa sorte! 🚀**
