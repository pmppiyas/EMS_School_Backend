/*
Warnings:

- Changed the type of `roll` on the `students` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
-- migration.sql এর ভেতর এই লাইনটি ব্যবহার করুন
ALTER TABLE "students" ALTER COLUMN "roll" TYPE INTEGER USING ("roll"::integer);
