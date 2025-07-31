import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn, Generated, Double } from "typeorm";
import { CoreModelo } from "../../core/Modelo";


@Entity("venda")
export class Venda extends CoreModelo{

    @Column({name:'id_orcamento'})
    idOrcamento: string;

}