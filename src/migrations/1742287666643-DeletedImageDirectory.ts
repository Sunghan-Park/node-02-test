import { MigrationInterface, QueryRunner } from "typeorm";

export class DeletedImageDirectory1742287666643 implements MigrationInterface {
    name = 'DeletedImageDirectory1742287666643'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "directory"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" ADD "directory" character varying NOT NULL`);
    }

}
