import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnSocialIdAndRegisterType1742530210967 implements MigrationInterface {
    name = 'AddColumnSocialIdAndRegisterType1742530210967'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "socialId" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."user_registertype_enum" AS ENUM('google', 'kakao', 'naver', 'normal')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "registerType" "public"."user_registertype_enum" NOT NULL DEFAULT 'normal'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "registerType"`);
        await queryRunner.query(`DROP TYPE "public"."user_registertype_enum"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "socialId"`);
    }

}
