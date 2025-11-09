import { NextRequest, NextResponse } from "next/server";
import prismaClientFactory from "@/config/prisma";
import crypto from "crypto";
import { gerarConviteSchema } from "@/lib/validations";

//rota para gerar convite para uma intenção aprovada

export async function POST(req: NextRequest) {
  const { prisma, connect } = prismaClientFactory();

  try {
    await connect();
    const body = await req.json();

    // Validar com Zod
    const validation = gerarConviteSchema.safeParse(body);

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: "Dados inválidos", details: errors },
        { status: 400 }
      );
    }

    const { intencaoId, auth } = validation.data;

    // Validar admin
    if (auth !== process.env.ADMIN_KEY) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Verificar se intenção existe
    const intencao = await prisma.intencao.findUnique({
      where: { id: intencaoId }
    });

    if (!intencao) {
      return NextResponse.json({ error: "Intenção não encontrada" }, { status: 404 });
    }

    // Gerar token único (8 caracteres)
    const token = crypto.randomBytes(4).toString("hex").toUpperCase();

    // Criar convite
    const convite = await prisma.convite.create({
      data: {
        token,
        intencaoId,
        usado: false,
      },
    });

    console.log("✅ Convite criado:", convite);

    // Gerar URL completa
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const url = `${baseUrl}/cadastro-final?token=${token}&id=${intencaoId}`;

    return NextResponse.json({
      token: convite.token,
      url,
      message: "Convite gerado com sucesso"
    });
  } catch (error) {
    console.error("❌ Erro ao gerar convite:", error);
    return NextResponse.json(
      {
        error: "Erro ao gerar convite",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}