import { Like } from "typeorm";
import { CoreServicoCRUD } from "../../core/ServicoCrud";
import { Servico } from "../../modelos/administracao/Servico";
import { CoreServicoCRUDControlador } from "../../core/ServicoCrudControlador";

export class ServicoSvc extends CoreServicoCRUDControlador {
    modelo: any = Servico;

    async _consultarRegistros_Filtro(filter: any): Promise<any> {

        filter = filter || {}
        let where: any = {}
        if (filter.name) where.nome = Like(`%${filter.name}%`)

        return where
    }

}