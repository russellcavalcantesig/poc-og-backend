import { Like } from "typeorm";
import { CoreServicoCRUD } from "../../core/ServicoCrud";
import { Cliente } from "../../modelos/administracao/Cliente";
import { CoreServicoCRUDControlador } from "../../core/ServicoCrudControlador";

export class ClienteSvc extends CoreServicoCRUDControlador {
    modelo: any = Cliente;

    async _consultarRegistros_Filtro(filter: any): Promise<any> {

        filter = filter || {}
        let where: any = {}
        if (filter.name) where.nome = Like(`%${filter.name}%`)

        return where
    }
}