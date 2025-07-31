import { Like } from "typeorm";
import { CoreServicoCRUD } from "../../core/ServicoCrud";
import { Fornecedor } from "../../modelos/administracao/Fornecedor";
import { CoreServicoCRUDControlador } from "../../core/ServicoCrudControlador";


export class FornecedorSvc extends CoreServicoCRUDControlador {
    modelo: any = Fornecedor;

    async _consultarRegistros_Filtro(filter: any): Promise<any> {

        filter = filter || {}
        let where: any = {}
        if (filter.name) where.nome = Like(`%${filter.name}%`)

        return where
    }
}