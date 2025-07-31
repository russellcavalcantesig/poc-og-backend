import { MigrationInterface, QueryRunner } from "typeorm"
export class insertsProfileUserInstance1668484172049 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        const uuid = '590bbf4f-3e19-487c-ab4e-5c847fc414eb'
        let sql = `INSERT INTO profile(id, name, master, created_at, created_by) 
        VALUES('${uuid}', 'Master', 1, now(), '590bbf4f-3e19-487c-ab4e-5c847fc414eb');`
        queryRunner.query(sql)

        const md5 = require('md5');
        const salt = md5(new Date().getTime())
        const password = md5(`${salt}@123456`)
        sql = `INSERT INTO user(id, name, email, password, salt, created_at, created_by) 
        VALUES('${uuid}', 'Master', 'master', '${password}', '${salt}', now(), '${uuid}');`
        queryRunner.query(sql)

        sql = `INSERT INTO instance(id, name, created_at, created_by) 
        VALUES('${uuid}', 'Main', now(), '${uuid}');`
        queryRunner.query(sql)

        sql = `INSERT INTO instance_user_profile(id, id_user, id_profile, id_instance, created_at, created_by) 
        VALUES('${uuid}', '${uuid}', '${uuid}', '${uuid}', now(), '${uuid}');`
        queryRunner.query(sql)

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
    }

}
