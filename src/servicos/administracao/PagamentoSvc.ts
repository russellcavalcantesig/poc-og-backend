import { Between, In } from "typeorm";
import { CoreServicoCRUD } from "../../core/ServicoCrud";
import { Orcamento } from "../../modelos/administracao/Orcamento";
import { Venda } from "../../modelos/administracao/Venda";
import { VendaPagamento } from "../../modelos/administracao/VendaPagamento";
import { FormaPagamento } from "../../modelos/administracao/FormaPagamento";
import { Cliente } from "../../modelos/administracao/Cliente";
import { CoreServicoCRUDControlador } from "../../core/ServicoCrudControlador";
import { cloneDeep } from "lodash";
import { UUID } from "angular2-uuid";

export class PagamentoSvc extends CoreServicoCRUDControlador {
    modelo: any = VendaPagamento;


    async _consultarRegistros_Filtro(filter: any): Promise<any> {

        filter = filter || {}
        let where: any = {}
        if (filter.pago) where.pago = filter.pago
        if (filter.dataInicio && filter.dataTermino) {
            filter.dataInicio = new Date(filter.dataInicio);
            filter.dataInicio.setHours(0);
            filter.dataInicio.setMinutes(0);
            filter.dataInicio.setSeconds(0);

            filter.dataTermino = new Date(filter.dataTermino)
            filter.dataTermino.setHours(23);
            filter.dataTermino.setMinutes(59);
            filter.dataTermino.setSeconds(59);
            where.dataPagamento = Between(filter.dataInicio, filter.dataTermino)

        }
        if (filter.idFormaPagamento) where.idFormaPagamento = filter.idFormaPagamento

        if (filter.idCliente) {
            const ids = await this.manager.query(`SELECT DISTINCT p.id FROM venda_pagamento p 
            INNER JOIN venda v ON v.id = p.id_venda 
            INNER JOIN orcamento o ON o.id = v.id_orcamento 
            WHERE o.id_cliente = '${filter.idCliente}'`);
            where.id = In(ids.map((item: any) => item.id));
        }

        return where
    }

    async _consultarRegistros_Formatacao(registros: Array<Object>) {
        const idsVendas: any = registros.map((registro: any) => registro.idVenda)
        const vendas = await this.manager.find(Venda, {
            where: {
                id: In(idsVendas)
            },
            select: { id: true, idOrcamento: true }
        })

        const idsOrcamentos: any = vendas.map((registro: any) => registro.idOrcamento)
        const orcamentos = await this.manager.find(Orcamento, {
            where: {
                id: In(idsOrcamentos)
            },
            select: { id: true, idCliente: true }
        })

        const idsClientes: any = orcamentos.map((registro: any) => registro.idCliente)
        const clientes = await this.manager.find(Cliente, {
            where: {
                id: In(idsClientes)
            },
            select: { id: true, nome: true }
        })

        const idsFormasPagamento: any = registros.map((registro: any) => registro.idFormaPagamento)
        const formasPagamentos = await this.manager.find(FormaPagamento, {
            where: {
                id: In(idsFormasPagamento)
            },
            select: { id: true, nome: true }
        })
        return registros.map((registro: any) => {
            const formaPagamento = formasPagamentos.find((item: any) => item.id == registro.idFormaPagamento)
            registro.formaPagamento = formaPagamento
            const idOrcamento = vendas.find((item: any) => item.id == registro.idVenda)?.idOrcamento
            const idCliente = orcamentos.find((item: any) => item.id == idOrcamento)?.idCliente
            const cliente = clientes.find((item: any) => item.id == idCliente)
            registro.cliente = cliente
            return registro
        })
    }

    async confirmarPagamento(id: string, body: any) {
      const pagamento: any = await this.manager.findOne(VendaPagamento, { where: { id } })
        const valorAntigo = pagamento.valor;
        pagamento.pago = 1
        if(body.valor != pagamento.valor) pagamento.valor = body.valor
        
        await this.manager.save(pagamento)

        if(body.valor < valorAntigo){
          const novoValor = cloneDeep(valorAntigo - body.valor)

          let novoPagamento = cloneDeep(pagamento)
          novoPagamento.id = UUID.UUID()
          novoPagamento.valor = novoValor
          novoPagamento.pago = 0
          novoPagamento.dataPagamento = body.dataPagamento;
          this.manager.save(novoPagamento)
        }
    }

    postConfirmarPagamento = async (paramsId: string, body: any) => {
        try {
            await this.confirmarPagamento(paramsId, body)
            this.respostaSucesso("Pagamento confirmado com sucesso.")
        } catch (err) {
            this.respostaErro(err)
        }
    }
}