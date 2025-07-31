import { Entity, Column, PrimaryColumn } from "typeorm";


@Entity("acl_recurso")
export class Recurso{

    @PrimaryColumn({ primary: true })
    id: string;

    @Column({name: 'id_modulo'})
    idModulo: string;

    @Column()
    nome: string;

    @Column()
    identificador: string;

    @Column({ name: 'criado_em', type: 'timestamp', default: () => "CURRENT_TIMESTAMP", select: false })
    criadoEm: string

    @Column({ name: 'criado_por', type: 'uuid', select: false })
    criadoPor: string
}