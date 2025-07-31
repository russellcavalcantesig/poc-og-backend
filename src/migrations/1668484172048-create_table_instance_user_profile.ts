import { MigrationInterface, QueryRunner } from "typeorm"

export class createTableInstanceUserProfile1668484172048 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS instance_user_profile(
            id varchar(36) primary key,
            id_instance varchar(36),
            id_user varchar(36),
            id_profile varchar(36),
            
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
        await queryRunner.query("DROP TABLE instance_user_profile CASCADE;")
    }

}
