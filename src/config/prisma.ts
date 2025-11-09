import { PrismaClient } from "../../generated/prisma";

let prismaInstance: PrismaClient | null = null;

export default function prismaClientFactory() {
    if (!prismaInstance) {
        prismaInstance = new PrismaClient();
    }

    const prismaConnect = async () => {
        try {
            await prismaInstance!.$connect();
            console.log("✅ Conexão com o banco de dados estabelecida com sucesso.");
        } catch (error) {
            console.error("❌ Erro ao conectar ao banco de dados:", error);
            throw error;
        }
    }

    return { prisma: prismaInstance, connect: prismaConnect };
}

