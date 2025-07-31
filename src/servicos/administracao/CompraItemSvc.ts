import { CoreServicoCRUD } from "../../core/ServicoCrud";
import { CoreServicoCRUDControlador } from "../../core/ServicoCrudControlador";
import { CompraItem } from "../../modelos/administracao/CompraItem";



export class CompraItemSvc extends CoreServicoCRUDControlador {
    modelo: any = CompraItem;
}