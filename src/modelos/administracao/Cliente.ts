import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn, Generated } from "typeorm";
import { CoreModelo } from "../../core/Modelo";



@Entity("cliente")
export class Cliente extends CoreModelo{

    @Column()
    nome: string;

    @Column()
    whatsapp: string;
}