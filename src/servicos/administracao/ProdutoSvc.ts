import { get } from "lodash";
import { CoreServicoCRUD } from "../../core/ServicoCrud";
import { Produto } from "../../modelos/administracao/Produto";
import { In, Like } from "typeorm";
import { CoreServicoCRUDControlador } from "../../core/ServicoCrudControlador";
import { FabricanteSvc } from "./FabricanteSvc";

export class ProdutoSvc extends CoreServicoCRUDControlador {
    modelo: any = Produto;

    async _consultarRegistros_Filtro(filter: any): Promise<any> {

        filter = filter || {}
        
        let where: any = {}
        if (filter.codigoSku) where.codigoSku = Like(`%${filter.codigoSku}%`)
        if (filter.codigoEan) where.codigoEan = Like(`%${filter.codigoEan}%`)
        if (filter.nome) where.nome = Like(`%${filter.nome}%`)
        if (filter.observacao) where.observacao = Like(`%${filter.observacao}%`)

        if (filter.estoque) {
            let condicao = 'p.estoque > p.estoque_minimo'
            if(filter.estoque == 1) condicao = 'p.estoque = p.estoque_minimo'
            else if(filter.estoque == 0) condicao = 'p.estoque < p.estoque_minimo'
            const ids = await this.manager.query(`SELECT id FROM produto p WHERE ${condicao}`);
            console.log(ids.map((item: any) => item.id))
            where.id = In(ids.map((item: any) => item.id));
        }

        return where
    }

    consultaPorCodigo(codigo: string) {
        return this.manager.findOne(this.modelo, { where: { codigo } })
    }

    _consultarListaOpcoes_Campos: any = { id: true, nome: true, observacao: true, codigoSku: true, codigoEan: true, idFabricante: true }
    async _consultarListaOpcoesFormat(registros: any) {
       let fabricantes = registros.map((item: any) => item.idFabricante)
       const fabricanteSvc = new FabricanteSvc()
       fabricantes = await fabricanteSvc.consultarListaOpcoes({})
       console.log(fabricantes)
        return registros.map((option: any) => {
            const opcao = `[${get(option, 'codigoSku')}] ${get(option, 'nome')}`
            const fabricante = fabricantes.find((item: any) => item.codigo == option.idFabricante).opcao
            return { 
              codigo: option.id, 
              opcao, 
              nome: option.nome, 
              observacao: option.observacao, 
              codigoSku: option.codigoSku, 
              codigoEan : option.codigoEan,
              fabricante
            }
        })
    }

    getConsultaPorCodigo = async (paramsCodigo: string) => {
        try {
            const produto = await this.consultaPorCodigo(paramsCodigo);
            if(!produto) throw 'Produto não encontrado.'
            this.respostaSucesso(produto)
        } catch (err) {
            this.respostaErro(err)
        }
    }
}