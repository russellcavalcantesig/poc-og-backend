import { CoreServicoCRUD } from "../../../core/ServicoCrud";
import { CoreServicoCRUDControlador } from "../../../core/ServicoCrudControlador";
import { Modulo } from "../../../modelos/ativacao/controle-acesso/Modulo";


export class ModuloSvc extends CoreServicoCRUDControlador {

    modelo: any = Modulo;

}