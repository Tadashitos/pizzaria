import prismaClient from "../../prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

interface AuthRequest {
    email: string;
    password: string;
}

class AuthUserService {
    async execute({ email, password }: AuthRequest) {
        // Verificar se o e-mail existe
        const user = await prismaClient.user.findFirst({
            where: {
                email
            }
        })
        if(!user) throw new Error("Usuário ou senha incorretos")
        
        // Verificar se a senha que ele enviou está correta
        // Como a senha está criptografada, também devemos utilizar o bcryptJS pra fazer essa tratativa, mais especificamente o método compare
        const passwordMatch = await compare(password, user.password)
        if(!passwordMatch) throw new Error("Usuário ou senha incorretos")

        // Gerar um JWT e devolver os dados do usuário
        const token = sign(
            {
                name: user.name,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                subject: user.id,
                expiresIn: '30d'
            }
        )

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            token
        }
    }
}

export { AuthUserService }