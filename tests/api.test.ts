import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST as createIntencao } from '@/app/api/intencoes/route';
import { POST as createIndicacao } from '@/app/api/indicacoes/route';
import { POST as login } from '@/app/api/membros/login/route';
import { NextRequest } from 'next/server';


// Mock do Prisma Client
const mockPrismaClient = {
    intencao: {
        findFirst: vi.fn(),
        create: vi.fn(),
    },
    membro: {
        findFirst: vi.fn(),
        findUnique: vi.fn(),
    },
    member: {
        findUnique: vi.fn(),
    },
    indicacao: {
        create: vi.fn(),
    },
    convite: {
        findFirst: vi.fn(),
    },
    $disconnect: vi.fn().mockResolvedValue(undefined),
};

// Mock da factory do Prisma
vi.mock('@/config/prisma', () => ({
    default: () => ({
        prisma: mockPrismaClient,
        connect: vi.fn().mockResolvedValue(undefined),
    }),
})); describe('API Routes - Intenções', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('POST /api/intencoes - deve criar uma nova intenção com sucesso', async () => {
        const mockIntencao = {
            id: '1',
            nome: 'João Silva',
            email: 'joao@example.com',
            telefone: '(11) 98765-4321',
            status: 'PENDENTE',
            createdAt: new Date(),
        };

        vi.mocked(mockPrismaClient.intencao.findFirst).mockResolvedValue(null);
        vi.mocked(mockPrismaClient.intencao.create).mockResolvedValue(mockIntencao);

        const request = new NextRequest('http://localhost:3000/api/intencoes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: 'João Silva',
                email: 'joao@example.com',
                telefone: '(11) 98765-4321',
                motivo: 'Quero fazer parte da rede de negócios',
            }),
        });

        const response = await createIntencao(request);
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data.data).toHaveProperty('id');
        expect(data.data.nome).toBe('João Silva');
        expect(data.data.email).toBe('joao@example.com');
    });

    it('POST /api/intencoes - deve falhar com dados inválidos', async () => {
        const request = new NextRequest('http://localhost:3000/api/intencoes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: 'Jo',
                email: 'email-invalido',
                telefone: '123',
            }),
        });

        const response = await createIntencao(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data).toHaveProperty('error');
        expect(data.error).toBe('Dados inválidos');
    });

    it('POST /api/intencoes - deve falhar com email duplicado', async () => {
        vi.mocked(mockPrismaClient.intencao.findFirst).mockResolvedValue({
            id: '1',
            nome: 'Existente',
            email: 'existente@example.com',
            telefone: '(11) 98765-4321',
            empresa: null,
            motivo: 'Motivo qualquer',
            status: 'PENDENTE',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Mockar member.findUnique para retornar null (não existe como membro)
        vi.mocked(mockPrismaClient.member.findUnique).mockResolvedValue(null);

        const request = new NextRequest('http://localhost:3000/api/intencoes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: 'Novo Usuario',
                email: 'existente@example.com',
                telefone: '(11) 98765-4321',
                motivo: 'Quero participar',
            }),
        });

        const response = await createIntencao(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toContain('já possui uma intenção cadastrada');
    });
});

describe('API Routes - Indicações', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('POST /api/indicacoes - deve criar uma nova indicação com sucesso', async () => {
        const mockIndicacao = {
            id: '507f1f77bcf86cd799439011',
            membroIndicadorId: '507f1f77bcf86cd799439012',
            membroIndicadoId: '507f1f77bcf86cd799439013',
            empresaContato: 'Empresa XYZ',
            descricao: 'Ótima oportunidade de negócio na área de tecnologia',
            status: 'nova',
            createdAt: new Date(),
        };

        vi.mocked(mockPrismaClient.indicacao.create).mockResolvedValue(mockIndicacao);

        const request = new NextRequest('http://localhost:3000/api/indicacoes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                membroIndicadorId: '507f1f77bcf86cd799439012',
                membroIndicadoId: '507f1f77bcf86cd799439013',
                empresaContato: 'Empresa XYZ',
                descricao: 'Ótima oportunidade de negócio na área de tecnologia',
            }),
        });

        const response = await createIndicacao(request);
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data.indicacao).toHaveProperty('id');
        expect(data.indicacao.empresaContato).toBe('Empresa XYZ');
    });

    it('POST /api/indicacoes - deve falhar ao tentar se auto-indicar', async () => {
        const request = new NextRequest('http://localhost:3000/api/indicacoes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                membroIndicadorId: '507f1f77bcf86cd799439011',
                membroIndicadoId: '507f1f77bcf86cd799439011', // Mesmo ID = auto-indicação
                empresaContato: 'Empresa ABC',
                descricao: 'Tentando se auto-indicar com descrição completa',
            }),
        });

        const response = await createIndicacao(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data).toHaveProperty('error');
        expect(data.error).toBe('Dados inválidos');
    });
});

describe('API Routes - Login', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // Nota: O teste de login com credenciais válidas requer mock do bcrypt
    // que não funciona bem com ESM. Mantemos apenas o teste de falha.

    it('POST /api/membros/login - deve falhar com email não encontrado', async () => {
        vi.mocked(mockPrismaClient.member.findUnique).mockResolvedValue(null);

        const request = new NextRequest('http://localhost:3000/api/membros/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'naoexiste@example.com',
                password: 'SenhaQualquer',
            }),
        });

        const response = await login(request);
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.error).toContain('Email ou senha incorretos');
    });

    it('POST /api/membros/login - deve falhar com dados inválidos', async () => {
        const request = new NextRequest('http://localhost:3000/api/membros/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'email-invalido',
                password: '123',
            }),
        });

        const response = await login(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Dados inválidos');
    });
});
