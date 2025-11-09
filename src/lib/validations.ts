import { z } from "zod";


// SCHEMAS DE VALIDAÇÃO COM ZOD

// Helper: Validar ObjectId do MongoDB (24 caracteres hexadecimais)
const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "ID inválido");


// AUTENTICAÇÃO

//Schema para validação de senha de admin

export const authSchema = z.object({
    senha: z.string().min(1, "Senha é obrigatória"),
});

// Schema para validação de login de membros
export const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "Senha é obrigatória"),
});


// GESTÃO DE MEMBROS

// Schema para criação de intenção (cadastro público)
export const intencaoSchema = z.object({
    nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(100, "Nome muito longo"),
    email: z.string().email("Email inválido"),
    empresa: z.string().optional(),
    motivo: z.string().min(10, "Por favor, descreva melhor o motivo (mínimo 10 caracteres)").max(500, "Motivo muito longo"),
});

// Schema para atualização de intenção (admin)
export const updateIntencaoSchema = z.object({
    status: z.enum(["aprovado", "recusado", "pendente"], {
        message: "Status deve ser: aprovado, recusado ou pendente",
    }),
    auth: z.string().min(1, "Autenticação é obrigatória"),
});

// Schema para geração de convite (admin)
export const gerarConviteSchema = z.object({
    intencaoId: objectIdSchema,
    auth: z.string().min(1, "Autenticação é obrigatória"),
});

// Schema para registro de membro (uso do convite)
export const registroMembroSchema = z.object({
    token: z.string().min(8, "Token inválido").max(16, "Token inválido"),
    nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(100, "Nome muito longo"),
    email: z.string().email("Email inválido"),
    password: z
        .string()
        .min(6, "Senha deve ter no mínimo 6 caracteres")
        .max(50, "Senha muito longa"),
    empresa: z.string().max(100, "Nome da empresa muito longo").optional().nullable().transform(val => val || null),
    cargo: z.string().max(100, "Cargo muito longo").optional().nullable().transform(val => val || null),
    telefone: z
        .string()
        .optional()
        .nullable()
        .transform(val => val || null)
        .refine(
            (val) => !val || /^[\d\s\(\)\-]{10,15}$/.test(val),
            { message: "Telefone inválido" }
        ),
});


// SISTEMA DE INDICAÇÕES

// Schema para criação de indicação
export const criarIndicacaoSchema = z
    .object({
        membroIndicadorId: objectIdSchema,
        membroIndicadoId: objectIdSchema,
        empresaContato: z.string().min(2, "Nome da empresa muito curto").max(200, "Nome da empresa muito longo"),
        descricao: z.string().min(10, "Por favor, descreva melhor a oportunidade (mínimo 10 caracteres)").max(1000, "Descrição muito longa"),
    })
    .refine((data) => data.membroIndicadorId !== data.membroIndicadoId, {
        message: "Não é possível criar uma indicação para si mesmo",
        path: ["membroIndicadoId"],
    });

// Schema para atualização de status de indicação
export const updateIndicacaoStatusSchema = z.object({
    status: z.enum(["nova", "em_contato", "fechada", "recusada"], {
        message: "Status deve ser: nova, em_contato, fechada ou recusada",
    }),
});

// Schema para query de listagem de indicações
export const getIndicacoesQuerySchema = z.object({
    membroId: objectIdSchema,
});


// TIPOS TYPESCRIPT INFERIDOS
export type AuthInput = z.infer<typeof authSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type IntencaoInput = z.infer<typeof intencaoSchema>;
export type UpdateIntencaoInput = z.infer<typeof updateIntencaoSchema>;
export type GerarConviteInput = z.infer<typeof gerarConviteSchema>;
export type RegistroMembroInput = z.infer<typeof registroMembroSchema>;
export type CriarIndicacaoInput = z.infer<typeof criarIndicacaoSchema>;
export type UpdateIndicacaoStatusInput = z.infer<typeof updateIndicacaoStatusSchema>;
export type GetIndicacoesQueryInput = z.infer<typeof getIndicacoesQuerySchema>;
