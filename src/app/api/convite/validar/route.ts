import { NextRequest, NextResponse } from "next/server";
import prismaClientFactory from "@/config/prisma";

//rota para validar o token do convite
export async function GET(req: NextRequest) {
    const { prisma, connect } = prismaClientFactory();
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    const intencaoId = url.searchParams.get("id");

    console.log("🔵 GET /api/convite/validar chamada:", { token, intencaoId });

    if (!token) {
        console.log("❌ Token não fornecido");
        return NextResponse.json({ valid: false, reason: "token-ausente" }, { status: 400 });
    }

    try {
        await connect();

        const convite = await prisma.convite.findUnique({
            where: { token },
            include: { intencao: true }
        });

        console.log("Convite encontrado:", convite);

        if (!convite) {

            return NextResponse.json({ valid: false, reason: "inexistente" }, { status: 200 });
        }

        if (convite.usado) {

            return NextResponse.json({ valid: false, reason: "usado" }, { status: 200 });
        }

        // Se intencaoId foi fornecido, verificar compatibilidade
        if (intencaoId && convite.intencaoId !== intencaoId) {

            return NextResponse.json({ valid: false, reason: "incompativel" }, { status: 200 });
        }

        return NextResponse.json({
            valid: true,
            convite: {
                id: convite.id,
                token: convite.token,
            },
            intencao: convite.intencao ? {
                nome: convite.intencao.nome,
                email: convite.intencao.email,
                empresa: convite.intencao.empresa,
                motivo: convite.intencao.motivo,
            } : undefined,
        });
    } catch (error) {
        console.error("❌ Erro ao validar token:", error);
        return NextResponse.json(
            {
                error: "Erro ao validar token",
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
