import { CoreServicoCRUDControlador } from "../../../core/ServicoCrudControlador";
import { PermissaoServico } from "../../../modelos/ativacao/controle-acesso/PermissaoServico";




export class PermissaoServicoSvc extends CoreServicoCRUDControlador {

    modelo: any = PermissaoServico;

}