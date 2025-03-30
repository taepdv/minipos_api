/*
  Warnings:

  - You are about to drop the column `Level` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `Username` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `User_Username_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `Level`,
    DROP COLUMN `Username`,
    ADD COLUMN `level` VARCHAR(191) NOT NULL DEFAULT 'user',
    ADD COLUMN `username` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `unit` VARCHAR(191) NOT NULL,
    `price_buy` INTEGER NOT NULL,
    `price_sell` INTEGER NOT NULL,
    `image` VARCHAR(191) NULL,
    `date_add` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_username_key` ON `User`(`username`);
