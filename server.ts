import express, { Request, Response } from 'express'
import { AppDataSource } from './src/config/datasource.config';
import { CoreRoteador } from './src/core/Roteador';
import 'dotenv/config';
import cors from 'cors';
class Server {
    private app: express.Application;

    constructor() {
        this.app = express();
        this.app.use(express.json())
        this.app.use(cors())
        this.configuration();
        this.rotas();
    }

    configuration() {
        this.app.set("port", process.env.PORT || 3000)
    }

    async rotas() {
       let roteador: any = new CoreRoteador();
        this.app.use("/", roteador.rotas)
    }

    start() {
        AppDataSource.initialize()
        const port = this.app.get("port");
        this.app.listen(port, () => {
            console.info(`Server is listening ${port} port.`)
        })
    }
}
const server = new Server();
server.start()