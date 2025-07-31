import { isEmpty, omit } from "lodash";
import { Util } from "../../core/classes/util.class";
import { Usuario } from "../../modelos/ativacao/Usuario";
import { InstanciaUsuarioPerfil } from "../../modelos/ativacao/InstanciaUsuarioPerfil";
import { UUID } from "angular2-uuid";
import { Perfil } from "../../modelos/ativacao/Perfil";
import { IsNull, Like, Not } from "typeorm";
import { CoreServicoCRUDControlador } from "../../core/ServicoCrudControlador";


export class UsuarioSvc extends CoreServicoCRUDControlador {

    modelo: any = Usuario;
    _consultarRegistro_CamposOcultos = ['senha', 'salt']
    async _consultarRegistros_Filtro(filter: any): Promise<any> {

        filter = filter || {}
        let where: any = {}
        if (filter.name) where.nome = Like(`%${filter.name}%`)
        if (filter.email) where.email = Like(`%${filter.email}%`)
        return where
    }

    async _inserirRegistro_Validacao(body: any): Promise<void> {
        if (isEmpty(body.senha)) throw 'Você deve informar a senha.'
    }

    async _inserirRegistro_Sanitizacao(body: Object | any) {
        body = {
            ...body,
            ...Util.encryptPassword(body.senha)
        }
        return body;
    }

    async _inserirRegistro_ExecutarApos(registro: any): Promise<void> {


        const perfil: any = await this.manager.findOne(Perfil, { where: { nome: Not(IsNull()) } })

        const instanciaUsuarioPerfil = new InstanciaUsuarioPerfil();
        instanciaUsuarioPerfil.id = UUID.UUID()
        instanciaUsuarioPerfil.idInstancia = this.idInstancia
        instanciaUsuarioPerfil.idPerfil = perfil.id;
        instanciaUsuarioPerfil.idUsuario = registro.id
        instanciaUsuarioPerfil.criadoPor = this.idUsuario
        instanciaUsuarioPerfil.criadoEm = new Date().toISOString();
        this.manager.save(instanciaUsuarioPerfil)
    }

    async _atualizarRegistro_Sanitizacao(body: any): Promise<any> {
        if (!isEmpty(body.senha)) {
            body = {
                ...body,
                ...Util.encryptPassword(body.senha)
            }
        } else {
            body = omit(body, ['senha', 'salt'])
        }

        return body;
    }

}