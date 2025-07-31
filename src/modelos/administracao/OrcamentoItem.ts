import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn, Generated, Double } from "typeorm";
import { CoreModelo } from "../../core/Modelo";


@Entity("orcamento_item")
export class OrcamentoItem extends CoreModelo{

    @Column({name:'id_orcamento'})
    idOrcamento: string;

    @Column({name:'id_produto'})
    idProduto: string;

    @Column({name:'id_servico'})
    idServico: string;

    @Column()
    quantidade: number;

    @Column()
    valor: number;
    
}