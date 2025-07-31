import { Like } from "typeorm";
import { CoreServicoCRUD } from "../../core/ServicoCrud";
import { Fabricante } from "../../modelos/administracao/Fabricante";
import { CoreServicoCRUDControlador } from "../../core/ServicoCrudControlador";

export class FabricanteSvc extends CoreServicoCRUDControlador {
    modelo: any = Fabricante;

    async _consultarRegistros_Filtro(filter: any): Promise<any> {

        filter = filter || {}
        let where: any = {}
        if (filter.name) where.nome = Like(`%${filter.name}%`)

        return where
    }
}