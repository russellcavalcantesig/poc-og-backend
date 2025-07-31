import { Entity, Column} from "typeorm";
import { CoreModelo } from "../../core/Modelo";

@Entity("forma_pagamento")
export class FormaPagamento extends CoreModelo{

    @Column()
    nome: string;

    @Column({name: 'exige_data_pagamento'})
    exigeDataPagamento: string;
}