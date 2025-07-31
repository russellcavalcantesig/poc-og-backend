import { MigrationInterface, QueryRunner } from "typeorm"

export class createTableUser1668481607069 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS user(
            id varchar(36) primary key not null,
            name varchar(50) not null,
            email varchar(100) not null unique,
            password varchar(32) not null,
            salt varchar(32) not null,
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
        await queryRunner.query("DROP TABLE user CASCADE;")
        
    }

}
