import { NextRequest, NextResponse } from "next/server";
import prismaClientFactory from "@/config/prisma";
import { updateIndicacaoStatusSchema } from "@/lib/validations";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { prisma, connect } = prismaClientFactory();

    try {
        await connect();
        const { id } = await params;
        const body = await req.json();

        console.log("🔵 PATCH /api/indicacoes/:id - Atualizar status:", { id, body });

        // Validar com Zod
        const validation = updateIndicacaoStatusSchema.safeParse(body);

        if (!validation.success) {
            const errors = validation.error.flatten().fieldErrors;
            return NextResponse.json(
                { error: "Dados inválidos", details: errors },
                { status: 400 }
            );
        }

        const { status } = validation.data;

        // Atualizar indicação
        const indicacao = await prisma.indicacao.update({
            where: { id },
            data: { status },
            include: {
                membroIndicador: { select: { nome: true } },
                membroIndicado: { select: { nome: true } },
            },
        });

        console.log("✅ Status atualizado:", indicacao.status);

        return NextResponse.json({ success: true, indicacao });
    } catch (error) {
        console.error("❌ Erro ao atualizar indicação:", error);
        return NextResponse.json(
            { error: "Erro ao atualizar indicação" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}