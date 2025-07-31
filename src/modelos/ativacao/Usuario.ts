import { Entity, Column } from "typeorm";
import { CoreModelo } from "../../core/Modelo";

@Entity("usuario")
export class Usuario extends CoreModelo {

    @Column()
    nome: string;

    @Column()
    email: string;

    @Column({ length: 32 })
    senha: string;

    @Column({ length: 32 })
    salt: string
}