import { isEmpty } from "lodash";
import moment from "moment";
import { Between, In, IsNull, Like, Not } from "typeorm";
import { CoreServicoCRUD } from "../../core/ServicoCrud";
import { Compra } from "../../modelos/administracao/Compra";
import { CompraItem } from "../../modelos/administracao/CompraItem";
import { Fornecedor } from "../../modelos/administracao/Fornecedor";
import {CompraItemSvc } from "./CompraItemSvc";
import {ProdutoSvc } from "./ProdutoSvc";
import { CoreServicoCRUDControlador } from "../../core/ServicoCrudControlador";


export class CompraSvc extends CoreServicoCRUDControlador {
    modelo: any = Compra;

    async _consultarRegistros_Filtro(filter: any): Promise<any> {

        filter = filter || {}
        let where: any = {}
        if (filter.status) where.status = filter.status
        if (filter.data) {
            const dataInicio = new Date(filter.data);
            dataInicio.setHours(0);
            dataInicio.setMinutes(0);
            dataInicio.setSeconds(0);

            const dataTermino = new Date(filter.data);
            dataTermino.setHours(23);
            dataTermino.setMinutes(59);
            dataTermino.setSeconds(59);
            where.criadoEm = Between(dataInicio, dataTermino)

        }
        if (filter.idFornecedor) where.idFornecedor = filter.idFornecedor
        if (filter.nfe) where.nfe = Like(`%${filter.nfe}%`)

        return where
    }

    async _inserirRegistro_Validacao(body: any) {
        if (isEmpty(body.idFornecedor)) {
            throw 'Você deve informar o fornecedor.'
        }
    }

    async _consultarRegistros_Formatacao(registros: Array<Object>) {
        let fornecedores: any = registros.map((registro: any) => registro.idFornecedor)
        fornecedores = await this.manager.find(Fornecedor, {
            where: {
                id: In(fornecedores)
            },
            select: { id: true, nome: true }
        })
        return registros.map((registro: any) => {
            registro.criadoEm = moment(registro.criadoEm).format('DD/MM/YYYY');
            registro.fornecedor = fornecedores.find((fornecedor: any) => fornecedor.id == registro.idFornecedor).nome
            return registro
        })
    }

    saveCompraItem() {
        const idCompra = this.body('id')
        const itens = this.body('itens')
        if (itens) {
            const compraItemServico = new CompraItemSvc(this.requisicao, this.resposta)
            compraItemServico.salvarRegistrosAuxiliares('idCompra', idCompra, itens)
        }
    }

    async _inserirRegistro_ExecutarApos() {
        this.saveCompraItem()
    }

    async _atualizarRegistro_ExecutarApos() {
        this.saveCompraItem()
    }

    async _consultarRegistro_Formatacao(registro: any) {
        const itens = await this.manager.find(CompraItem, {
            where: {
                idCompra: registro.id
            }
        })
        registro.itens = itens;
        return registro
    }

    lancarEstoque = async (idCompra: string) => {
        const compraServico = new CompraSvc(this.requisicao, this.resposta)

        const registro: any = await this.manager.findOne(Compra, { where: { id: idCompra } })
        if (registro.status == 1) throw 'Você já lançou estoque para essa compra.'

        const produtos: any = await this.manager.find(CompraItem, {
            where: {
                idCompra,
                idProduto: Not(IsNull())
            },
            select: { idProduto: true, quantidade: true, valor: true }
        })

        produtos.forEach(async (item: any) => {
            await this.manager.query(`UPDATE produto SET estoque = estoque + ${item.quantidade}, valor_compra = ${item.valor} WHERE id = '${item.idProduto}'`)
        })

        await compraServico.atualizarRegistro({ id: idCompra, status: 1 })

    }

    async _removerRegistro_ExecutarAntes(registro: Compra): Promise<void> {
        if (registro.status == 1) {
            const itens = await this.manager.query(`SELECT id_produto, quantidade FROM compra_item 
            WHERE id_compra = '${registro.id}' 
            AND id_produto IS NOT NULL`)
            itens.forEach(async (item: any) => {
                await this.manager.query(`UPDATE produto SET estoque = estoque - ${item.quantidade} WHERE id = '${item.id_produto}'`)
            })
        }

        await this.manager.query(`DELETE FROM compra_item WHERE id_compra = '${registro.id}'`)


    }

    async _atualizarRegistro_Validacao(registro: Compra, registroBanco: Compra): Promise<void> {
        if (registroBanco.status == 1) throw 'Você não pode atualizar uma compra com estoque lançado.'
    }

    postLancarEstoque = async (paramsId: string) => {
        try {
            await this.lancarEstoque(paramsId)
            this.respostaSucesso('Estoque lançado com sucesso.')
        } catch (err) {
            this.respostaErro(err)
        }
    }

}