import { Rota } from "../../modelos/ativacao/Rota";
import { CoreServicoCRUDControlador } from '../../core/ServicoCrudControlador';


export class RotaSvc extends CoreServicoCRUDControlador {

    modelo: any = Rota;

}