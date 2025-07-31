import { get } from "lodash";
import { CoreServicoCRUD } from "../../core/ServicoCrud";
import { Veiculo } from "../../modelos/administracao/Veiculo";
import { Like } from "typeorm";
import { CoreServicoCRUDControlador } from "../../core/ServicoCrudControlador";


export class VeiculoSvc extends CoreServicoCRUDControlador {
    modelo: any = Veiculo;

    async _consultarRegistros_Filtro(filter: any): Promise<any> {

        filter = filter || {}
        let where: any = {}
        if (filter.placa) where.placa = Like(`%${filter.placa}%`)
        if (filter.descricao) where.descricao = Like(`%${filter.descricao}%`)

        return where
    }

    _consultarListaOpcoes_Campos: any = { id: true, descricao: true, placa: true }
    async _consultarListaOpcoesFormat(registros: any) {
        return registros.map((option: any) => {
            const opcao = `${get(option, 'placa')} - ${get(option, 'descricao')}`
            return { codigo: option.id, opcao }
        })
    }
}