import {NextResponse } from "next/server";
import prismaClientFactory from "@/config/prisma";

//rota para buscar todos os membros cadastrados
export async function GET() {
    const { prisma, connect } = prismaClientFactory();

    try {
        await connect();

        const membros = await prisma.member.findMany({
            select: {
                id: true,
                nome: true,
                email: true,
                empresa: true,
                cargo: true,
                telefone: true,
            },
            orderBy: { nome: "asc" },
        });

        return NextResponse.json(membros);
    } catch (error) {
        console.error("❌ Erro ao buscar membros:", error);
        return NextResponse.json(
            { error: "Erro ao buscar membros" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}