import { NextRequest, NextResponse } from "next/server";
import prismaClientFactory from "@/config/prisma";
import { criarIndicacaoSchema, getIndicacoesQuerySchema } from "@/lib/validations";

// Criar nova indicação
export async function POST(req: NextRequest) {
    const { prisma, connect } = prismaClientFactory();

    try {
        await connect();
        const body = await req.json();

        // Validar com Zod
        const validation = criarIndicacaoSchema.safeParse(body);

        if (!validation.success) {
            const errors = validation.error.flatten().fieldErrors;
            return NextResponse.json(
                { error: "Dados inválidos", details: errors },
                { status: 400 }
            );
        }

        const { membroIndicadorId, membroIndicadoId, empresaContato, descricao } = validation.data;

        // Criar indicação
        const indicacao = await prisma.indicacao.create({
            data: {
                membroIndicadorId,
                membroIndicadoId,
                empresaContato,
                descricao,
                status: "nova",
            },
            include: {
                membroIndicador: { select: { nome: true, email: true, empresa: true } },
                membroIndicado: { select: { nome: true, email: true, empresa: true } },
            },
        });

        console.log("✅ Indicação criada:", indicacao.id);

        return NextResponse.json({ success: true, indicacao }, { status: 201 });
    } catch (error) {
        console.error("❌ Erro ao criar indicação:", error);
        return NextResponse.json(
            {
                error: "Erro ao criar indicação",
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

// Listar indicações (feitas e recebidas)
export async function GET(req: NextRequest) {
    const { prisma, connect } = prismaClientFactory();

    try {
        await connect();
        const url = new URL(req.url);
        const membroId = url.searchParams.get("membroId");

        // Validar com Zod
        const validation = getIndicacoesQuerySchema.safeParse({ membroId });

        if (!validation.success) {
            const errors = validation.error.flatten().fieldErrors;
            return NextResponse.json(
                { error: "Parâmetro inválido", details: errors },
                { status: 400 }
            );
        }

        console.log("🔵 GET /api/indicacoes - Buscar indicações do membro:", validation.data.membroId);

        // Buscar indicações feitas
        const indicacoesFeitas = await prisma.indicacao.findMany({
            where: { membroIndicadorId: validation.data.membroId },
            include: {
                membroIndicado: { select: { nome: true, email: true, empresa: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        // Buscar indicações recebidas
        const indicacoesRecebidas = await prisma.indicacao.findMany({
            where: { membroIndicadoId: validation.data.membroId },
            include: {
                membroIndicador: { select: { nome: true, email: true, empresa: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        console.log(`✅ ${indicacoesFeitas.length} feitas, ${indicacoesRecebidas.length} recebidas`);

        return NextResponse.json({
            feitas: indicacoesFeitas,
            recebidas: indicacoesRecebidas,
        });
    } catch (error) {
        console.error("❌ Erro ao buscar indicações:", error);
        return NextResponse.json(
            { error: "Erro ao buscar indicações" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}