import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn, Generated } from "typeorm";
import { CoreModelo } from "../../core/Modelo";


@Entity("fornecedor")
export class Fornecedor extends CoreModelo{

    @Column()
    nome: string;

    @Column()
    whatsapp: string;

    @Column()
    contato: string;
}