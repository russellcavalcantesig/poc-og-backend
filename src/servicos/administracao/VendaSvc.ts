import { In } from "typeorm";
import { CoreServicoCRUD } from "../../core/ServicoCrud";
import { Orcamento } from "../../modelos/administracao/Orcamento";
import { Venda } from "../../modelos/administracao/Venda";
import { Cliente } from "../../modelos/administracao/Cliente";
import { Veiculo } from "../../modelos/administracao/Veiculo";
import { Formatar } from "../../core/classes/formatar.class";
import { Produto } from "../../modelos/administracao/Produto";
import { Servico } from "../../modelos/administracao/Servico";
import { OrcamentoItem } from "../../modelos/administracao/OrcamentoItem";
import { CoreServicoCRUDControlador } from "../../core/ServicoCrudControlador";
import moment from "moment";


export class VendaSvc extends CoreServicoCRUDControlador {
    modelo: any = Venda;

    async _consultarRegistros_Filtro(filter: any): Promise<any> {

        filter = filter || {}
        let where: any = {}
        const sql = `SELECT v.id FROM venda v
        INNER JOIN orcamento o ON o.id = v.id_orcamento`
        let sqlWhere = []
        if (filter.orcamento) sqlWhere.push(`o.codigo LIKE '%${filter.orcamento}%'`)
        if (filter.idCliente) sqlWhere.push(`o.id_cliente = '${filter.idCliente}'`)
        if (filter.idVeiculo) sqlWhere.push(`o.id_veiculo = '${filter.idVeiculo}'`)

        const ids = await this.manager.query(`${sql} ${sqlWhere.length > 0 ? ` WHERE ${sqlWhere.join(' AND ')}`: ''}`)
        where.id = In(ids.map((item: any) => item.id));

        return where
    }

    async _consultarRegistros_Formatacao(registros: Array<Object>) {
        const idsOrcamentos = registros.map((registro: any) => registro.idOrcamento);
        const orcamentos = await this.manager.find(Orcamento, { where: { id: In(idsOrcamentos) } })
        const idsClientes = orcamentos.map((registro: any) => registro.idCliente)
        const idsVeiculos = orcamentos.map((registro: any) => registro.idVeiculo)

        const clientes = await this.manager.find(Cliente, { where: { id: In(idsClientes) } })
        let veiculos: any = []
        if (idsVeiculos.length > 0) {
            veiculos = await this.manager.find(Veiculo, { where: { id: In(idsVeiculos) } })
        }

        try {
            return registros.map((registro: any) => {
                registro.orcamento = orcamentos.find((item: any) => item.id == registro.idOrcamento)
                registro.cliente = clientes.find((item: any) => item.id == registro.orcamento.idCliente)
                registro.veiculo = veiculos.find((item: any) => item.id == registro.orcamento.idVeiculo)
                return registro
            })
        } catch (err) {
            console.error(err)
            return []
        }

    }


