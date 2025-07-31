import { UUID } from "angular2-uuid";
import { get, padStart, trim } from "lodash";
import moment from "moment";
import { In, IsNull, Like, Not } from "typeorm";
import { CoreServicoCRUD } from "../../core/ServicoCrud";
import { Cliente } from "../../modelos/administracao/Cliente";
import { Orcamento } from "../../modelos/administracao/Orcamento";
import { OrcamentoAnotacao } from "../../modelos/administracao/OrcamentoAnotacao";
import { OrcamentoItem } from "../../modelos/administracao/OrcamentoItem";
import { Veiculo } from "../../modelos/administracao/Veiculo";
import { Venda } from "../../modelos/administracao/Venda";
import { VendaPagamento } from "../../modelos/administracao/VendaPagamento";
import { Usuario } from "../../modelos/ativacao/Usuario";
import {CompraItemSvc } from "./CompraItemSvc";
import {OrcamentoAnotacaoSvc } from "./OrcamentoAnotacaoSvc";
import {OrcamentoItemSvc } from "./OrcamentoItemSvc";
import {VendaPagamentoSvc } from "./VendaPagamentoSvc";
import {VendaSvc } from "./VendaSvc";
import { Formatar } from "../../core/classes/formatar.class";
import { Produto } from "../../modelos/administracao/Produto";
import { Servico } from "../../modelos/administracao/Servico";
import { CoreServicoCRUDControlador } from "../../core/ServicoCrudControlador";

export class OrcamentoSvc extends CoreServicoCRUDControlador {
    modelo: any = Orcamento;

    async _consultarRegistros_Filtro(filter: any): Promise<any> {

        filter = filter || {}
        let where: any = {}
        if (filter.status) where.status = filter.status
        if (filter.idCliente) where.idCliente = filter.idCliente
        if (filter.idVeiculo) where.idVeiculo = filter.idVeiculo
        if (filter.codigo) where.codigo = Like(`%${filter.codigo}%`)

        console.log(filter)
        return where
    }


    async _consultarRegistros_Formatacao(registros: Array<Object>) {
        let clientes: any = registros.map((registro: any) => registro.idCliente)
        clientes = await this.manager.find(Cliente, {
            where: {
                id: In(clientes)
            },
            select: { id: true, nome: true }
        })

        let veiculos: any = registros.map((registro: any) => registro.idVeiculo)
        veiculos = await this.manager.find(Veiculo, {
            where: {
                id: In(veiculos)
            },
            select: { id: true, descricao: true, placa: true }
        })
        return registros.map((registro: any) => {
            registro.criadoEm = moment(registro.criadoEm).format('DD/MM/YYYY [às] HH:mm');
            registro.cliente = clientes.find((cliente: any) => cliente.id == registro.idCliente).nome
            const veiculo = veiculos.find((cliente: any) => cliente.id == registro.idVeiculo)
            registro.veiculo = ''
            if (veiculo) {
                registro.veiculo = `${veiculo.placa} - ${veiculo.descricao}`
            }

            return registro
        })
    }

    saveCompraItem() {
        const idOrcamento = this.body('id')
        const itens = this.body('itens')
        let compraItemServico = new OrcamentoItemSvc(this.requisicao, this.resposta)
        compraItemServico.salvarRegistrosAuxiliares('idOrcamento', idOrcamento, itens)
    }

    salvarAnotacoes() {
        const idOrcamento = this.body('id')
        const anotacoes = this.body('anotacoes')
        let orcamentoAnotacaoServico = new OrcamentoAnotacaoSvc(this.requisicao, this.resposta)
        orcamentoAnotacaoServico.salvarRegistrosAuxiliares('idOrcamento', idOrcamento, anotacoes)
    }

    salvarTotal(registro: any) {
        const desconto = registro.desconto || 0
        const itens = registro.itens || [{ quantidade: 0, valor: 0 }];
        const total = itens
            .map((item: any) => item.quantidade * item.valor)
            .reduce((a: number, b: number) => a + b) - desconto;
        registro.total = total;
        return registro
    }

    async _atualizarRegistro_ExecutarAntes(registro: any) {
        return this.salvarTotal(registro)
    }

    async _inserirRegistro_ExecutarAntes(registro: any) {


        const year = String(new Date().getFullYear()).substring(2, 4)
        const month = padStart(String(new Date().getMonth() + 1), 2, '0')
        const day = padStart(String(new Date().getDate()), 2, '0')
        const prefix = `${year}${month}${day}`;
        const count: any = await this.manager
            .query(`SELECT COUNT(*) + 1 AS count 
        FROM orcamento 
        WHERE codigo LIKE '${prefix}%'`)

        const increment = padStart(count.pop().count, 4, '0')

        registro.codigo = `${prefix}${increment}`

        return this.salvarTotal(registro)
    }

    async _inserirRegistro_ExecutarApos(registro: any) {
        this.saveCompraItem()
        this.salvarAnotacoes()
    }

    async _atualizarRegistro_ExecutarApos(registro: any) {
        this.saveCompraItem()
        this.salvarAnotacoes()
    }

