/*
  Warnings:

  - You are about to drop the column `user_id` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Product` table. All the data in the column will be lost.
  - Added the required column `shop_id` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shop_id` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shop_id` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_user_id_fkey";

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "user_id",
ADD COLUMN     "shop_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "user_id",
ADD COLUMN     "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "shop_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "user_id",
ADD COLUMN     "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "shop_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "Shop" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "name" UUID NOT NULL,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Shop" ADD CONSTRAINT "Shop_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
