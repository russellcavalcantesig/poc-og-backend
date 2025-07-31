import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn, Generated, Double } from "typeorm";
import { CoreModelo } from "../../core/Modelo";


@Entity("orcamento")
export class Orcamento extends CoreModelo{

    @Column()
    codigo: string;

    @Column({name:'id_cliente'})
    idCliente: string;

    @Column({name:'id_veiculo'})
    idVeiculo: string;

    @Column()
    observacao: string;

    @Column()
    status: number;
    
    @Column()
    desconto: number;

    @Column()
    total: number;
    
   
}