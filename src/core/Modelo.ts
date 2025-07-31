import { Column, PrimaryColumn } from "typeorm";

export class CoreModelo {

    @PrimaryColumn({ primary: true })
    id: string;

    @Column({ name: 'id_instancia', select: false })
    idInstancia: string

    @Column({ name: 'criado_em', type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    criadoEm: string

    @Column({ name: 'criado_por', type: 'uuid' })
    criadoPor: string

    @Column({ name: 'atualizado_em', type: 'timestamp' })
    atualizadoEm: string

    @Column({ name: 'atualizado_por', type: 'uuid' })
    atualizadoPor: string
}