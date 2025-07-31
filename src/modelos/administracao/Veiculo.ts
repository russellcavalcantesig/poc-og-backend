import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn, Generated } from "typeorm";
import { CoreModelo } from "../../core/Modelo";


@Entity("veiculo")
export class Veiculo extends CoreModelo{

    @Column()
    placa: string;

    @Column()
    descricao: string;
}