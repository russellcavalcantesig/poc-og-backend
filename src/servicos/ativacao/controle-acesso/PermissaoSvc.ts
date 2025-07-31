import { CoreServicoCRUD } from "../../../core/ServicoCrud";
import { CoreServicoCRUDControlador } from "../../../core/ServicoCrudControlador";
import { Permissao } from "../../../modelos/ativacao/controle-acesso/Permissao";



export class PermissaoSvc extends CoreServicoCRUDControlador {

    modelo: any = Permissao;

}