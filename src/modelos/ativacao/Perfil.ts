import { Entity, Column } from "typeorm";
import { CoreModelo } from "../../core/Modelo";

@Entity("perfil")
export class Perfil extends CoreModelo {

    @Column({ nullable: false })
    nome: string;

}