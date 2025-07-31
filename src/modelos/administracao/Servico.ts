import { Entity, Column } from "typeorm";
import { CoreModelo } from "../../core/Modelo";


@Entity("servico")
export class Servico extends CoreModelo {

    @Column()
    nome: string;

    @Column()
    valor: number;
}