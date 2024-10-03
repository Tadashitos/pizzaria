import express, { Request, Response, NextFunction } from 'express'
import 'express-async-errors' // Por orientação da própria lib, este import deve ser sempre o segundo import do arquivo
import cors from 'cors'
import path from 'path'

import { router } from './routes'

const app = express()

app.use(express.json())
app.use(cors())
app.use(router)
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp'))) // Criando uma rota estática para conseguir pegar a foto salva e exibir no navegador, por exemplo: "http://localhost:3333/files/{nome_da_foto}

// Configurando e tratando possíveis erros
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    if(error instanceof Error) {
        // Se for uma instância do tipo Error
        return res.status(400).json({ error: error.message })
    }

    return res.status(500).json({ status: 'error', message: 'Internal Server Error'})
})
 
app.listen(3333, () => console.log("Servidor online!!!"))