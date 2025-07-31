import { CoreServicoCRUDControlador } from "../../core/ServicoCrudControlador";
import { Perfil } from "../../modelos/ativacao/Perfil";


export class PerfilSvc extends CoreServicoCRUDControlador {

    modelo: any = Perfil;

}