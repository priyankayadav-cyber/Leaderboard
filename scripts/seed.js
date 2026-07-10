const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function main() {
  const dataPath = path.join(__dirname, "../src/app/api/leaderboard/data.json");
  const rawData = fs.readFileSync(dataPath, "utf8");
  const dbData = JSON.parse(rawData);

  console.log("Seeding Tools...");
  for (const item of dbData.tools) {
    await prisma.tool.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        category: item.category,
        tags: JSON.stringify(item.tags || []),
        rank: parseInt(item.rank || 999, 10),
        growth: parseFloat(item.growth || 0),
        votes: parseInt(item.votes || 0, 10),
        rating: parseFloat(item.rating || 0),
        saves: parseInt(item.saves || 0, 10),
        url: item.url || "",
        description: item.description || "",
        pricing: item.pricing || "",
        visits: item.visits || "0",
        addedDate: item.addedDate || new Date().toISOString().split("T")[0]
      },
      create: {
        id: item.id,
        name: item.name,
        category: item.category,
        tags: JSON.stringify(item.tags || []),
        rank: parseInt(item.rank || 999, 10),
        growth: parseFloat(item.growth || 0),
        votes: parseInt(item.votes || 0, 10),
        rating: parseFloat(item.rating || 0),
        saves: parseInt(item.saves || 0, 10),
        url: item.url || "",
        description: item.description || "",
        pricing: item.pricing || "",
        visits: item.visits || "0",
        addedDate: item.addedDate || new Date().toISOString().split("T")[0]
      }
    });
  }

  console.log("Seeding Models...");
  for (const item of dbData.models) {
    await prisma.model.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        provider: item.provider,
        category: item.category,
        rank: parseInt(item.rank || 999, 10),
        growth: parseFloat(item.growth || 0),
        contextWindow: item.contextWindow || "",
        pricing: item.pricing || "",
        eloRating: parseInt(item.eloRating || 0, 10),
        benchmarkScore: parseFloat(item.benchmarkScore || 0),
        openSource: !!item.openSource,
        votes: parseInt(item.votes || 0, 10),
        rating: parseFloat(item.rating || 0),
        saves: parseInt(item.saves || 0, 10),
        description: item.description || "",
        visits: item.visits || "0"
      },
      create: {
        id: item.id,
        name: item.name,
        provider: item.provider,
        category: item.category,
        rank: parseInt(item.rank || 999, 10),
        growth: parseFloat(item.growth || 0),
        contextWindow: item.contextWindow || "",
        pricing: item.pricing || "",
        eloRating: parseInt(item.eloRating || 0, 10),
        benchmarkScore: parseFloat(item.benchmarkScore || 0),
        openSource: !!item.openSource,
        votes: parseInt(item.votes || 0, 10),
        rating: parseFloat(item.rating || 0),
        saves: parseInt(item.saves || 0, 10),
        description: item.description || "",
        visits: item.visits || "0"
      }
    });
  }

  console.log("Seeding Companies...");
  for (const item of dbData.companies) {
    await prisma.company.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        rank: parseInt(item.rank || 999, 10),
        growth: parseFloat(item.growth || 0),
        funding: item.funding || "",
        headquarters: item.headquarters || "",
        productsCount: parseInt(item.productsCount || 0, 10),
        modelsCount: parseInt(item.modelsCount || 0, 10),
        votes: parseInt(item.votes || 0, 10),
        rating: parseFloat(item.rating || 0),
        saves: parseInt(item.saves || 0, 10),
        description: item.description || "",
        visits: item.visits || "0"
      },
      create: {
        id: item.id,
        name: item.name,
        rank: parseInt(item.rank || 999, 10),
        growth: parseFloat(item.growth || 0),
        funding: item.funding || "",
        headquarters: item.headquarters || "",
        productsCount: parseInt(item.productsCount || 0, 10),
        modelsCount: parseInt(item.modelsCount || 0, 10),
        votes: parseInt(item.votes || 0, 10),
        rating: parseFloat(item.rating || 0),
        saves: parseInt(item.saves || 0, 10),
        description: item.description || "",
        visits: item.visits || "0"
      }
    });
  }

  console.log("Database seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
