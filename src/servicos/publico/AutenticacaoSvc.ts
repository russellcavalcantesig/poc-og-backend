import { JsonWebTokenError } from "jsonwebtoken";
import { isString, omit } from "lodash";
import { AppDataSource } from "../../config/datasource.config";
import { Util } from "../../core/classes/util.class";
import { DebugResponse } from "../../core/DebugResponse";

import { environment } from "../../environment/environment";
import { Instancia } from "../../modelos/ativacao/Instancia";
import { Usuario } from "../../modelos/ativacao/Usuario";
import { CoreServico } from "../../core/Servico";



export class AutenticacaoSvc extends CoreServico {

    modelo: any = Instancia;

    private async consultarUsuario(email: string, senha: string) {
        try {
            let usuario: any = await AppDataSource
                .getRepository(Usuario)
                .findOne({ where: { email }, select: { id: true, nome: true, senha: true, salt: true, email: true } })
            if (!usuario) throw 'Usuário ou senha inválidos.'

            const {senha: senhaCriptografada, salt} = Util.encryptPassword(usuario.senha, usuario.salt)

            if (senhaCriptografada != usuario.senha) {
                //throw 'Usuário ou senha inválidos.'
            }
            //TODO Validar a senha do usuário
            return usuario
        } catch (err) {
            throw 'Usuário ou senha inválidos'
        }

    }

    minhasInstancias = async (email: string, senha: string) => {
        let usuario: any = await this.consultarUsuario(email, senha)
        const query = `SELECT 
        i.id,
        i.nome
        FROM instancia_usuario_perfil iup
        INNER JOIN instancia i ON i.id = iup.id_instancia
        WHERE id_usuario = '${usuario.id}'`
        const instances = await AppDataSource.query(query) //TODO Substituir por QueryBuilder
        return instances
    }

    autenticar = async (email: string, senha: string, instancia: string) => {
        let usuario: any = await this.consultarUsuario(email, senha)
        const query = `SELECT 
        p.id AS perfil_id,
        p.nome AS perfil_nome,
        i.nome AS instancia_nome,
        i.id AS instancia_id
        FROM instancia_usuario_perfil iup
        INNER JOIN perfil p ON p.id = iup.id_perfil
        INNER JOIN instancia i ON i.id = iup.id_instancia
        WHERE id_usuario = '${usuario.id}'
        AND id_instancia = '${instancia}'`
        let acesso = await AppDataSource.query(query) //TODO Substituir por QueryBuilder
        acesso = acesso.pop();
        if (!acesso) throw 'Usuário ou senha inválidos.'
        const usuarioInformacoes = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            perfil: {
                id: acesso.perfil_id,
                nome: acesso.perfil_nome
            },
            instancia: {
                id: acesso.instancia_id,
                nome: acesso.instancia_nome
            }
        }
        const jwt = require('jsonwebtoken')
        return {
            token: jwt.sign(usuarioInformacoes, environment.jwtPrivateKey)
        }
    }

    getAcl = (headersAuthorization: string, headersInstance: string) => {
        const jwt = require('jsonwebtoken');
        const ACLBackend = {
            GET: [
                '/manager/instance',
                '/manager/instance/:id'
            ],
            POST: [
                '/manager/instance'
            ],
            PUT: [
                '/manager/instance/:id'
            ],
            DELETE: [
                '/manager/instance/:id'
            ]
        }
        const tokenACLBackend = jwt.sign(ACLBackend, environment.jwtPrivateKey);

        const ACLFrontend = {
            GET: [
                '/manager/instance',
                '/manager/instance/:id'
            ]
        }
        const tokenACLFrontend = jwt.sign(ACLFrontend, environment.jwtPrivateKey);

        this.resposta
            .header('ACLBackend', tokenACLBackend)
            .header('ACLFrontend', tokenACLFrontend)
            .send("")
    }


    postMinhasInstancias = async (bodyEmail: string, bodySenha: string) => {
        try {
            const response: any = await this.minhasInstancias(bodyEmail, bodySenha)
            this.respostaSucesso(response)
        } catch (err) {
            this.respostaErro(err)
        }
    }

    postAutenticar = async (bodyEmail: string, bodySenha: string, bodyInstancia: string) => {
        try {
            const response: any = await this.autenticar(bodyEmail, bodySenha, bodyInstancia)
            this.respostaSucesso(response)
        } catch (err) {
            this.respostaErro(err)
        }
    }
}