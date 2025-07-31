import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn, Generated, Double } from "typeorm";
import { CoreModelo } from "../../core/Modelo";



@Entity("compra")
export class Compra extends CoreModelo{

    @Column({name:'id_fornecedor'})
    idFornecedor: string;

    @Column()
    status: number;

    @Column()
    observacao: string;
    
    @Column()
    desconto: number;
    
    @Column()
    nfe: string;
}