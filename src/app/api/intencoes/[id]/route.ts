import { NextRequest, NextResponse } from "next/server";
import prismaClientFactory from "@/config/prisma";
import { randomUUID } from "crypto";
import { updateIntencaoSchema } from "@/lib/validations";
//Patch=> atualizar o status da intenção (aprovado ou recusado)

//rota atualizar o status da intenção
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { prisma, connect } = prismaClientFactory();
    const { id } = await params;
    const body = await req.json();

    try {
        await connect();

        // Validar com Zod
        const validation = updateIntencaoSchema.safeParse(body);

        if (!validation.success) {
            const errors = validation.error.flatten().fieldErrors;
            return NextResponse.json(
                { error: "Dados inválidos", details: errors },
                { status: 400 }
            );
        }

        const { status, auth } = validation.data;

        //validar autenticação
        if (auth !== process.env.ADMIN_KEY) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const updated = await prisma.intencao.update({
            where: { id: id },
            data: { status },
        });

        if (status === "aprovado") {
            const token = randomUUID();

            const convite = await prisma.convite.create({
                data: { token, intencaoId: updated.id },

            });


            const link = `${process.env.NEXT_PUBLIC_BASE_URL}/cadastro?token=${token}`;
            console.log("📨 Link de convite gerado:", convite, link);
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error("❌ Erro ao atualizar intenção:", error);
        return NextResponse.json(
            {
                error: "Erro ao atualizar intenção",
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}