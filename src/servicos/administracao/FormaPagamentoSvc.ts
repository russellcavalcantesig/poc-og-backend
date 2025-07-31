import { Like } from "typeorm";
import { CoreServicoCRUD } from "../../core/ServicoCrud";
import { FormaPagamento } from "../../modelos/administracao/FormaPagamento";
import { CoreServicoCRUDControlador } from "../../core/ServicoCrudControlador";

export class FormaPagamentoSvc extends CoreServicoCRUDControlador {
    modelo: any = FormaPagamento;

    async _consultarRegistros_Filtro(filter: any): Promise<any> {

        filter = filter || {}
        let where: any = {}
        if (filter.name) where.nome = Like(`%${filter.name}%`)

        return where
    }

}