-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "categoryId" TEXT,
ALTER COLUMN "category" DROP NOT NULL,
ALTER COLUMN "categoryIcon" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
