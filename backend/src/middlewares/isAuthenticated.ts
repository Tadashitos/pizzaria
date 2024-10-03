import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface Payload {
    subject: string;
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    // Primeiro devemos receber o token
    const authToken = req.headers.authorization
    if(!authToken) {
        // Barrando o usuário não autorizado
        return res.status(401).end()
    }

    // Desconstruir o token
    const [, token] = authToken.split(" ") // Pegando o token somente, sem a palavra "bearer"
    
    try {
        // Validar esse token
        const { subject } = verify(token, process.env.JWT_SECRET) as Payload // "Afirmando" que iremos devolver o dado do tipo Payload

        // Criando uma variável (user_id) que ficará disponível toda vez que eu utilizar este req do tipo Request. Nesta variável ficará o id do token
        req.user_id = subject

        // OBS: Mas para fazer essa operação, você deve criar uma tipagem para o Request. Criamos uma pasta chamada "@types/express" e criamos um arquivo de tipagem dentro dessa pasta. Detalhe importante: todo nome de arquivo de tipagem deve ter a letra "d" antes da extensão do arquivo. Por exemplo: "index.d.ts". Depois de ter criado o arquivo de tipagem, você deve ir no arquivo do "tsconfig.json", descomentar a linha "typeRoots" e passar o caminho do arquivo de tipagem que você criou

        return next()
    } catch(e) {
        return res.status(401).end()
    }
}