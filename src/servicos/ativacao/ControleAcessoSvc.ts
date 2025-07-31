import { AppDataSource } from "../../config/datasource.config"
import { Modulo } from "../../modelos/ativacao/controle-acesso/Modulo"
import { Permissao } from "../../modelos/ativacao/controle-acesso/Permissao"



import { UUID } from 'angular2-uuid'
import {ModuloSvc } from "./controle-acesso/ModuloSvc"
import {RecursoSvc } from "./controle-acesso/RecursoSvc"

import {PermissaoSvc } from "./controle-acesso/PermissaoSvc"
import {PermissaoServicoSvc } from "./controle-acesso/PermissaoServicoSvc"
import {ServicoSvc } from "./controle-acesso/ServicoSvc"
import { Recurso } from "../../modelos/ativacao/controle-acesso/Recurso"
import { Servico } from "../../modelos/ativacao/controle-acesso/Servico"
import { PermissaoServico as PermissaoServicoModel } from "../../modelos/ativacao/controle-acesso/PermissaoServico"
import { CoreServico } from '../../core/Servico';

export class ControleAcessoSvc extends CoreServico {
    moduloServico = new ModuloSvc(null, null)
    recursoServico = new RecursoSvc(null, null)
    servicoServico = new ServicoSvc(null, null)
    permissaoServico = new PermissaoSvc(null, null)
    permissaoServicoServico = new PermissaoServicoSvc(null, null)

    async consultar() {

        let modulos = await AppDataSource
            .getRepository(Modulo)
            .find()
        let recursos = await AppDataSource
            .getRepository(Recurso)
            .find()
        let servicos = await AppDataSource
            .getRepository(Servico)
            .find()
        let permissoes = await AppDataSource
            .getRepository(Permissao)
            .find()
        let permissoesServicos = await AppDataSource
            .getRepository(PermissaoServicoModel)
            .find()

        return modulos.map((modulo: any) => {
            modulo.recursos = recursos
                .filter((recurso: any) => recurso.idModulo == modulo.id)
                .map((recurso: any) => {
                    recurso.servicos = servicos.filter((servico: any) => servico.idRecurso == recurso.id)
                    recurso.permissoes = permissoes
                        .filter((permissao: any) => permissao.idRecurso == recurso.id)
                        .map((permissao: any) => {
                            permissao.servicos = permissoesServicos
                                .filter((permissaoServico: any) => permissaoServico.idPermissao == permissao.id)
                                .map((permissaoServico: any) => permissaoServico.idServico)
                            return permissao;
                        })
                    return recurso
                })
            return modulo
        })
    }

    private limparTabelas() {
        AppDataSource.manager.query(`TRUNCATE acl_modulo`)
        AppDataSource.manager.query(`TRUNCATE acl_recurso`)
        AppDataSource.manager.query(`TRUNCATE acl_servico`)
        AppDataSource.manager.query(`TRUNCATE acl_permissao`)
        AppDataSource.manager.query(`TRUNCATE acl_permissao_servico`)
    }

    async salvar(body: any) {

        await this.limparTabelas()
        body.forEach((modulo: any) => {
            this.moduloServico.inserirRegistro(modulo)
            modulo.recursos.forEach((recurso: any) => {
                this.recursoServico.inserirRegistro({ ...recurso, idModulo: modulo.id })
                recurso.servicos.forEach((servico: any) => {
                    this.servicoServico.inserirRegistro({ ...servico, idRecurso: recurso.id })
                })
                recurso.permissoes.forEach((permissao: any) => {
                    this.permissaoServico.inserirRegistro({ ...permissao, idRecurso: recurso.id })
                    permissao.servicos.forEach((idServico: any) => {
                        this.permissaoServicoServico.inserirRegistro({ id: UUID.UUID(), idPermissao: permissao.id, idServico })
                    })
                })
            })
        })
        return { flavio: 'souza' }
    }


    getConsultar = async () => {
        const controleAcesso = await this.consultar()
        this.respostaSucesso(controleAcesso)
    }

    postSalvar = async (body: Object) => {
        const controleAcesso = await this.salvar(body)
        this.respostaSucesso(controleAcesso)
    }

}