import { NextRequest, NextResponse } from "next/server";
import prismaClientFactory from "@/config/prisma";
import { intencaoSchema } from "@/lib/validations";



//rota cadastro de intenção no sistema 
export async function POST(request: NextRequest) {
  const { prisma, connect } = prismaClientFactory();

  try {
    await connect();

    const body = await request.json();
    console.log("📥 Dados recebidos:", body);

    // Validar com Zod
    const validation = intencaoSchema.safeParse(body);

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: "Dados inválidos", details: errors },
        { status: 400 }
      );
    }

    const { nome, email, empresa, motivo } = validation.data;

    // Verificar se já existe uma intenção com este email
    const intencaoExistente = await prisma.intencao.findFirst({
      where: { email }
    });

    if (intencaoExistente) {
      console.log("⚠️ Email já cadastrado nas intenções:", email);
      return NextResponse.json(
        { error: "Este email já possui uma intenção cadastrada" },
        { status: 400 }
      );
    }

    // Verificar se já existe um membro com este email
    const membroExistente = await prisma.member.findUnique({
      where: { email }
    });

    if (membroExistente) {
      console.log("⚠️ Email já cadastrado como membro:", email);
      return NextResponse.json(
        { error: "Este email já está cadastrado como membro" },
        { status: 400 }
      );
    }

    const intencao = await prisma.intencao.create({
      data: {
        nome,
        email,
        empresa: empresa || null,
        motivo,
      },
    });

    console.log("✅ Intenção criada:", intencao);

    return NextResponse.json(
      { message: "Intenção criada com sucesso", data: intencao },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Erro ao criar intenção:", error);
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}


//listar as intenções cadastradas no sistema
export async function GET(req: Request) {
  const { prisma, connect } = prismaClientFactory();
  const url = new URL(req.url);
  const auth = url.searchParams.get("auth");

  if (auth !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    await connect();
    const intencoes = await prisma.intencao.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(intencoes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao buscar intenções" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}