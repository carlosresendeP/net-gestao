import { NextRequest, NextResponse } from "next/server";
import { authSchema } from "@/lib/validations";

//rota para validar a senha de admin
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validar com Zod
        const validation = authSchema.safeParse(body);

        if (!validation.success) {
            const errors = validation.error.flatten().fieldErrors;
            return NextResponse.json(
                { valid: false, error: "Dados inválidos", details: errors },
                { status: 400 }
            );
        }

        const { senha } = validation.data;
        const senhaCorreta = process.env.ADMIN_KEY;



        if (senha === senhaCorreta) {

            return NextResponse.json({ valid: true }, { status: 200 });
        } else {

            return NextResponse.json({ valid: false }, { status: 401 });
        }
    } catch (error) {
        console.error("❌ Erro na validação:", error);
        return NextResponse.json({ valid: false }, { status: 500 });
    }
}
