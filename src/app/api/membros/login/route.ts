import { NextResponse } from "next/server";
import prismaClientFactory from "@/config/prisma";
import bcrypt from "bcrypt";
import { loginSchema } from "@/lib/validations";


//rota de login de membros 
export async function POST(req: Request) {
    const { prisma, connect } = prismaClientFactory();
    const body = await req.json();

    //validar campos
    try {
        await connect();

        // Validar com Zod
        const validation = loginSchema.safeParse(body);

        if (!validation.success) {
            const errors = validation.error.flatten().fieldErrors;
            return NextResponse.json(
                { error: "Dados inválidos", details: errors },
                { status: 400 }
            );
        }

        const { email, password } = validation.data;

        // Buscar membro pelo email
        const member = await prisma.member.findUnique({
            where: { email }
        });

        // Se o membro não for encontrado
        if (!member) {
            return NextResponse.json({ error: "Email ou senha incorretos" }, { status: 401 });
        }

        // Verificar se a senha está correta
        const senhaCorreta = await bcrypt.compare(password, member.password);

        // Se a senha estiver incorreta
        if (!senhaCorreta) {

            return NextResponse.json({ error: "Email ou senha incorretos" }, { status: 401 });
        }

        console.log("✅ Login bem-sucedido:", email);

        // Buscar a intenção pelo email do membro
        const intencao = await prisma.intencao.findFirst({
            where: { email: member.email }
        });

        if (!intencao) {
            return NextResponse.json({ error: "Intenção não encontrada" }, { status: 404 });
        }

        // Buscar o convite associado à intenção
        const convite = await prisma.convite.findFirst({
            where: {
                intencaoId: intencao.id,
                usado: true // O convite já deve ter sido usado no cadastro final
            }
        });

        if (!convite) {
            return NextResponse.json({ error: "Convite não encontrado" }, { status: 404 });
        }

        console.log("🔑 Token do convite:", convite.token);

        // Retornar dados do membro (exceto a senha) e o token do convite
        return NextResponse.json({
            success: true,
            token: convite.token,
            member: {
                id: member.id,
                nome: member.nome,
                email: member.email,
                empresa: member.empresa,
                cargo: member.cargo,
                telefone: member.telefone,
            }
        });
    } catch (error) {
        console.error("❌ Erro ao fazer login:", error);

        return NextResponse.json({
            error: "Erro ao fazer login",
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
