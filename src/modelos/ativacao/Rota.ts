import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn, Generated } from "typeorm";
import { CoreModelo } from "../../core/Modelo";

@Entity("rota")
export class Rota extends CoreModelo{

    @Column({ nullable: false, length: 100})
    nome: string;

    @Column({ nullable: false, length: 10 })
    metodo: string;

    @Column({ nullable: false, length: 150 })
    caminho: string;

}