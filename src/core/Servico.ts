import { Request, Response } from "express"
import { get, isString } from "lodash";
import { AppDataSource } from "../config/datasource.config";
import { environment } from "../environment/environment";

export class CoreServico {
    requisicao: Request;
    resposta: Response;
    modelo: any;
    manager = AppDataSource.manager


    respostaSucesso(response: any) {
        if (isString(response)) response = { success: response }
        this.resposta
            .status(200)
            .json(response)
    }
    respostaErro(response: any) {
        if (isString(response)) response = { error: response }
        this.resposta
            .status(400)
            .json(response)
    }

    body(index: any = null, value: any = null) {
        const body = get(this.requisicao, 'body', {})
        if (index) return get(body, index, value)
        return body
    }

    query(index: any = null, value: any = null) {
        if (index) return get(this.requisicao.query, index, value)
        return this.requisicao.query
    }

    param(index: any = null, value: any = null) {
        if (index) return get(this.requisicao.params, index, value)
        return this.requisicao.params
    }

    header(index: any = null, value: any = null) {
        console.log('TESTANDO', this.requisicao)
        if (index) {
            return get(this.requisicao.headers, index, value)
        }
        return this.requisicao.headers
    }

    get usuario(){
        const jwt = require('jsonwebtoken');
        const userToken = this.requisicao.headers.authorization?.split(' ').pop()

        return jwt.verify(userToken, environment.jwtPrivateKey);
    }

    get idUsuario() {
        return this.usuario.id
    }

    get idInstancia() {
        return this.usuario.instancia.id
    }

}