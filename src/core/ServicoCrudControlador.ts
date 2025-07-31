import { isString } from "lodash";
import { DebugResponse } from "./DebugResponse";
import { CoreServicoCRUD } from "./ServicoCrud";

export class CoreServicoCRUDControlador extends CoreServicoCRUD {

    getConsultarRegistros = async (queryFilter: Object, queryPaginacao: Object) => {
        try {
            const resposta: any = await this.consultarRegistros(queryFilter, queryPaginacao)
            this.respostaSucesso(resposta)
        } catch (err) {
            this.respostaErro(err)
        }
    }

    getConsultarListaOpcoes = async (queryFilter: Object) => {
        try {
            const resposta: any = await this.consultarListaOpcoes(queryFilter)
            this.respostaSucesso(resposta)
        } catch (err) {
            this.respostaErro(err)
        }
    }

    getConsultarRegistro = async (paramsId: string) => {
        try {
            const resposta: any = await this.consultarRegistro(paramsId)
            this.respostaSucesso(resposta)
        } catch (err) {
            console.error('TESTANDO ==============', err)
            this.respostaErro(err)
        }
    }


    postInserirRegistro = async (body: Object) => {
        try {
            const resposta: any = await this.inserirRegistro(body)
            setTimeout(() => {
                this.respostaSucesso(resposta)
            }, 150)
        } catch (err) {
            console.error('DEU FUMO', err)
            if (err instanceof DebugResponse) err = err.response
            else if (!isString(err)) err = 'Não foi possível inserir o registro.'
            this.respostaErro(err)
        }
    }


    putAtualizarRegistro = async (paramsId: string, body: Object | any) => {
        try {
            body.id = paramsId
            const resposta: any = await this.atualizarRegistro(body)
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
            await this.removerRegistro(paramsId)
            this.respostaSucesso("Registro removido com sucesso.")
        } catch (erro) {
            if (erro instanceof DebugResponse) erro = erro.response
            else if (!isString(erro)) erro = 'Não foi possível remover o registro.'
            this.respostaErro(erro)
        }
    }

}