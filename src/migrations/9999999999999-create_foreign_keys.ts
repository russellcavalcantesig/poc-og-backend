import { MigrationInterface, QueryRunner } from "typeorm"
export class createForeignKeys9999999999999 implements MigrationInterface {

    tablesAuditForeignKeys = [
        'profile',
        'user',
        'instance',
        'instance_user_profile'
    ]

    foreignKeys = [
        {table: 'instance_user_profile', field: 'id_profile', fkTable: 'profile', fkField: 'id'},
        {table: 'instance_user_profile', field: 'id_user', fkTable: 'user', fkField: 'id'},
        {table: 'instance_user_profile', field: 'id_instance', fkTable: 'instance', fkField: 'id'}
    ]

    public async up(queryRunner: QueryRunner): Promise<void> {
        this.createAuditForeignKeys(queryRunner)
        this.createForeignKeys(queryRunner)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        this.dropAuditForeignKeys(queryRunner)
        this.dropForeignKeys(queryRunner)
    }

    async dropAuditForeignKeys(queryRunner: QueryRunner){
        for (let i = 0; i <= this.tablesAuditForeignKeys.length - 1; i++) {
            const table = this.tablesAuditForeignKeys[i]
            queryRunner.query(`ALTER TABLE ${table} 
            DROP CONSTRAINT ${table}_inserirRegistrod_by_fk`)
            queryRunner.query(`ALTER TABLE ${table}  
            DROP CONSTRAINT ${table}_atualizarRegistrod_by_fk`)
            queryRunner.query(`ALTER TABLE ${table}  
            DROP CONSTRAINT ${table}_removerRegistrod_by_fk`)
        }
    }

    async createAuditForeignKeys(queryRunner: QueryRunner){
        for (let i = 0; i <= this.tablesAuditForeignKeys.length - 1; i++) {
            const table = this.tablesAuditForeignKeys[i]
            queryRunner.query(`ALTER TABLE ${table} 
            ADD CONSTRAINT ${table}_inserirRegistrod_by_fk
            FOREIGN KEY(created_by)
            REFERENCES user(id) ON DELETE CASCADE`)
            queryRunner.query(`ALTER TABLE ${table}  
            ADD CONSTRAINT ${table}_atualizarRegistrod_by_fk
            FOREIGN KEY(updated_by)
            REFERENCES user(id) ON DELETE CASCADE`)
            queryRunner.query(`ALTER TABLE ${table}  
            ADD CONSTRAINT ${table}_removerRegistrod_by_fk
            FOREIGN KEY(removed_by)
            REFERENCES user(id) ON DELETE CASCADE`)
        }
    }

    async createForeignKeys(queryRunner: QueryRunner){
        for (let i = 0; i <= this.foreignKeys.length - 1; i++) {
            const fk = this.foreignKeys[i]
            queryRunner.query(`ALTER TABLE ${fk.table} 
            ADD CONSTRAINT ${fk.table}_${fk.field}_fk
            FOREIGN KEY(${fk.field})
            REFERENCES ${fk.fkTable}(${fk.fkField}) ON DELETE CASCADE`)
        }
    }

    async dropForeignKeys(queryRunner: QueryRunner){
        for (let i = 0; i <= this.foreignKeys.length - 1; i++) {
            const fk = this.foreignKeys[i]
            queryRunner.query(`ALTER TABLE ${fk.table} 
            DROP CONSTRAINT ${fk.table}_${fk.field}_fk`)
        }
    }

}