    async cupom(idOrcamento: string) {

        let registro: any = await this.manager.findOne(Orcamento, {
            where: { id: idOrcamento }
        })
        
        let venda: any = await this.manager.findOne(Venda, {
            where: { idOrcamento }
        })
        const itens: any = await this.manager.find(OrcamentoItem, {
            where: { idOrcamento }
        })

        registro.produtos = itens.filter((item: any) => item.idProduto)
        registro.servicos = itens.filter((item: any) => item.idServico)

        const cliente: any = await this.manager.findOne(Cliente, {
            where: {
                id: registro.idCliente
            }
        });

        let veiculo: any
        if (registro.idVeiculo) {
            veiculo = await this.manager.findOne(Veiculo, {
                where: {
                    id: registro.idVeiculo
                }
            });
        }


        const idsProdutos = registro.produtos.map((produto: any) => produto.idProduto)
        let produtos: any = [];
        if (idsProdutos.length > 0) {
            produtos = await this.manager.find(Produto, {
                where: {
                    id: In(idsProdutos)
                }
            })
        }
        const idsServicos = registro.servicos.map((produto: any) => produto.idServico)
        let servicos: any = [];
        if (idsServicos.length > 0) {
            servicos = await this.manager.find(Servico, {
                where: {
                    id: In(idsServicos)
                }
            })
        }

        let cupom = '';

        cupom = Formatar.padStart('-', 30, '-')
        cupom += '\n'
        cupom += 'OFICINA GARAGEM'
        cupom += '\n'
        cupom += 'CNPJ: 43.800.856/0001-54'
        cupom += '\n'
        cupom += 'TELEFONE: (88) 9.8153-1513'
        cupom += '\n'
        cupom += Formatar.padStart('-', 30, '-')
        cupom += '\n'
        cupom += '\n'
        cupom += `${Formatar.padEnd('ORÇAMENTO:', 12, ' ')}${registro.codigo}`
        cupom += '\n'
        cupom += `${Formatar.padEnd('DATA/HORA:', 12, ' ')}${moment(venda.criadoEm).format('DD/MM/YYYY [às] HH:mm')}`
        cupom += '\n'
        cupom += `${Formatar.padEnd('CLIENTE:', 12, ' ')}${cliente.nome}`
        cupom += '\n'
        if (veiculo) {
            cupom += `${Formatar.padEnd('VEÍCULO:', 12, ' ')}${veiculo.placa}`
            cupom += '\n'
        }
        cupom += '\n'

        if (registro.produtos.length > 0) {
            cupom += Formatar.padStart('-', 30, '-')
            cupom += '\n'
            cupom += Formatar.padBoth(' PEÇAS ', 30, ' ')
            cupom += '\n'
            cupom += Formatar.padStart('-', 30, '-')
            cupom += '\n'


            registro.produtos.forEach((item: any, index: any) => {
                const produto = produtos.find((produto: any) => produto.id == item.idProduto)
                cupom += produto.codigoSku
                cupom += '\n'
                cupom += produto.nome
                cupom += '\n'
                const quantidade = Formatar.numero(item.quantidade)
                const valor = Formatar.numero(item.valor)
                const total = Formatar.numero(item.quantidade * item.valor)
                const quantidadeValor = `${quantidade} X ${valor}`
                cupom += quantidadeValor
                cupom += Formatar.padStart(total, (30 - quantidadeValor.length), ' ')
                cupom += index == registro.produtos.length - 1 ? '\n' : '\n\n'
            })
        }


        if (registro.servicos.length > 0) {
            cupom += Formatar.padEnd('-', 30, '-')
            cupom += '\n'
            cupom += Formatar.padBoth(' SERVIÇOS ', 30, ' ')
            cupom += '\n'
            cupom += Formatar.padStart('-', 30, '-')
            cupom += '\n'


            registro.servicos.forEach((item: any, index: any) => {
                const servico = servicos.find((servico: any) => servico.id == item.idServico)
                cupom += servico.nome
                cupom += '\n'
                const quantidadeValor = `${Formatar.numero(item.quantidade)} X ${Formatar.numero(item.valor)}`
                cupom += quantidadeValor
                cupom += Formatar.padStart(Formatar.numero(item.quantidade * item.valor), (30 - quantidadeValor.length), ' ')
                cupom += index == registro.servicos.length - 1 ? '\n' : '\n\n'
            })
        }

        cupom += Formatar.padStart('-', 30, '-')
        cupom += '\n'
        cupom += 'TOTAL R$'
        cupom += Formatar.padStart(Formatar.numero(registro.total), (30 - 'TOTAL R$'.length), ' ',)

        cupom += '\n'
        cupom += Formatar.padStart('-', 30, '-')


        return cupom;
    }


    async _removerRegistro_ExecutarAntes(registro: any): Promise<void> {
        await this.manager.query(`DELETE FROM venda_pagamento WHERE id_venda = '${registro.id}'`)
        await this.manager.query(`UPDATE orcamento SET status = 0 WHERE id = '${registro.idOrcamento}'`)
        const itens = await this.manager.query(`SELECT id_produto, quantidade FROM orcamento_item 
        WHERE id_orcamento = '${registro.idOrcamento}' 
        AND id_produto IS NOT NULL`)

        itens.forEach(async (item: any) => {
            await this.manager.query(`UPDATE produto SET estoque = estoque + ${item.quantidade} WHERE id = '${item.id_produto}'`)
        })
    }

    getCupom = async (paramsId: string) => {
        try {
            const cupom = await this.cupom(paramsId)
            this.respostaSucesso({ cupom })
        } catch (err) {
            this.respostaErro(err)
        }
    }
}