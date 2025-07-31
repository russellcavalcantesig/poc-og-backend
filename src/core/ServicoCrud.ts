import { cloneDeep, get, isString, omit } from "lodash";
import { AppDataSource } from "../config/datasource.config";
import { CoreServico } from "./Servico";

export class CoreServicoCRUD extends CoreServico {


    constructor(requisicao: any = null, resposta: any = null){
        super();
        this.requisicao = requisicao
        this.resposta = resposta
    }

    campoExiste(campo: string) {
        return Object.keys(AppDataSource.getMetadata(this.modelo).propertiesMap).includes(campo)
    }

    /* FIND ALL */
    _consultarRegistros_Campos = {}
    async _consultarRegistros_Filtro(filter: Object) {
        return {}
    }
    _consultarRegistros_Ordenacao: any = { nome: 'ASC', criadoEm: 'DESC' }

    async _consultarRegistros_Formatacao(registros: Array<Object>) {
        return registros
    }

    async _consultarRegistros(filtro: Object, paginacao: Object) {
        let ordenacao = this._consultarRegistros_Ordenacao;
        Object.keys(this._consultarRegistros_Ordenacao).forEach((campo: string) => {
            if (!this.campoExiste(campo)) delete ordenacao[campo]
        })
        const where = await this._consultarRegistros_Filtro(filtro);
        const options: any = {
            where,
            ...paginacao,
            order: ordenacao,
            select: this._consultarRegistros_Campos
        }
        return this.manager.findAndCount(this.modelo, options)
    }


    consultarRegistros = async (filtro: Object, paginacao: Object) => {
        const take = parseInt(get(paginacao, 'linhas', 10))
        const skip = (get(paginacao, 'pagina', 1) - 1) * take
        const objetoPaginacao = { take, skip }

        let [documents, count] = await this._consultarRegistros(filtro, objetoPaginacao)
        documents = await this._consultarRegistros_Formatacao(documents)
        return { registros: documents, total: count }
    }

    /* FIND BY ID */
    _consultarRegistro_Campos = {}
    _consultarRegistro_CamposOcultos: any = []
    _consultarRegistro_Filtro(id: string) {
        return { id }
    }
    async _consultarRegistro_Formatacao(registro: any) {
        return registro
    }
    _consultarRegistro(id: string) {
        const opcoes: any = {
            where: this._consultarRegistro_Filtro(id),
            select: this._consultarRegistro_Campos
        }
        return this.manager.findOne(this.modelo, opcoes)
    }
    consultarRegistro = async (id: string) => {
        let registro = await this._consultarRegistro(id)
        registro = omit(registro, this._consultarRegistro_CamposOcultos)
        registro = await this._consultarRegistro_Formatacao(registro)
        return registro
    }

    private instanciaModelo(corpo: Object | any, instanciaModelo: any = null) {
        const campos = Object.keys(corpo)
        if (!instanciaModelo) instanciaModelo = new this.modelo()
        for (let i = 0; i < campos.length; i++) {
            const campo: any = campos[i]
            instanciaModelo[campo] = corpo[campo]
        }
        return instanciaModelo
    }


    /* FIND ALL OPTIONS */
    _consultarListaOpcoes_Campos: any = { id: true, nome: true }
    _consultarListaOpcoes_Filtro(filtro: Object) {
        return {}
    }
    _consultarListaOpcoes_Ordenacao: any = { nome: 'ASC', criadoEm: 'DESC' }

    _consultarListaOpcoes(filtro: Object) {
        let ordenacao = this._consultarListaOpcoes_Ordenacao;
        let campos = this._consultarListaOpcoes_Campos
        Object.keys(this._consultarRegistros_Ordenacao).forEach((field: string) => {
            if (!this.campoExiste(field)) {
                delete ordenacao[field]
                delete campos[field]
            }
        })
        const opcoes: any = {
            where: this._consultarListaOpcoes_Filtro(filtro),
            order: ordenacao,
            select: campos
        }
        return this.manager.find(this.modelo, opcoes)
    }
    async _consultarListaOpcoesFormat(registros: any) {
        return registros.map((option: any) => {
            return { codigo: option.id, opcao: get(option, 'nome', 'SEM LABEL DEFINIDA') }
        })
    }

    consultarListaOpcoes = async (filtro: Object) => {
        let registros = await this._consultarListaOpcoes(filtro)
        registros = await this._consultarListaOpcoesFormat(registros)
        return registros
    }


