import { CoreServicoCRUD } from "../../../core/ServicoCrud";
import { CoreServicoCRUDControlador } from "../../../core/ServicoCrudControlador";
import { Recurso } from "../../../modelos/ativacao/controle-acesso/Recurso";



export class RecursoSvc extends CoreServicoCRUDControlador {

    modelo: any = Recurso;

}