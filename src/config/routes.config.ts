import { Request, Response, Router } from "express";

export class Routes {
    public router: Router = Router();
    constructor(){
        this.router.get('/flavio', (req: Request, res: Response) => {
            res.send('Souza')
        })
    }
}