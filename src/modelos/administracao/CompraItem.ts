import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn, Generated, Double } from "typeorm";
import { CoreModelo } from "../../core/Modelo";


@Entity("compra_item")
export class CompraItem extends CoreModelo{

    @Column({name:'id_compra'})
    idCompra: string;

    @Column({name:'id_produto'})
    idProduto: string;

    @Column({name:'id_servico'})
    idServico: string;

    @Column()
    quantidade: number;

    @Column()
    valor: number;
    
}