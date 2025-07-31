import { CoreServicoCRUD } from "../../core/ServicoCrud";
import { CoreServicoCRUDControlador } from "../../core/ServicoCrudControlador";
import { OrcamentoAnotacao } from "../../modelos/administracao/OrcamentoAnotacao";



export class OrcamentoAnotacaoSvc extends CoreServicoCRUDControlador {
    modelo: any = OrcamentoAnotacao;
}