    async _inserirRegistro_Validacao(body: Object) {

    }
    async _inserirRegistro_Sanitizacao(body: Object | any) {
        return body;
    }
    async _inserirRegistro_ExecutarAntes(registro: any) {
        return registro;
    }
    async _inserirRegistro_ExecutarApos(registro: any) {
        
    }

    inserirRegistro = async (registro: Object | any) => {
        registro = cloneDeep(registro)
        registro = await this._inserirRegistro_ExecutarAntes(registro)

        const count = await this.manager.count(this.modelo, { where: { id: registro.id } })
        if (count > 0) throw `Já existe um registro com o id "${registro.id}"`

        await this._inserirRegistro_Validacao(registro)
        registro = await this._inserirRegistro_Sanitizacao(registro)
        registro = this.removerAuditoria(registro)
        registro.criadoEm = new Date()
        registro.criadoPor = this.idUsuario;

        if (this.campoExiste('idInstancia')) registro.idInstancia = this.idInstancia

        
        const instanciaModelo = this.instanciaModelo(registro)

        await this.manager.save(instanciaModelo)
        await this._inserirRegistro_ExecutarApos(registro)
        return registro;
    }



    async _atualizarRegistro_Validacao(document: Object, documentFromDB: any = null) {

    }
    async _atualizarRegistro_Sanitizacao(document: Object | any) {
        return document;
    }
    async _atualizarRegistro_ExecutarAntes(registro: any) {
        return registro;
    }
    async _atualizarRegistro_ExecutarApos(registro: any) {

    }

    atualizarRegistro = async (registro: Object | any) => {
        registro = cloneDeep(registro)
        let instanciaModelo = await this.manager.findOne(this.modelo, { where: { id: registro.id } })
        if (!instanciaModelo) throw `Não existe um registro com o id "${registro.id}"`
        
        registro = await this._atualizarRegistro_ExecutarAntes(registro)

        await this._atualizarRegistro_Validacao(registro, instanciaModelo)
        registro = await this._atualizarRegistro_Sanitizacao(registro)
        registro = this.removerAuditoria(registro)
        registro.atualizadoEm = new Date()
        registro.atualizadoPor = this.idUsuario;
        const temIdInstancia = this.campoExiste('idInstancia');
        if (this.campoExiste('idInstancia')) registro.idInstancia = this.idInstancia
        

        instanciaModelo = this.instanciaModelo(registro, instanciaModelo)
        await this.manager.save(instanciaModelo)
        await this._atualizarRegistro_ExecutarApos(registro)
        return registro;

    }




    async _removerRegistro_Validacao(registro: any) {

    }

    async _removerRegistro_ExecutarAntes(registro: any) {

    }
    async _removerRegistro_ExecutarApos(registro: any) {

    }

    removerRegistro = async (id: string) => {

        let instanciaModelo: any = await this.manager.findOne(this.modelo, { where: { id: id } })
        if (!instanciaModelo) throw `Não existe um registro com o id "${id}"`

        await this._removerRegistro_Validacao(instanciaModelo)
        await this._removerRegistro_ExecutarAntes(instanciaModelo)
        await this.manager.remove(instanciaModelo)
        await this._removerRegistro_ExecutarApos(instanciaModelo)

    }

    async salvarRegistrosAuxiliares(campo: any, valor: any, lista: any = []) {
        if(!lista) return
        let where: any = {}
        where[campo] = valor;
        let ids: any = await this.manager.find(this.modelo, { where, select: { id: true } })
        ids = ids.map((i: any) => i.id)

        const remover = ids.filter((id: any) => !lista.find((item: any) => item.id == id))
        const inserir = lista.filter((item: any) => !ids.includes(item.id))
        const atualizar = lista.filter((item: any) => ids.includes(item.id))

        for (let i = 0; i < remover.length; i++) {
            const id = remover[i]
            await this.removerRegistro(id)
        }

        for (let i = 0; i < inserir.length; i++) {
            let item = inserir[i]
            item[campo] = valor;
            await this.inserirRegistro(item)
        }

        for (let i = 0; i < atualizar.length; i++) {
            const item = atualizar[i]
            await this.atualizarRegistro(item)
        }
    }

    removerAuditoria(registro: any){
        const campos = ['criadoEm', 'criadoPor', 'atualizadoEm', 'atualizadoPor']
        campos.forEach(campo => {
            delete registro[campo]
        })
        return registro
    }

}