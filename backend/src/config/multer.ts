// Multer é uma lib middleware que ajuda a manipular arquivos do tipo multipart/form-data, usado primariamente para upload de arquivos
import multer from "multer";
import crypto from "crypto"; 
// Crypto é uma lib nativa do JS. Vamos utilizá-lo para criar hashs que evitem que arquivos de mesmo nome entrem em conflito

import { extname, resolve } from "path";

export default {
    upload(folder: string) {
        return {
            storage: multer.diskStorage({
                destination: resolve(__dirname, '..', '..', folder),
                filename: (request, file, callback) => {
                    const fileHash = crypto.randomBytes(16).toString("hex")
                    const filename = `${fileHash}-${file.originalname}`

                    return callback(null, filename)
                }
            })
        }
    }
}