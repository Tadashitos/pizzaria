import prismaClient from "../../prisma";
import { hash } from "bcryptjs";
// Instalamos o bcryptJS, mas também instalamos seus types (@types/bcryptjs -D)

interface UserRequest {
    name: string;
    email: string;
    password: string;
}

class CreateUserService {
    async execute({ name, email, password }: UserRequest) {
        // Verificar se o usuário enviou um e-mail
        if(!email) {
            throw new Error("E-mail incorreto")
        }

        // Verificar se esse e-mail já está cadastrado na plataforma
        const userAlreadyExists = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        })

        if(userAlreadyExists) {
            throw new Error("Usuário já existe")
        }

        // Utilizando a lib bcryptJS
        const passwordHash = await hash(password, 8)

        const user = await prismaClient.user.create({
            data: {
                name,
                email,
                password: passwordHash
            },
            select: { // Esta propriedade seleciona o que você quer devolver para o usuário. Nunca devolva a senha!!!
                id: true,
                name: true,
                email: true
            }
        })

        return user
    }
}
 
export { CreateUserService }