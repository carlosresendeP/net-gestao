import { describe, it, expect } from 'vitest';
import {
    intencaoSchema,
    loginSchema,
    criarIndicacaoSchema
} from '@/lib/validations';

describe('Validações Zod', () => {
    describe('intencaoSchema', () => {
        it('deve validar dados corretos de intenção', () => {
            const data = {
                nome: 'João Silva',
                email: 'joao@example.com',
                telefone: '(11) 98765-4321',
                motivo: 'Quero participar da rede',
            };

            const result = intencaoSchema.safeParse(data);
            expect(result.success).toBe(true);
        });

        it('deve rejeitar nome muito curto', () => {
            const data = {
                nome: 'Jo',
                email: 'joao@example.com',
                telefone: '(11) 98765-4321',
                motivo: 'Quero participar',
            };

            const result = intencaoSchema.safeParse(data);
            expect(result.success).toBe(false);
        });

        it('deve rejeitar email inválido', () => {
            const data = {
                nome: 'João Silva',
                email: 'email-invalido',
                telefone: '(11) 98765-4321',
                motivo: 'Quero participar',
            };

            const result = intencaoSchema.safeParse(data);
            expect(result.success).toBe(false);
        });
    });

    describe('loginSchema', () => {
        it('deve validar credenciais corretas', () => {
            const data = {
                email: 'usuario@example.com',
                password: 'Senha@123',
            };

            const result = loginSchema.safeParse(data);
            expect(result.success).toBe(true);
        });

        it('deve rejeitar email inválido', () => {
            const data = {
                email: 'email-invalido',
                password: 'Senha@123',
            };

            const result = loginSchema.safeParse(data);
            expect(result.success).toBe(false);
        });
    });

    describe('criarIndicacaoSchema', () => {
        it('deve validar indicação válida', () => {
            const data = {
                membroIndicadorId: '507f1f77bcf86cd799439011',
                membroIndicadoId: '507f1f77bcf86cd799439012',
                empresaContato: 'Empresa ABC',
                descricao: 'Descrição detalhada da oportunidade de negócio',
            };

            const result = criarIndicacaoSchema.safeParse(data);
            expect(result.success).toBe(true);
        });

        it('deve rejeitar auto-indicação', () => {
            const data = {
                membroIndicadorId: '507f1f77bcf86cd799439011',
                membroIndicadoId: '507f1f77bcf86cd799439011', // Mesmo ID
                empresaContato: 'Empresa ABC',
                descricao: 'Tentando se auto-indicar com descrição válida',
            };

            const result = criarIndicacaoSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toContain('si mesmo');
            }
        });
    });
});
