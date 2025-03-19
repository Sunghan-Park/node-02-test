import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserRole1742245107379 implements MigrationInterface {
    name = 'AddUserRole1742245107379'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "role" character varying NOT NULL DEFAULT 'user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
    }

}
