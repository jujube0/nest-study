import {MigrationInterface, QueryRunner} from "typeorm";

export class CoffeeRefactor1626325978666 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> { // what needs to be changed and how
        await queryRunner.query(
            `DROP TABLE "coffee" RENAME COLUMN "title" TO "name"`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> { // undo or roll back
        await queryRunner.query(
            `ALTER TABLE "coffee" RENAME COLUMN "title" TO "name"`
        )
    }

}
