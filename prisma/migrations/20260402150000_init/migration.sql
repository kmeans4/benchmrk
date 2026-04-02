-- CreateEnum
CREATE TYPE "LicenseType" AS ENUM ('OpenWeights', 'Proprietary', 'ResearchOnly', 'CommercialAllowed', 'Unknown');

-- CreateEnum
CREATE TYPE "HostingType" AS ENUM ('CloudOnly', 'LocalOnly', 'Both', 'Unknown');

-- CreateEnum
CREATE TYPE "Modality" AS ENUM ('Text', 'Image', 'Audio', 'Video', 'Code');

-- CreateEnum
CREATE TYPE "EvaluationMethod" AS ENUM ('Automatic', 'HumanJudged', 'Mixed', 'Unknown');

-- CreateEnum
CREATE TYPE "ScoreType" AS ENUM ('Accuracy', 'PassAtK', 'Elo', 'Percentage', 'Raw', 'Normalized', 'Unknown');

-- CreateEnum
CREATE TYPE "Reliability" AS ENUM ('High', 'Medium', 'Low', 'Unknown');

-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3),
    "contextWindow" INTEGER,
    "parameterCount" BIGINT,
    "licenseType" "LicenseType" NOT NULL,
    "hostingType" "HostingType" NOT NULL,
    "hardwareRequirements" TEXT,
    "knowledgeCutoff" TIMESTAMP(3),
    "architecture" TEXT,
    "trainingDataSource" TEXT,
    "inferenceCostPer1M" TEXT,
    "quantizationOptions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Benchmark" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "skillAreaId" TEXT NOT NULL,
    "description" TEXT,
    "license" TEXT,
    "evaluationMethod" "EvaluationMethod" NOT NULL,
    "scoreType" "ScoreType" NOT NULL,
    "scoreInterpretation" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "leaderboardUrl" TEXT,
    "lastUpdated" TIMESTAMP(3),
    "modelCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Benchmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Score" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "benchmarkId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "scoreDate" TIMESTAMP(3),
    "sourceId" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillArea" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkillArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "skillAreaId" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "reliability" "Reliability" NOT NULL DEFAULT 'Unknown',
    "isOfficial" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ModelToSkillArea" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ModelToSkillArea_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ModelToCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ModelToCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Model_name_idx" ON "Model"("name");

-- CreateIndex
CREATE INDEX "Model_provider_idx" ON "Model"("provider");

-- CreateIndex
CREATE INDEX "Model_licenseType_idx" ON "Model"("licenseType");

-- CreateIndex
CREATE INDEX "Model_hostingType_idx" ON "Model"("hostingType");

-- CreateIndex
CREATE INDEX "Benchmark_name_idx" ON "Benchmark"("name");

-- CreateIndex
CREATE INDEX "Benchmark_category_idx" ON "Benchmark"("category");

-- CreateIndex
CREATE INDEX "Benchmark_skillAreaId_idx" ON "Benchmark"("skillAreaId");

-- CreateIndex
CREATE UNIQUE INDEX "Score_modelId_benchmarkId_sourceId_key" ON "Score"("modelId", "benchmarkId", "sourceId");

-- CreateIndex
CREATE INDEX "Score_modelId_idx" ON "Score"("modelId");

-- CreateIndex
CREATE INDEX "Score_benchmarkId_idx" ON "Score"("benchmarkId");

-- CreateIndex
CREATE INDEX "Score_value_idx" ON "Score"("value");

-- CreateIndex
CREATE UNIQUE INDEX "SkillArea_name_key" ON "SkillArea"("name");

-- CreateIndex
CREATE INDEX "SkillArea_name_idx" ON "SkillArea"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Category_name_idx" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Category_skillAreaId_idx" ON "Category"("skillAreaId");

-- CreateIndex
CREATE INDEX "Source_name_idx" ON "Source"("name");

-- CreateIndex
CREATE INDEX "_ModelToSkillArea_B_index" ON "_ModelToSkillArea"("B");

-- CreateIndex
CREATE INDEX "_ModelToCategory_B_index" ON "_ModelToCategory"("B");

-- AddForeignKey
ALTER TABLE "Benchmark" ADD CONSTRAINT "Benchmark_skillAreaId_fkey" FOREIGN KEY ("skillAreaId") REFERENCES "SkillArea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_benchmarkId_fkey" FOREIGN KEY ("benchmarkId") REFERENCES "Benchmark"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_skillAreaId_fkey" FOREIGN KEY ("skillAreaId") REFERENCES "SkillArea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModelToSkillArea" ADD CONSTRAINT "_ModelToSkillArea_A_fkey" FOREIGN KEY ("A") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModelToSkillArea" ADD CONSTRAINT "_ModelToSkillArea_B_fkey" FOREIGN KEY ("B") REFERENCES "SkillArea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModelToCategory" ADD CONSTRAINT "_ModelToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModelToCategory" ADD CONSTRAINT "_ModelToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
