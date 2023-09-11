-- CreateTable
CREATE TABLE "requests" (
    "id" SERIAL NOT NULL,
    "content" JSONB,

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);
