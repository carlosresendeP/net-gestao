import { NextRequest, NextResponse } from "next/server";
import prismaClientFactory from "@/config/prisma";

const { prisma } = prismaClientFactory();

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const auth = searchParams.get("auth");

        // Verificar autenticação admin
        if (auth !== process.env.ADMIN_KEY) {
            return NextResponse.json(
                { error: "Não autorizado" },
                { status: 401 }
            );
        }

        // Verificar se o membro existe
        const membroExistente = await prisma.member.findUnique({
            where: { id },
        });

        if (!membroExistente) {
            return NextResponse.json(
                { error: "Membro não encontrado" },
                { status: 404 }
            );
        }

        // Deletar indicações relacionadas ao membro
        await prisma.indicacao.deleteMany({
            where: {
                OR: [
                    { membroIndicadorId: id },
                    { membroIndicadoId: id },
                ],
            },
        });

        // Deletar o membro
        await prisma.member.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: "Membro deletado com sucesso",
        });
    } catch (error) {
        console.error("Erro ao deletar membro:", error);
        return NextResponse.json(
            { error: "Erro ao deletar membro" },
            { status: 500 }
        );
    }
}
