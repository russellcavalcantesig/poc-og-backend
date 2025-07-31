import { MigrationInterface, QueryRunner } from "typeorm"

export class createTableInstance1668481621308 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS instance(
            id varchar(36) primary key,
            name varchar(50) not null unique,
            
            created_at timestamp default now() not null,
            created_by varchar(36) not null,
            updated_at timestamp,
            updated_by varchar(36),
            removed_at timestamp,
            removed_by varchar(36)
            )
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE instance CASCADE;")
    }

}
