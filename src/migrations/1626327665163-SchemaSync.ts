import {MigrationInterface, QueryRunner} from "typeorm";

export class SchemaSync1626327665163 implements MigrationInterface {
    name = 'SchemaSync1626327665163'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "event" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "name" character varying NOT NULL, "payload" json NOT NULL, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b535fbe8ec6d832dde22065ebd" ON "event" ("name") `);
        await queryRunner.query(`ALTER TABLE "coffee" ADD "description" character varying`);
        await queryRunner.query(`ALTER TABLE "coffee" ADD "recommendations" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coffee" DROP COLUMN "recommendations"`);
        await queryRunner.query(`ALTER TABLE "coffee" DROP COLUMN "description"`);
        await queryRunner.query(`DROP INDEX "IDX_b535fbe8ec6d832dde22065ebd"`);
        await queryRunner.query(`DROP TABLE "event"`);
    }

}
