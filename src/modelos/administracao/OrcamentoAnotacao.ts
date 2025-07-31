import { Entity, Column } from "typeorm";
import { CoreModelo } from "../../core/Modelo";


@Entity("orcamento_anotacao")
export class OrcamentoAnotacao extends CoreModelo{

    @Column({name:'id_orcamento'})
    idOrcamento: string;

    @Column()
    anotacao: string;
    
}