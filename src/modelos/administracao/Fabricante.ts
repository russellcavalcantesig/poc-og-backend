import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn, Generated } from "typeorm";
import { CoreModelo } from "../../core/Modelo";


@Entity("fabricante")
export class Fabricante extends CoreModelo{

    @Column()
    nome: string;

}