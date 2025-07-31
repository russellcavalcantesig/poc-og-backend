import { Entity, Column, PrimaryColumn } from "typeorm";


@Entity("acl_Svc")
export class Servico{

    @PrimaryColumn({ primary: true })
    id: string;

    @Column({name: 'id_recurso'})
    idRecurso: string;

    @Column()
    nome: string;

    @Column()
    metodo: string;

    @Column()
    url: string;

    @Column({ name: 'criado_em', type: 'timestamp', default: () => "CURRENT_TIMESTAMP", select: false })
    criadoEm: string

    @Column({ name: 'criado_por', type: 'uuid', select: false })
    criadoPor: string
}