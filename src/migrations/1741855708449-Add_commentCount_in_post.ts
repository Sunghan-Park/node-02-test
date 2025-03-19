import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCommentCountInPost1741855708449 implements MigrationInterface {
    name = 'AddCommentCountInPost1741855708449'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "commentCount" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "commentCount"`);
    }

}