    async _consultarRegistro_Formatacao(registro: any) {
        const itens = await this.manager.find(OrcamentoItem, {
            where: {
                idOrcamento: registro.id
            }
        })
        registro.itens = itens;


        const anotacoes = await this.manager.find(OrcamentoAnotacao, {
            where: {
                idOrcamento: registro.id
            },
            order: { criadoEm: 'DESC' }
        })
        const usuarios = await this.manager.find(Usuario, {
            where: {
                id: In(anotacoes.map(anotacao => anotacao.criadoPor))
            }
        })
        registro.anotacoes = anotacoes.map((anotacao: any) => {
            anotacao.criadoEm = moment(anotacao.criadoEm).format('DD/MM/YYYY [às] HH:mm');
            const usuario = usuarios.find(usuario => usuario.id == anotacao.criadoPor)
            anotacao.criadoPor = get(usuario, 'nome')
            return anotacao
        });
        return registro
    }

    async consultarPagamentos(idOrcamento: string) {
        let orcamento: any = await this.consultarRegistro(idOrcamento)
        const venda: any = await this.manager.findOne(Venda, { where: { idOrcamento } })
        if (venda) {
            orcamento.pagamentos = await this.manager.find(VendaPagamento, { where: { idVenda: venda.id } })
        } else {
            orcamento.pagamentos = []
        }
        return orcamento
    }

    async salvarPagamentos(idOrcamento: string, pagamentos: any) {
        await this._atualizarRegistro_Validacao({ id: idOrcamento })
        const venda = await this.manager.findOne(Venda, { where: { idOrcamento } })
        const orcamento = new Orcamento()
        orcamento.id = idOrcamento;
        orcamento.status = 1
        await this.manager.save(orcamento)
        let idVenda;
        if (venda) {
            idVenda = venda.id;
        } else {
            idVenda = UUID.UUID()
            const vendaServico = new VendaSvc(this.requisicao, this.resposta)
            await vendaServico.inserirRegistro({ id: idVenda, idOrcamento })

            const produtos: any = await this.manager.find(OrcamentoItem, {
                where: {
                    idOrcamento,
                    idProduto: Not(IsNull())
                },
                select: { idProduto: true, quantidade: true }
            })

            produtos.forEach(async (item: any) => {
                await this.manager.query(`UPDATE produto SET estoque = estoque - ${item.quantidade} WHERE id = '${item.idProduto}'`)
            })
        }

        pagamentos = pagamentos.map((pagamento: any) => {
            //pagamento.dataPagamento = moment(pagamento.dataPagamento).format('YYYY-MM-DD')
            return pagamento
        })

        const vendaPagamentoServico = new VendaPagamentoSvc(this.requisicao, this.resposta)
        vendaPagamentoServico.salvarRegistrosAuxiliares('idVenda', idVenda, pagamentos)

    }

    async cupom(idOrcamento: string) {

        let registro: any = await this.manager.findOne(Orcamento, {
            where: { id: idOrcamento }
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
        cupom += `${Formatar.padEnd('DATA/HORA:', 12, ' ')}${moment(registro.criadoEm).format('DD/MM/YYYY [às] HH:mm')}`
        cupom += '\n'
        cupom += `${Formatar.padEnd('CLIENTE:', 12, ' ')}${cliente.nome}`
        cupom += '\n'
        if (veiculo) {
            cupom += `${Formatar.padEnd('VEÍCULO:', 12, ' ')}${veiculo.placa}`
            cupom += '\n'
        }
        cupom += '\n'


        if(trim(registro.observacao) !== ''){
            cupom += Formatar.padStart('-', 30, '-')
            cupom += '\n'
            cupom += Formatar.padBoth(' OBSERVAÇÕES ', 30, ' ')
            cupom += '\n'
            cupom += Formatar.padStart('-', 30, '-')
            cupom += '\n\n'

            cupom += registro.observacao;
            cupom += '\n\n'
        }
        
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

    async vendaFechada(idOrcamento: string) {
        const count = await this.manager.count(Venda, { where: { idOrcamento } })
        return count;
    }

    async _removerRegistro_Validacao(registro: any): Promise<void> {
        const count = await this.vendaFechada(registro.id)
        if (count > 0) throw 'Você não pode remover um orçamento fechado.'
    }

    async _atualizarRegistro_Validacao(registro: Object | any): Promise<void> {
        const count = await this.vendaFechada(registro.id)
        if (count > 0) throw 'Você não pode atualizar um orçamento fechado.'
    }



    getCupom = async (paramsId: string) => {
        try {
            const cupom = await this.cupom(paramsId)
            this.respostaSucesso({ cupom })
        } catch (err) {
            this.respostaErro(err)
        }
    }

    
    getConsultarPagamentos = async (paramsId: string) => {
        try {
            const pagamentos = await this.consultarPagamentos(paramsId)
            this.respostaSucesso(pagamentos)
        } catch (err) {
            console.error(err)
            this.respostaErro(err)
        }
    }

    postSalvarPagamentos = async (paramsId: string, body: any) => {
        try {
            await this.salvarPagamentos(paramsId, body)
            this.respostaSucesso("Os pagamentos foram salvos com sucesso.")
        } catch (err) {
            console.error(err)
            this.respostaErro(err)
        }
    }

    
    async _removerRegistro_ExecutarAntes(registro: Orcamento): Promise<void> {
      await this.manager.query(`DELETE FROM orcamento_item WHERE id_orcamento = '${registro.id}'`)


  }
}