import { MigrationInterface, QueryRunner } from "typeorm";

export class UserFullName1724107454363 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME "name" TO "fullName"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME "fullName" TO "name"`);
    }

}
