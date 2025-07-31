import { CoreServicoCRUD } from "../../core/ServicoCrud";
import { CoreServicoCRUDControlador } from "../../core/ServicoCrudControlador";
import { VendaPagamento } from "../../modelos/administracao/VendaPagamento";


export class VendaPagamentoSvc extends CoreServicoCRUDControlador {
    modelo: any = VendaPagamento;
}