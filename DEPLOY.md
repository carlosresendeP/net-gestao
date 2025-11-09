# Deploy na Vercel - NetGestão

## Variáveis de Ambiente Necessárias

Configure as seguintes variáveis de ambiente no painel da Vercel:

```bash
# Database
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/netgestao?retryWrites=true&w=majority

# Admin
ADMIN_KEY=seu_token_admin_secreto_aqui

# Public
NEXT_PUBLIC_BASE_URL=https://seu-projeto.vercel.app
```

## Configurações Importantes

### 1. Build Command
O comando de build já está configurado no `package.json`:
```json
"build": "prisma generate && next build"
```

### 2. Install Command
O Prisma Client será gerado automaticamente após a instalação:
```json
"postinstall": "prisma generate"
```

### 3. Framework Preset
- Framework: **Next.js**
- Build Command: `npm run build` (padrão)
- Output Directory: `.next` (padrão)
- Install Command: `npm install` (padrão)

## Passos para Deploy

### 1. MongoDB Atlas
1. Acesse [MongoDB Atlas](https://cloud.mongodb.com)
2. Crie um cluster (gratuito M0 disponível)
3. Configure Network Access → Add IP Address → `0.0.0.0/0` (permitir de qualquer lugar)
4. Configure Database Access → Add Database User
5. Copie a connection string (Database → Connect → Drivers)
6. Substitua `<username>`, `<password>` e `<database>` na string

### 2. Vercel
1. Acesse [Vercel](https://vercel.com)
2. Import Project do GitHub
3. Configure as variáveis de ambiente (Settings → Environment Variables):
   - `DATABASE_URL`: Sua connection string do MongoDB
   - `ADMIN_KEY`: Um token secreto (ex: `admin_secret_2025`)
   - `NEXT_PUBLIC_BASE_URL`: URL do seu projeto (ex: `https://netgestao.vercel.app`)
4. Deploy!

### 3. Verificação
Após o deploy, teste os endpoints:

```bash
# Testar criação de intenção
curl -X POST https://seu-projeto.vercel.app/api/intencoes \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","email":"teste@email.com","empresa":"Empresa","motivo":"Teste de integração"}'

# Testar listagem (admin)
curl https://seu-projeto.vercel.app/api/intencoes?auth=seu_ADMIN_KEY
```

## Troubleshooting

### Erro: "PrismaClient is unable to run in this browser environment"
- ✅ **Resolvido**: Movemos o output do Prisma de `../generated/prisma` para o padrão `node_modules/@prisma/client`
- ✅ **Resolvido**: Adicionamos `prisma generate` no build command

### Erro: "Cannot find module '@prisma/client'"
- Verifique se `postinstall` está executando: `npm run postinstall`
- Rode manualmente: `npx prisma generate`

### Erro: "ECONNREFUSED" ao acessar banco
- Verifique se `DATABASE_URL` está configurada na Vercel
- Verifique IP whitelist no MongoDB Atlas (deve ser `0.0.0.0/0`)
- Verifique se usuário do banco tem permissões corretas

### Erro 500 nas API Routes
- Verifique os logs da Vercel: Dashboard → Project → Deployments → [seu deploy] → Functions
- Verifique se todas as variáveis de ambiente estão configuradas
- Verifique se a connection string está correta (sem espaços, com password correto)

## Monitoramento

### Logs da Vercel
```bash
vercel logs [deployment-url]
```

### Logs do Prisma
Os logs estão configurados para aparecer no console da Vercel:
- ✅ Conexão estabelecida
- ❌ Erros ao conectar
- 📥 Dados recebidos
- ⚠️ Validações

## Comandos Úteis

```bash
# Testar build localmente
npm run build

# Testar produção localmente
npm run build && npm start

# Gerar Prisma Client manualmente
npx prisma generate

# Ver schema do Prisma
npx prisma db pull

# Ver dados no Prisma Studio (desenvolvimento)
npx prisma studio
```

## Performance

### Otimizações Implementadas
- ✅ Prisma Client singleton (evita múltiplas conexões)
- ✅ Server Components por padrão (menos JavaScript no cliente)
- ✅ Suspense boundaries para lazy loading
- ✅ Turbopack para builds mais rápidos
- ✅ MongoDB Atlas com índices automáticos

### Métricas Esperadas
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: > 90

## Segurança

### Checklist
- ✅ Senhas com bcrypt (10 salt rounds)
- ✅ Validação com Zod em todos endpoints
- ✅ ADMIN_KEY em variável de ambiente
- ✅ MongoDB com autenticação
- ✅ HTTPS obrigatório (Vercel)
- ✅ CORS configurado
- ⚠️ Rate limiting (implementar em Fase 2)

## Próximos Passos

### Fase 2
- [ ] Implementar AuthContext (JWT tokens)
- [ ] Rate limiting com Upstash
- [ ] Imagens otimizadas (Next.js Image)
- [ ] Analytics (Vercel Analytics)
- [ ] Error tracking (Sentry)

### Fase 3
- [ ] CDN para assets estáticos
- [ ] Edge Functions para APIs críticas
- [ ] Caching com Redis
- [ ] Monitoramento com Datadog
