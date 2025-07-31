import { Response, Request } from 'express';
import { isString } from 'lodash';
import { DebugResponse } from './DebugResponse';

export class CoreControlador<Service> {
    servico: any;
    requisicao: Request;
    resposta: Response;

    get instanciaServico(): Service {
        let instancia = new this.servico()
        instancia.requisicao = this.requisicao;
        instancia.resposta = this.resposta;
        return instancia;
    }
    
    respostaSucesso(resposta: any = null) {
        if (!resposta) {
            this.resposta.send('')
            return
        }
        if (isString(resposta)) resposta = { sucesso: resposta }
        this.resposta
            .status(200)
            .json(resposta)
    }
    respostaErro(resposta: any) {
        if (isString(resposta)) resposta = { erro: resposta }
        this.resposta
            .status(400)
            .json(resposta)
    }


    getConsultarRegistros = async (queryFilter: Object, queryPaginate: Object) => {
        try {
            //@ts-ignore
            const resposta = await this.instanciaServico.consultarRegistros(queryFilter, queryPaginate)
            this.respostaSucesso(resposta)
        } catch (err) {
            this.respostaErro(err)
        }
    }

    getConsultarListaOpcoes = async (queryFilter: Object) => {
        try {
            //@ts-ignore
            const resposta = await this.instanciaServico.consultarListaOpcoes(queryFilter)
            this.respostaSucesso(resposta)
        } catch (err) {
            this.respostaErro(err)
        }
    }

    getConsultarRegistro = async (paramsId: string) => {
        try {
            //@ts-ignore
            const resposta = await this.instanciaServico.consultarRegistro(paramsId)
            this.respostaSucesso(resposta)
        } catch (err) {
            console.error('TESTANDO ==============', err)
            this.respostaErro(err)
        }
    }


    postInserirRegistro = async (body: Object) => {
        try {
            //@ts-ignore
            const resposta = await this.instanciaServico.inserirRegistro(body)
            setTimeout(() => {
                this.respostaSucesso(resposta)
            }, 150)
        } catch (err) {
            console.error('DEU FUMO',err)
            if (err instanceof DebugResponse) err = err.response
            else if (!isString(err)) err = 'Não foi possível inserir o registro.'
            this.respostaErro(err)
        }
    }


    putAtualizarRegistro = async (paramsId: string, body: Object | any) => {
        try {
            body.id = paramsId
            //@ts-ignore
            const resposta = await this.instanciaServico.atualizarRegistro(body)
            this.respostaSucesso(resposta)
        } catch (err) {
            console.log('teste', err)
            if (err instanceof DebugResponse) err = err.response
            else if (!isString(err)) err = 'Não foi possível atualizar o registro.'
            this.respostaErro(err)
        }
    }


    deleteRemoverRegistro = async (paramsId: string) => {
        try {
            //@ts-ignore
            await this.instanciaServico.removerRegistro(paramsId)
            this.respostaSucesso("Registro removido com sucesso.")
        } catch (erro) {
            if (erro instanceof DebugResponse) erro = erro.response
            else if (!isString(erro)) erro = 'Não foi possível remover o registro.'
            this.respostaErro(erro)
        }
    }

}