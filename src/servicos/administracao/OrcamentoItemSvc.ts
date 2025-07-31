import { CoreServicoCRUD } from "../../core/ServicoCrud";
import { CoreServicoCRUDControlador } from "../../core/ServicoCrudControlador";
import { OrcamentoItem } from "../../modelos/administracao/OrcamentoItem";



export class OrcamentoItemSvc extends CoreServicoCRUDControlador {
    modelo: any = OrcamentoItem;
}