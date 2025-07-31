import { MigrationInterface, QueryRunner } from "typeorm"

export class createTableEndpoint1668554636455 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS endpoint(
            id varchar(36) primary key,
            name varchar(100) not null,
            method varchar(10) not null,
            endpoint varchar(150) not null,
            
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
        await queryRunner.query("DROP TABLE endpoint CASCADE;")
    }

}
