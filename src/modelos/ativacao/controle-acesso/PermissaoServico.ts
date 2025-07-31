import { Entity, Column, PrimaryColumn } from "typeorm";


@Entity("acl_permissao_servico")
export class PermissaoServico{

    @PrimaryColumn({ primary: true })
    id: string;

    @Column({name: 'id_permissao'})
    idPermissao: string;

    @Column({name: 'id_servico'})
    idServico: string;

    @Column({ name: 'criado_em', type: 'timestamp', default: () => "CURRENT_TIMESTAMP", select: false })
    criadoEm: string

    @Column({ name: 'criado_por', type: 'uuid', select: false })
    criadoPor: string
}