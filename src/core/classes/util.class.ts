import { isEmpty } from "lodash";
import md5 from "md5";

export class Util {
    static encryptPassword(senha: string, salt: string = '') {
        if(isEmpty(salt)) salt = md5(String(new Date().getTime())).toString()
        senha = md5(`${salt}@${senha}`)
        return {senha, salt}
    }
}