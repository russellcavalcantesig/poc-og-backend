import { get } from "lodash";
import { Like } from "typeorm";
import { Instancia } from "../../modelos/ativacao/Instancia";
import { CoreServicoCRUDControlador } from '../../core/ServicoCrudControlador';


export class InstanciaSvc extends CoreServicoCRUDControlador {

    modelo: any = Instancia;

    _consultarRegistros_Filtro(filter: Object) {
        let where: any = { 
            ...this._consultarRegistros_Filtro(filter)
         }
         const name = get(filter, 'name', false);
         if(name) where.name = Like(`%${name}%`)

         return where
    }
}