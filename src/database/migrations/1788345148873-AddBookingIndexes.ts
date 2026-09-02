import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBookingIndexes1788345148873 implements MigrationInterface {
  name = 'AddBookingIndexes1788345148873';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_336b3f4a235460dc93645fbf22" ON "booking" ("userId")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0b58432fa292e08deed0cae0c5" ON "booking" ("establishmentId")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ff68e64910273e0d4d22f8fce0" ON "booking" ("establishmentId", "bookingDate", "bookingTime")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ff68e64910273e0d4d22f8fce0"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0b58432fa292e08deed0cae0c5"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_336b3f4a235460dc93645fbf22"`
    );
  }
}
