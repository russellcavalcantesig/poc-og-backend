import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn, Generated, Double } from "typeorm";
import { CoreModelo } from "../../core/Modelo";


@Entity("produto")
export class Produto extends CoreModelo{

    @Column({name:'id_fabricante'})
    idFabricante: string;

    @Column({name: 'codigo_sku'})
    codigoSku: string;

    @Column({name: 'codigo_ean'})
    codigoEan: string;
    
    @Column()
    nome: string;
    
    @Column()
    observacao: string;
    
    @Column()
    valor: number;

    @Column()
    estoque: number;

    @Column({name: 'valor_compra'})
    valorCompra: number;

    @Column({name:'estoque_minimo'})
    estoqueMinimo: string;

    @Column()
    estante: number;

    @Column()
    prateleira: number;
}