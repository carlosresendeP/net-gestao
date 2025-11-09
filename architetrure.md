# Documentação de Arquitetura - Sistema de Gestão de Rede de Negócios

## 📋 Índice

1. Visão Geral
2. Arquitetura do Sistema
3. Módulos Funcionais
4. Modelo de Dados
5. APIs e Endpoints
6. Fluxos de Usuário
7. Segurança e Autenticação
8. Escalabilidade
9. Roadmap de Implementação

---

## 🎯 Visão Geral

### Propósito do Sistema

Sistema completo de gestão de rede de negócios focado em conectar profissionais, gerar oportunidades comerciais e acompanhar o desempenho de membros através de indicações, reuniões e métricas de performance.

### Objetivos Principais

- **Gestão eficiente de membros**: Desde a manifestação de interesse até a aprovação e cadastro completo
- **Facilitação de negócios**: Sistema robusto de indicações e acompanhamento de oportunidades
- **Engajamento contínuo**: Comunicação, check-in de reuniões e reconhecimento público
- **Métricas e performance**: Dashboards individuais e coletivos com KPIs relevantes
- **Controle financeiro**: Gestão automatizada de mensalidades

### Stack Tecnológica

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, TailwindCSS, Framer Motion
- **Backend**: Next.js API Routes (Serverless Functions)
- **Banco de Dados**: MongoDB com Prisma ORM
- **Autenticação**: bcrypt para hash de senhas + tokens únicos com crypto
- **Validação**: Zod para validação de schemas TypeScript
- **Deploy**: Vercel (Frontend + API) / MongoDB Atlas (Database)

---

## 🏗️ Arquitetura do Sistema

### Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE (Browser)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Público   │  │   Membros   │  │    Admin    │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
└─────────┼─────────────────┼─────────────────┼───────────────┘
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                ┌───────────▼───────────┐
                │   Next.js Frontend    │
                │   (App Router)        │
                └───────────┬───────────┘
                            │
                ┌───────────▼───────────┐
                │   Next.js API Routes  │
                │   (Server Functions)  │
                └───────────┬───────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌───────▼────────┐  ┌──────▼──────┐
│  Autenticação  │  │   Validações   │  │   Logs      │
│  bcrypt+crypto │  │   Zod          │  │   Console   │
└───────┬────────┘  └───────┬────────┘  └──────┬──────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                ┌───────────▼───────────┐
                │    Prisma ORM         │
                └───────────┬───────────┘
                            │
                ┌───────────▼───────────┐
                │   MongoDB Atlas       │
                │   (Database)          │
                └───────────────────────┘
