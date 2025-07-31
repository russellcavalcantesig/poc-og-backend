import { CoreServicoCRUD } from "../../../core/ServicoCrud";
import { CoreServicoCRUDControlador } from "../../../core/ServicoCrudControlador";
import { Servico } from "../../../modelos/ativacao/controle-acesso/Servico";




export class ServicoSvc extends CoreServicoCRUDControlador {

    modelo: any = Servico;

}