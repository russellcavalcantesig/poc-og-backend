import { MigrationInterface, QueryRunner } from "typeorm"

export class createTableProfile1668481603418 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS profile(
            id varchar(36) primary key,
            name varchar(50) not null unique,
            master integer default 0,

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
        await queryRunner.query("DROP TABLE profile CASCADE;")
    }

}
