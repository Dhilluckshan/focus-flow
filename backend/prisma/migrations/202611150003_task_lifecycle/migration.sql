ALTER TABLE "Task" ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Task" ADD COLUMN "deletedAt" DATETIME;
CREATE INDEX "Task_deletedAt_createdAt_id_idx" ON "Task"("deletedAt", "createdAt", "id");
CREATE INDEX "Task_deletedAt_dueDate_id_idx" ON "Task"("deletedAt", "dueDate", "id");
CREATE INDEX "Task_deletedAt_status_createdAt_id_idx" ON "Task"("deletedAt", "status", "createdAt", "id");
CREATE INDEX "Task_deletedAt_status_dueDate_id_idx" ON "Task"("deletedAt", "status", "dueDate", "id");
