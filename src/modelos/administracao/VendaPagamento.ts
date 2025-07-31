import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn, Generated, Double } from "typeorm";
import { CoreModelo } from "../../core/Modelo";


@Entity("venda_pagamento")
export class VendaPagamento extends CoreModelo{

    @Column({name:'id_venda'})
    idVenda: string;

    @Column({name:'id_forma_pagamento'})
    idFormaPagamento: string;

    @Column({name:'data_pagamento'})
    dataPagamento: Date;

    @Column()
    valor: number;

    @Column()
    pago: number;

}