import { Entity, Column, Generated, PrimaryColumn } from "typeorm";
import { CoreModelo } from "../../core/Modelo";


@Entity("instancia")
export class Instancia extends CoreModelo {

    @Column({ nullable: false })
    nome: string;

}