import { NextResponse } from "next/server";
import prismaClientFactory from "@/config/prisma";
import bcrypt from "bcrypt";
import { registroMembroSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const { prisma, connect } = prismaClientFactory();
  const body = await req.json();

  try {
    await connect();

    console.log("📝 Dados recebidos:", { ...body, password: "[OCULTO]" });

    // Validar com Zod
    const validation = registroMembroSchema.safeParse(body);

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: "Dados inválidos", details: errors },
        { status: 400 }
      );
    }

    const { token, nome, email, empresa, cargo, telefone, password } = validation.data;

    const convite = await prisma.convite.findUnique({ where: { token } });
    console.log("🔑 Convite encontrado:", convite);

    if (!convite || convite.usado) {
      return NextResponse.json({ error: "Token inválido ou já utilizado" }, { status: 400 });
    }

    // Verificar se o email já existe
    const emailExistente = await prisma.member.findUnique({
      where: { email }
    });

    if (emailExistente) {
      console.log("⚠️ Email já cadastrado:", email);
      return NextResponse.json({ error: "Este email já está cadastrado" }, { status: 400 });
    }

    // Gerar hash da senha (bcrypt cria um hash seguro com salt automático)
    const hashedPassword = await bcrypt.hash(password, 10);


    // Registrar novo membro
    const member = await prisma.member.create({
      data: {
        nome,
        email,
        password: hashedPassword,
        empresa: empresa || null,
        cargo: cargo || null,
        telefone: telefone || null
      },
    });
    console.log("✅ Membro criado:", member);

    // Marcar convite como usado
    await prisma.convite.update({
      where: { token },
      data: { usado: true },
    });
    console.log("✅ Convite marcado como usado");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Erro ao registrar:", error);

    // Log detalhado do erro
    if (error instanceof Error) {
      console.error("❌ Mensagem:", error.message);
      console.error("❌ Stack:", error.stack);
    }

    return NextResponse.json({
      error: "Erro ao registrar membro",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}