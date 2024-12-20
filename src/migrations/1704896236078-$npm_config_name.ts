import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1704896236078 implements MigrationInterface {
    name = ' $npmConfigName1704896236078'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_273c845aa82bb40a58e75d5673\` ON \`resource_project\``);
        await queryRunner.query(`ALTER TABLE \`resource_project\` ADD \`startDate\` varchar(255) NOT NULL`);
        await queryRunner.query(`CREATE INDEX \`IDX_d37e6213b81b6fcb7e9fe6f0e5\` ON \`resource_project\` (\`resourceId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_273c845aa82bb40a58e75d5673\` ON \`resource_project\` (\`projectId\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_273c845aa82bb40a58e75d5673\` ON \`resource_project\``);
        await queryRunner.query(`DROP INDEX \`IDX_d37e6213b81b6fcb7e9fe6f0e5\` ON \`resource_project\``);
        await queryRunner.query(`ALTER TABLE \`resource_project\` DROP COLUMN \`startDate\``);
        await queryRunner.query(`CREATE INDEX \`IDX_273c845aa82bb40a58e75d5673\` ON \`resource_project\` (\`projectId\`)`);
    }

}
