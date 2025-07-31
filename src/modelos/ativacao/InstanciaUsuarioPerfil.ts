import { Entity, Column, ManyToOne } from "typeorm";
import { CoreModelo } from "../../core/Modelo";
import { Usuario } from "./Usuario";

@Entity("instancia_usuario_perfil")
export class InstanciaUsuarioPerfil extends CoreModelo {

    @Column({name: 'id_usuario'})
    idUsuario: string;

    @Column({name: 'id_perfil'})
    idPerfil: string;
}