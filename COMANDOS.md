# ⚡ Comandos Rápidos - StockSync

Referência rápida de todos os comandos úteis do projeto.

---

## 🚀 Inicialização

```bash
# Primeira vez (setup completo)
npm install
npx prisma migrate dev
node prisma/seed/seedStock.js
npm run dev

# Próximas vezes
npm run dev
```

---

## 🎯 Desenvolvimento

```bash
# Iniciar servidor (auto-reload)
npm run dev

# Iniciar em produção
npm start

# Parar servidor
Ctrl + C
```

---

## 🧪 Testes

```bash
# Executar todos os testes (70)
npm test

# Modo watch (auto-run)
npm run test:watch

# Cobertura de testes
npm run test:coverage

# Teste específico
npm test auth.test.js
npm test products.test.js
```

---

## 🗄️ Banco de Dados (Prisma)

```bash
# Ver dados visualmente
npx prisma studio
# Abre em http://localhost:5555

# Aplicar migrations
npx prisma migrate dev

# Resetar banco (⚠️ apaga tudo!)
npx prisma migrate reset

# Popular com dados de teste
node prisma/seed/seedStock.js

# Gerar Prisma Client
npx prisma generate

# Ver status das migrations
npx prisma migrate status
```

---

## 🔍 Verificação

```bash
# Health check
curl http://localhost:4000/health

# Login de teste
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@stocksync.com","password":"123456"}'

# Listar produtos (com token)
curl -X GET http://localhost:4000/products \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 📦 NPM

```bash
# Instalar dependências
npm install

# Verificar vulnerabilidades
npm audit

# Corrigir vulnerabilidades
npm audit fix

# Verificar pacotes desatualizados
npm outdated

# Limpar cache
npm cache clean --force
```

---

## 🔐 Segurança

```bash
# Gerar JWT_SECRET forte
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Ver variáveis de ambiente
cat .env          # Linux/Mac
type .env         # Windows CMD
Get-Content .env  # Windows PowerShell
```

---

## 📖 Documentação

```bash
# Abrir Prisma Studio (ver dados)
npx prisma studio

# Ver schema do banco
cat prisma/schema.prisma      # Linux/Mac
type prisma\schema.prisma     # Windows
```

---

## 🐛 Troubleshooting

```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json  # Linux/Mac
rmdir /s node_modules                  # Windows
npm install

# Resetar banco completamente
npx prisma migrate reset --force
node prisma/seed/seedStock.js

# Verificar versões
node -v
npm -v
npx prisma -v

# Ver logs detalhados
npm run dev --verbose
```

---

## 🧹 Limpeza

```bash
# Remover node_modules
rm -rf node_modules           # Linux/Mac
rmdir /s node_modules         # Windows

# Remover banco de dados
rm prisma/dev.db              # Linux/Mac
del prisma\dev.db             # Windows

# Remover coverage
rm -rf coverage               # Linux/Mac
rmdir /s coverage             # Windows
```

---

## 📊 Informações

```bash
# Ver estrutura de pastas
tree -L 2                     # Linux/Mac
tree /F                       # Windows

# Contar linhas de código
find src -name "*.js" | xargs wc -l    # Linux/Mac

# Ver tamanho do projeto
du -sh .                      # Linux/Mac
```

---

## 🔄 Git

```bash
# Clonar
git clone https://github.com/pablodelgado26/back-StockSync.git

# Ver status
git status

# Commit
git add .
git commit -m "mensagem"
git push

# Ver histórico
git log --oneline
```

---

## 🎯 Atalhos Úteis

```bash
# Setup rápido (copia e cola tudo)
npm install && npx prisma migrate dev && node prisma/seed/seedStock.js && npm run dev

# Reset + Seed rápido
npx prisma migrate reset --force && node prisma/seed/seedStock.js

# Teste + Ver cobertura
npm test && npm run test:coverage

# Abrir Prisma Studio + Servidor
npx prisma studio & npm run dev
```

---

## 📍 URLs Importantes

- **API:** http://localhost:4000
- **Health:** http://localhost:4000/health
- **Prisma Studio:** http://localhost:5555
- **Postman Collection:** `postman/StockSync-API.postman_collection.json`

---

## 🔑 Credenciais de Teste

```
Admin:
  Email: admin@stocksync.com
  Senha: 123456

Estoquista:
  Email: maria.estoquista@stocksync.com
  Senha: 123456
```

---

## 📝 Variáveis de Ambiente (.env)

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="sua-chave-secreta"
JWT_EXPIRES_IN="7d"
PORT=4000
NODE_ENV="development"
```

---

**💡 Dica:** Salve este arquivo nos favoritos para consulta rápida!
