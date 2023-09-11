-- CreateTable
CREATE TABLE "active_stores" (
    "shop" TEXT NOT NULL,
    "isActive" BOOLEAN DEFAULT false,

    CONSTRAINT "active_stores_pkey" PRIMARY KEY ("shop")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "content" TEXT,
    "shop" TEXT,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);