```

### Camadas da Aplicação

#### 1. Camada de Apresentação (Frontend)
- **Responsabilidade**: Interface do usuário, validações client-side, gerenciamento de estado
- **Tecnologias**: Next.js, React, TailwindCSS, Framer Motion
- **Componentes principais**:
  - Páginas públicas (landing, cadastro de intenção)
  - Área de membros (dashboard, indicações, reuniões)
  - Painel administrativo (aprovações, relatórios, financeiro)

#### 2. Camada de API (Backend)
- **Responsabilidade**: Lógica de negócio, autenticação, validações server-side
- **Tecnologias**: Next.js API Routes, TypeScript
- **Módulos principais**:
  - Autenticação e autorização
  - CRUD de membros, indicações, reuniões
  - Geração de relatórios e métricas
  - Processamento de pagamentos

#### 3. Camada de Dados (Database)
- **Responsabilidade**: Persistência de dados, queries otimizadas, integridade referencial
- **Tecnologias**: MongoDB, Prisma ORM
- **Collections principais**:
  - Members, Intencoes, Convites
  - Indicacoes, Reunioes, CheckIns
  - Avisos, Obrigados, Mensalidades

---

## 📦 Módulos Funcionais

### 1. Gestão de Membros

#### 1.1 Formulário Público de Intenção
**Status**: ✅ Implementado

**Funcionalidades**:
- Formulário público acessível sem login
- Campos: Nome, Email, Empresa, Motivo
- Validação de email duplicado
- Estado de "Pendente" após submissão
- Mensagem de confirmação ao usuário

**Fluxo**:
```
Usuário → Preenche formulário → Validação → Salva Intenção (status: pendente)
→ Exibe card de sucesso → Aguarda aprovação admin
```

#### 1.2 Área de Gestão Admin
**Status**: ✅ Implementado

**Funcionalidades**:
- Login com chave de admin (ADMIN_KEY)
- Listagem de intenções pendentes
- Ações: Aprovar / Recusar
- Geração de convite (token único) após aprovação
- Simulação de envio de email (console.log)

**Fluxo de Aprovação**:
```
Admin login → Visualiza intenções → Aprova → Gera token/convite
→ Copia URL de cadastro → Envia para usuário (email simulado)
```

#### 1.3 Cadastro Completo de Membros
**Status**: ✅ Implementado

**Funcionalidades**:
- Acesso via link com token único
- Validação de token (existência, não usado, vinculado à intenção)
- Formulário completo: Nome, Email, Senha, Empresa, Cargo, Telefone
- Hash de senha com bcrypt (10 rounds)
- Criação de registro em `Member`
- Marca convite como "usado"
- Redirecionamento para área de membros

**Validações**:
- Token válido e não expirado
- Email não duplicado
- Senha mínima de 6 caracteres
- Todos os campos obrigatórios preenchidos

---

### 2. Comunicação e Engajamento

#### 2.1 Área de Avisos e Comunicados
**Status**: 🔄 A implementar

**Funcionalidades Planejadas**:
- CRUD de avisos (admin)
- Visualização de avisos (membros)
- Categorias: Urgente, Informativo, Evento
- Avisos fixados (pin)
- Histórico de avisos
- Notificação de novos avisos

**Modelo de Dados**:
```prisma
model Aviso {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  titulo      String
  conteudo    String
  categoria   String   // urgente, informativo, evento
  fixado      Boolean  @default(false)
  autorId     String   @db.ObjectId
  autor       Member   @relation(fields: [autorId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Endpoints**:
- `POST /api/avisos` - Criar aviso (admin)
- `GET /api/avisos` - Listar avisos (todos os membros)
- `PATCH /api/avisos/[id]` - Atualizar aviso (admin)
- `DELETE /api/avisos/[id]` - Deletar aviso (admin)

#### 2.2 Controle de Presença em Reuniões (Check-in)
**Status**: 🔄 A implementar

**Funcionalidades Planejadas**:
- Check-in via QR Code ou código único
- Registro de data/hora de presença
- Histórico de presenças por membro
- Estatísticas de participação
- Exportação de lista de presença

**Modelo de Dados**:
```prisma
model Reuniao {
  id          String     @id @default(auto()) @map("_id") @db.ObjectId
  titulo      String
  descricao   String?
  dataHora    DateTime
  local       String?
  codigoQR    String?    @unique
  ativa       Boolean    @default(true)
  createdAt   DateTime   @default(now())
  checkIns    CheckIn[]
}

model CheckIn {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  reuniaoId   String   @db.ObjectId
  membroId    String   @db.ObjectId
  dataHora    DateTime @default(now())
  reuniao     Reuniao  @relation(fields: [reuniaoId], references: [id])
  membro      Member   @relation(fields: [membroId], references: [id])

  @@unique([reuniaoId, membroId]) // Impede check-in duplicado
}
```

**Endpoints**:
- `POST /api/reunioes` - Criar reunião (admin)
- `POST /api/checkins` - Fazer check-in (membro)
- `GET /api/reunioes/[id]/presenca` - Lista de presença
- `GET /api/membros/[id]/presencas` - Histórico de presenças do membro

---

### 3. Geração de Negócios

#### 3.1 Sistema de Indicações
**Status**: ✅ Implementado

**Funcionalidades**:
- Membro cria indicação para outro membro
- Campos: Membro Indicado, Empresa/Contato, Descrição
- Status: Nova, Em Contato, Fechada, Recusada
- Visualização separada: Feitas vs Recebidas
- Atualização de status por qualquer parte envolvida

**Fluxo**:
```
Membro A → Cria indicação → Seleciona Membro B → Preenche oportunidade
→ Salva (status: nova) → Membro B visualiza → Atualiza status conforme progresso
```

**Endpoints Implementados**:
- `POST /api/indicacoes` - Criar indicação
- `GET /api/indicacoes?membroId=X` - Listar indicações (feitas + recebidas)
- `PATCH /api/indicacoes/[id]` - Atualizar status

#### 3.2 Avaliação e Acompanhamento
**Status**: ✅ Parcialmente implementado

**Funcionalidades Existentes**:
- Badges coloridos por status
- Botões de atualização de status
- Desabilitação de ações inválidas (ex: não pode marcar "fechada" se já está fechada)

**Melhorias Planejadas**:
- Campo de "Valor estimado" da oportunidade
- Data estimada de fechamento
- Notas/comentários privados
- Timeline de mudanças de status
- Notificações ao atualizar status

**Modelo de Dados Expandido**:
```prisma
model Indicacao {
  // ...campos existentes...
  valorEstimado    Decimal?
  dataEstimada     DateTime?
  notas            String?
  timeline         IndicacaoHistorico[]
}

model IndicacaoHistorico {
  id           String    @id @default(auto()) @map("_id") @db.ObjectId
  indicacaoId  String    @db.ObjectId
  statusAnterior String
  statusNovo   String
  alteradoPor  String    @db.ObjectId
  dataHora     DateTime  @default(now())
  observacao   String?
  indicacao    Indicacao @relation(fields: [indicacaoId], references: [id])
}
```

#### 3.3 Registro de "Obrigados"
**Status**: 🔄 A implementar

**Funcionalidades Planejadas**:
- Agradecimento público após negócio fechado
- Vinculado a uma indicação específica
- Exibição em feed/timeline da rede
- Possibilidade de incluir valor do negócio (opcional)
- Curtidas/reações de outros membros

**Modelo de Dados**:
```prisma
model Obrigado {
  id             String    @id @default(auto()) @map("_id") @db.ObjectId
  indicacaoId    String    @db.ObjectId
  membroAutorId  String    @db.ObjectId // Quem agradece
  membroDestinoId String   @db.ObjectId // Quem é agradecido
  mensagem       String
  valorNegocio   Decimal?
  publico        Boolean   @default(true)
  createdAt      DateTime  @default(now())
  
  indicacao      Indicacao @relation(fields: [indicacaoId], references: [id])
  autor          Member    @relation("ObrigadosFeitos", fields: [membroAutorId], references: [id])
  destino        Member    @relation("ObrigadosRecebidos", fields: [membroDestinoId], references: [id])
  reacoes        ObrigadoReacao[]
}

model ObrigadoReacao {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  obrigadoId  String   @db.ObjectId
  membroId    String   @db.ObjectId
  tipo        String   // like, celebrate, support
  createdAt   DateTime @default(now())
  
  obrigado    Obrigado @relation(fields: [obrigadoId], references: [id])
  membro      Member   @relation(fields: [membroId], references: [id])
  
  @@unique([obrigadoId, membroId]) // Um membro só pode reagir uma vez
}
```

**Endpoints**:
- `POST /api/obrigados` - Criar agradecimento
- `GET /api/obrigados` - Listar agradecimentos (feed público)
- `POST /api/obrigados/[id]/reacao` - Adicionar reação
- `GET /api/membros/[id]/obrigados` - Agradecimentos de um membro específico

---

### 4. Acompanhamento e Performance

#### 4.1 Controle de Reuniões 1:1
**Status**: 🔄 A implementar

**Funcionalidades Planejadas**:
- Agendamento de reuniões 1:1 entre membros
- Convite e confirmação
- Registro de pauta e notas pós-reunião
- Histórico de reuniões realizadas
- Lembretes automáticos

**Modelo de Dados**:
```prisma
model Reuniao1x1 {
  id              String    @id @default(auto()) @map("_id") @db.ObjectId
  membro1Id       String    @db.ObjectId
  membro2Id       String    @db.ObjectId
  dataHora        DateTime
  duracao         Int       // em minutos
  local           String?   // presencial ou link de videochamada
  pauta           String?
  notas           String?
  status          String    // agendada, confirmada, realizada, cancelada
  criadoPor       String    @db.ObjectId
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  membro1         Member    @relation("Reunioes1x1Membro1", fields: [membro1Id], references: [id])
  membro2         Member    @relation("Reunioes1x1Membro2", fields: [membro2Id], references: [id])
  criador         Member    @relation("Reunioes1x1Criadas", fields: [criadoPor], references: [id])
}
```

**Endpoints**:
- `POST /api/reunioes-1x1` - Criar reunião 1:1
- `GET /api/reunioes-1x1?membroId=X` - Listar reuniões do membro
- `PATCH /api/reunioes-1x1/[id]` - Atualizar status/notas
- `DELETE /api/reunioes-1x1/[id]` - Cancelar reunião

#### 4.2 Dashboards de Desempenho
**Status**: ✅ Parcialmente implementado (básico)

**Funcionalidades Existentes**:
- Cards com totais: Indicações Feitas, Recebidas, Fechadas

**Funcionalidades Planejadas**:

**Dashboard Individual**:
- Indicações por status (gráfico de pizza)
- Linha do tempo de indicações (últimos 6 meses)
- Taxa de conversão (fechadas / total)
- Valor total de negócios gerados
- Ranking de performance
- Check-ins em reuniões (% de presença)
- Reuniões 1:1 realizadas
- Agradecimentos recebidos

**Dashboard de Grupo**:
- Total de membros ativos
- Indicações por categoria/setor
- Top 10 membros (por indicações fechadas)
- Evolução mensal da rede
- Mapa de conexões (quem indica para quem)
- Saúde financeira (mensalidades em dia)

**Modelo de Dados para Métricas**:
```prisma
model MetricaMembro {
  id                    String   @id @default(auto()) @map("_id") @db.ObjectId
  membroId              String   @db.ObjectId @unique
  periodo               String   // YYYY-MM (mensal)
  indicacoesFeitas      Int      @default(0)
  indicacoesRecebidas   Int      @default(0)
  indicacoesFechadas    Int      @default(0)
  valorTotalGerado      Decimal  @default(0)
  presencaReunioes      Int      @default(0)
  reunioes1x1           Int      @default(0)
  obrigadosRecebidos    Int      @default(0)
  calculadoEm           DateTime @default(now())
  
  membro                Member   @relation(fields: [membroId], references: [id])
  
  @@unique([membroId, periodo])
}
```

**Endpoints**:
- `GET /api/dashboard/individual?membroId=X&periodo=2024-01` - Métricas individuais
- `GET /api/dashboard/grupo?periodo=2024-01` - Métricas do grupo
- `POST /api/dashboard/calcular` - Recalcular métricas (job agendado)

#### 4.3 Relatórios por Período
**Status**: 🔄 A implementar

**Funcionalidades Planejadas**:
- Filtros: Semanal, Mensal, Trimestral, Anual, Personalizado
- Exportação em PDF/Excel
- Comparação entre períodos
- Gráficos interativos (Chart.js / Recharts)

**Tipos de Relatórios**:
1. **Relatório de Indicações**: Total, por status, por membro
2. **Relatório Financeiro**: Receita, inadimplência, projeções
3. **Relatório de Engajamento**: Presenças, reuniões 1:1, novos membros
4. **Relatório Individual**: Desempenho de um membro específico

**Endpoints**:
- `GET /api/relatorios/indicacoes?inicio=YYYY-MM-DD&fim=YYYY-MM-DD`
- `GET /api/relatorios/financeiro?periodo=mensal&ano=2024`
- `GET /api/relatorios/engajamento?mes=01&ano=2024`
- `GET /api/relatorios/membro/[id]?periodo=trimestral`

---

### 5. Financeiro

#### 5.1 Módulo de Controle de Mensalidades
**Status**: 🔄 A implementar

**Funcionalidades Planejadas**:
- Cadastro de planos (valores, periodicidade)
- Geração automática de mensalidades (job mensal)
- Status: Pendente, Pago, Atrasado, Cancelado
- Integração com gateway de pagamento (Stripe/Mercado Pago)
- Envio de boletos/links de pagamento
- Notificações de vencimento
- Relatório de inadimplência
- Suspensão automática de membros inadimplentes

**Modelo de Dados**:
```prisma
model Plano {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  nome        String
  valor       Decimal
  periodicidade String // mensal, trimestral, anual
  ativo       Boolean  @default(true)
  createdAt   DateTime @default(now())
  membros     Member[]
}

model Mensalidade {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  membroId        String   @db.ObjectId
  planoId         String   @db.ObjectId
  mesReferencia   String   // YYYY-MM
  valor           Decimal
  dataVencimento  DateTime
  dataPagamento   DateTime?
  status          String   // pendente, pago, atrasado, cancelado
  metodoPagamento String?  // pix, boleto, cartao
  transacaoId     String?  // ID do gateway de pagamento
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  membro          Member   @relation(fields: [membroId], references: [id])
  plano           Plano    @relation(fields: [planoId], references: [id])
  
  @@unique([membroId, mesReferencia])
}

model Member {
  // ...campos existentes...
  planoId         String?  @db.ObjectId
  dataAdesao      DateTime @default(now())
  statusFinanceiro String  @default("ativo") // ativo, suspenso, cancelado
  
  plano           Plano?   @relation(fields: [planoId], references: [id])
  mensalidades    Mensalidade[]
}
```

**Endpoints**:
- `POST /api/mensalidades/gerar` - Gerar mensalidades do mês (admin/job)
- `GET /api/mensalidades?membroId=X` - Listar mensalidades de um membro
- `PATCH /api/mensalidades/[id]/pagar` - Registrar pagamento
- `GET /api/mensalidades/inadimplentes` - Listar inadimplentes (admin)
- `POST /api/mensalidades/webhook` - Webhook do gateway de pagamento

**Integração com Gateway de Pagamento**:
```typescript
// Exemplo: Stripe
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function criarPagamento(mensalidadeId: string) {
  const mensalidade = await prisma.mensalidade.findUnique({
    where: { id: mensalidadeId },
    include: { membro: true },
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: mensalidade.valor * 100, // centavos
    currency: 'brl',
    metadata: { mensalidadeId },
  });

  return paymentIntent.client_secret;
}
```

**Automações**:
1. **Job Mensal** (1º dia do mês): Gerar mensalidades para todos os membros ativos
2. **Job Diário**: Atualizar status para "atrasado" após vencimento
3. **Job Semanal**: Enviar lembretes de vencimento (3 dias antes)
4. **Webhook**: Atualizar status ao receber confirmação de pagamento

---

## 🗄️ Modelo de Dados Completo

### Schema Prisma Consolidado

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

// ============= GESTÃO DE MEMBROS =============

model Intencao {
  id        String    @id @default(auto()) @map("_id") @db.ObjectId
  nome      String
  email     String    @unique
  empresa   String?
  motivo    String
  status    String    @default("pendente") // pendente, aprovado, recusado
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  convites  Convite[]
}

model Convite {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  token       String    @unique
  intencaoId  String    @db.ObjectId
  usado       Boolean   @default(false)
  expiresAt   DateTime?
  createdAt   DateTime  @default(now())
  intencao    Intencao  @relation(fields: [intencaoId], references: [id])
}

model Member {
  id                   String              @id @default(auto()) @map("_id") @db.ObjectId
  nome                 String
  email                String              @unique
  password             String
  empresa              String?
  cargo                String?
  telefone             String?
  planoId              String?             @db.ObjectId
  dataAdesao           DateTime            @default(now())
  statusFinanceiro     String              @default("ativo")
  createdAt            DateTime            @default(now())
  updatedAt            DateTime            @updatedAt
  
  // Relações
  plano                Plano?              @relation(fields: [planoId], references: [id])
  indicacoesFeitas     Indicacao[]         @relation("IndicacoesFeitas")
  indicacoesRecebidas  Indicacao[]         @relation("IndicacoesRecebidas")
  checkIns             CheckIn[]
  avisos               Aviso[]
  obrigadosFeitos      Obrigado[]          @relation("ObrigadosFeitos")
  obrigadosRecebidos   Obrigado[]          @relation("ObrigadosRecebidas")
  reacoes              ObrigadoReacao[]
  reunioes1x1Membro1   Reuniao1x1[]        @relation("Reunioes1x1Membro1")
  reunioes1x1Membro2   Reuniao1x1[]        @relation("Reunioes1x1Membro2")
  reunioes1x1Criadas   Reuniao1x1[]        @relation("Reunioes1x1Criadas")
  mensalidades         Mensalidade[]
  metricas             MetricaMembro[]
}

// ============= COMUNICAÇÃO =============

model Aviso {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  titulo      String
  conteudo    String
  categoria   String   // urgente, informativo, evento
  fixado      Boolean  @default(false)
  autorId     String   @db.ObjectId
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  autor       Member   @relation(fields: [autorId], references: [id])
}

model Reuniao {
  id          String     @id @default(auto()) @map("_id") @db.ObjectId
  titulo      String
  descricao   String?
  dataHora    DateTime
  local       String?
  codigoQR    String?    @unique
  ativa       Boolean    @default(true)
  createdAt   DateTime   @default(now())
  checkIns    CheckIn[]
}

model CheckIn {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  reuniaoId   String   @db.ObjectId
  membroId    String   @db.ObjectId
  dataHora    DateTime @default(now())
  reuniao     Reuniao  @relation(fields: [reuniaoId], references: [id])
  membro      Member   @relation(fields: [membroId], references: [id])

  @@unique([reuniaoId, membroId])
}

// ============= GERAÇÃO DE NEGÓCIOS =============

model Indicacao {
  id                String               @id @default(auto()) @map("_id") @db.ObjectId
  membroIndicadorId String               @db.ObjectId
  membroIndicadoId  String               @db.ObjectId
  empresaContato    String
  descricao         String
  status            String               @default("nova")
  valorEstimado     Float?
  dataEstimada      DateTime?
  notas             String?
  createdAt         DateTime             @default(now())
  updatedAt         DateTime             @updatedAt

  membroIndicador   Member               @relation("IndicacoesFeitas", fields: [membroIndicadorId], references: [id])
  membroIndicado    Member               @relation("IndicacoesRecebidas", fields: [membroIndicadoId], references: [id])
  obrigados         Obrigado[]
  timeline          IndicacaoHistorico[]
}

model IndicacaoHistorico {
  id             String    @id @default(auto()) @map("_id") @db.ObjectId
  indicacaoId    String    @db.ObjectId
  statusAnterior String
  statusNovo     String
  alteradoPor    String
  dataHora       DateTime  @default(now())
  observacao     String?
  indicacao      Indicacao @relation(fields: [indicacaoId], references: [id])
}

model Obrigado {
  id              String           @id @default(auto()) @map("_id") @db.ObjectId
  indicacaoId     String           @db.ObjectId
  membroAutorId   String           @db.ObjectId
  membroDestinoId String           @db.ObjectId
  mensagem        String
  valorNegocio    Float?
  publico         Boolean          @default(true)
  createdAt       DateTime         @default(now())
  
  indicacao       Indicacao        @relation(fields: [indicacaoId], references: [id])
  autor           Member           @relation("ObrigadosFeitos", fields: [membroAutorId], references: [id])
  destino         Member           @relation("ObrigadosRecebidas", fields: [membroDestinoId], references: [id])
  reacoes         ObrigadoReacao[]
}

model ObrigadoReacao {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  obrigadoId  String   @db.ObjectId
  membroId    String   @db.ObjectId
  tipo        String
  createdAt   DateTime @default(now())
  
  obrigado    Obrigado @relation(fields: [obrigadoId], references: [id])
  membro      Member   @relation(fields: [membroId], references: [id])
  
  @@unique([obrigadoId, membroId])
}

// ============= PERFORMANCE =============

model Reuniao1x1 {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  membro1Id       String   @db.ObjectId
  membro2Id       String   @db.ObjectId
  dataHora        DateTime
  duracao         Int
  local           String?
  pauta           String?
  notas           String?
  status          String
  criadoPor       String   @db.ObjectId
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  membro1         Member   @relation("Reunioes1x1Membro1", fields: [membro1Id], references: [id])
  membro2         Member   @relation("Reunioes1x1Membro2", fields: [membro2Id], references: [id])
  criador         Member   @relation("Reunioes1x1Criadas", fields: [criadoPor], references: [id])
}

model MetricaMembro {
  id                  String   @id @default(auto()) @map("_id") @db.ObjectId
  membroId            String   @db.ObjectId
  periodo             String
  indicacoesFeitas    Int      @default(0)
  indicacoesRecebidas Int      @default(0)
  indicacoesFechadas  Int      @default(0)
  valorTotalGerado    Float    @default(0)
  presencaReunioes    Int      @default(0)
  reunioes1x1         Int      @default(0)
  obrigadosRecebidos  Int      @default(0)
  calculadoEm         DateTime @default(now())
  
  membro              Member   @relation(fields: [membroId], references: [id])
  
  @@unique([membroId, periodo])
}

// ============= FINANCEIRO =============

model Plano {
  id            String        @id @default(auto()) @map("_id") @db.ObjectId
  nome          String
  valor         Float
  periodicidade String
  ativo         Boolean       @default(true)
  createdAt     DateTime      @default(now())
  membros       Member[]
  mensalidades  Mensalidade[]
}

model Mensalidade {
  id              String    @id @default(auto()) @map("_id") @db.ObjectId
  membroId        String    @db.ObjectId
  planoId         String    @db.ObjectId
  mesReferencia   String
  valor           Float
  dataVencimento  DateTime
  dataPagamento   DateTime?
  status          String
  metodoPagamento String?
  transacaoId     String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  membro          Member    @relation(fields: [membroId], references: [id])
  plano           Plano     @relation(fields: [planoId], references: [id])
  
  @@unique([membroId, mesReferencia])
}
```

---

## 🔌 APIs e Endpoints

### Mapa Completo de Endpoints

#### Autenticação
- `POST /api/auth` - Validação admin
- `POST /api/membros/login` - Login de membro

#### Gestão de Membros
- `POST /api/intencoes` - Criar intenção (público)
- `GET /api/intencoes` - Listar intenções (admin)
- `PATCH /api/intencoes/[id]` - Atualizar status (admin)
- `POST /api/convite/gerar` - Gerar convite (admin)
- `GET /api/convite/validar` - Validar token
- `POST /api/convite/registrar` - Cadastro completo
- `GET /api/membros` - Listar membros

#### Indicações
- `POST /api/indicacoes` - Criar indicação
- `GET /api/indicacoes` - Listar indicações
- `PATCH /api/indicacoes/[id]` - Atualizar status

---

## 🔐 Segurança e Autenticação

### Estratégia de Autenticação

#### 1. Hash de Senhas com bcrypt
```typescript
import bcrypt from 'bcrypt';

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

#### 2. Tokens Únicos
- Geração via `crypto.randomBytes()`
- 8 caracteres hexadecimais (16 possibilidades⁸)
- Uso único (marcado após cadastro)
- Vinculado à intenção específica

#### 3. Validações
- Email único (não permite duplicados)
- Senha mínima de 6 caracteres
- Sanitização de inputs
- Proteção contra SQL injection (Prisma ORM)

#### 4. Controle de Acesso
- Área admin protegida com `ADMIN_KEY`
- Área de membros protegida por token
- Tokens armazenados no localStorage (frontend)
- Validação de token em cada requisição protegida

---

## 🚀 Escalabilidade

### Estratégias de Escalabilidade

#### 1. Arquitetura Serverless
- Next.js API Routes na Vercel (edge functions)
- Escala automaticamente conforme demanda
- Sem gerenciamento de servidores

#### 2. Otimização de Banco de Dados
**Indexes**:
```prisma
model Member {
  @@index([email])
  @@index([statusFinanceiro])
  @@index([createdAt])
}

model Indicacao {
  @@index([membroIndicadorId])
  @@index([membroIndicadoId])
  @@index([status])
  @@index([createdAt])
}
```

#### 3. Cache Strategy
- Cache de leitura para membros
- Invalidação ao criar/atualizar
- TTL configurável por endpoint

#### 4. Background Jobs
- Geração mensal de mensalidades (cron)
- Atualização de status atrasados (diário)
- Cálculo de métricas (semanal)

---

## 📊 Fluxos de Usuário

### 1. Fluxo Completo do Membro

```
Usuário acessa site → Formulário de intenção → Aprovação admin
→ Recebe link com token → Cadastro completo → Login
→ Dashboard → Cria/acompanha indicações → Reuniões → Métricas
```

### 2. Fluxo de Indicação

```
Membro A cria indicação → Seleciona Membro B → Descreve oportunidade
→ Status: Nova → Membro B visualiza → Entra em contato (status: Em Contato)
→ Negocia → Fecha negócio (status: Fechada) → Registra "Obrigado"
```

### 3. Fluxo Financeiro

```
1º dia do mês → Cron gera mensalidades → Envia notificação
→ Membro paga → Webhook confirma → Atualiza status: Pago
OU → Vence sem pagar → Status: Atrasado → 30 dias → Suspende membro
```

---

## 📅 Roadmap de Implementação

### Fase 1: MVP (4 semanas) ✅ Concluído

**Semana 1-2: Core Features**
- ✅ Gestão de Membros (intenção, aprovação, cadastro)
- ✅ Autenticação (login, hash de senha)
- ✅ Sistema de Indicações (criar, listar, atualizar status)

**Semana 3-4: Dashboard Básico**
- ✅ Dashboard individual (cards de estatísticas)
- ✅ Listagem de indicações feitas/recebidas
- ✅ Formulário de nova indicação

### Fase 2: Engajamento (4 semanas) 🔄 Próximo

**Semana 1: Comunicação**
- [ ] CRUD de avisos
- [ ] Notificações in-app
- [ ] Email notifications

**Semana 2: Reuniões**
- [ ] CRUD de reuniões
- [ ] Sistema de check-in
- [ ] Histórico de presenças

**Semana 3: Reuniões 1:1**
- [ ] Agendamento
- [ ] Confirmação/cancelamento
- [ ] Registro de notas

**Semana 4: Agradecimentos**
- [ ] Sistema de "obrigados"
- [ ] Feed público
- [ ] Reações/curtidas

### Fase 3: Analytics (3 semanas) 📋 Planejado

**Métricas, Relatórios e Visualizações**

### Fase 4: Financeiro (3 semanas) 📋 Planejado

**Setup, Automações e Gestão de Pagamentos**

### Fase 5: Otimizações (2 semanas) 📋 Planejado

**Performance e Monitoramento**

---

## 🎯 Variáveis de Ambiente

```env
# Database
DATABASE_URL="mongodb+srv://..."

# Autenticação
ADMIN_KEY="chave_secreta_admin"

# Email (futuro)
SENDGRID_API_KEY="SG.xxx"
EMAIL_FROM="noreply@sistema.com"

# Pagamento (futuro)
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"

# Monitoramento (futuro)
SENTRY_DSN="https://xxx@sentry.io/xxx"
```

---

## 📝 Conclusão

Este documento apresenta uma arquitetura robusta e escalável para um sistema completo de gestão de rede de negócios. A solução proposta:

✅ **Modular**: Funcionalidades desacopladas, facilitando manutenção  
✅ **Escalável**: Preparada para crescimento horizontal  
✅ **Segura**: Hash bcrypt, tokens únicos, validações rigorosas  
✅ **Performática**: Indexes otimizados, queries eficientes  
✅ **Observável**: Logs estruturados, monitoramento futuro  

**Stack Tecnológica Sólida**:
- Next.js 16 (SSR, API Routes, Serverless Functions)
- React 19 (componentes modernos com Server Actions)
- MongoDB + Prisma (NoSQL escalável + ORM type-safe)
- TypeScript (Type safety end-to-end)
- Zod (Validação robusta de dados)
- Vercel (Deploy contínuo, escalabilidade automática)

O roadmap está dividido em 5 fases incrementais, permitindo entregas rápidas de valor com MVPs validados antes de expandir funcionalidades.

---

**Autor**: Carlos
**Versão**: 2.0  
**Data**: Novembro 2025  
**Última Atualização**: 05/11/2025
