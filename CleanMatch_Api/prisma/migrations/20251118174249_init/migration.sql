/*
  Warnings:

  - You are about to alter the column `tipo_conta` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `token` MODIFY `token` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `usuario` MODIFY `tipo_conta` VARCHAR(191) NOT NULL;
