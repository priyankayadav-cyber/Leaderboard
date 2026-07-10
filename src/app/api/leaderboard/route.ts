import { Hono } from "hono";
import { handle } from "hono/nextjs";
import { prisma } from "@/lib/prisma";

const app = new Hono().basePath("/api/leaderboard");

app.get("/", async (c) => {
  try {
    // 1. Extract queries
    const tab = c.req.query("tab") || "tools";
    const search = c.req.query("search") || "";
    const sort = c.req.query("sort") || "rank";
    const category = c.req.query("category") || "all";
    const pricing = c.req.query("pricing") || "all";
    const openSource = c.req.query("openSource") || "all";
    const page = parseInt(c.req.query("page") || "1", 10);
    const limit = parseInt(c.req.query("limit") || "10", 10);

    // Dynamic error/delay simulators for manual checks
    const delay = c.req.query("delay");
    if (delay) {
      const delayMs = parseInt(delay, 10);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    const forceError = c.req.query("error");
    if (forceError === "true") {
      return c.json(
        { error: "Database connection failed. Please try again." },
        500
      );
    }

    // 2. Build where filter
    const where: any = {};

    // Search filter
    if (search.trim()) {
      const q = search.trim();
      if (tab === "tools") {
        where.OR = [
          { name: { contains: q } },
          { description: { contains: q } },
          { category: { contains: q } },
          { tags: { contains: q } }
        ];
      } else if (tab === "models") {
        where.OR = [
          { name: { contains: q } },
          { provider: { contains: q } },
          { description: { contains: q } }
        ];
      } else if (tab === "companies") {
        where.OR = [
          { name: { contains: q } },
          { description: { contains: q } },
          { headquarters: { contains: q } }
        ];
      }
    }

    // Category filter
    if (category !== "all") {
      where.category = {
        equals: category
      };
    }

    // Pricing filter
    if (pricing !== "all" && tab === "tools") {
      where.pricing = {
        equals: pricing
      };
    }

    // Open Source filter
    if (openSource !== "all" && tab === "models") {
      where.openSource = openSource === "true";
    }

    // 3. Build Sorting
    const orderBy: any = {};
    if (sort === "growth") {
      orderBy.growth = "desc";
    } else if (sort === "votes") {
      orderBy.votes = "desc";
    } else if (sort === "rating") {
      orderBy.rating = "desc";
    } else if (sort === "saves") {
      orderBy.saves = "desc";
    } else if (sort === "newest" && tab === "tools") {
      orderBy.addedDate = "desc";
    } else {
      orderBy.rank = "asc";
    }

    // 4. Fetch Paginated Data & Totals
    const skip = (page - 1) * limit;
    let paginatedItems: any[] = [];
    let totalCount = 0;

    if (tab === "models") {
      totalCount = await prisma.model.count({ where });
      paginatedItems = await prisma.model.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      });
    } else if (tab === "companies") {
      totalCount = await prisma.company.count({ where });
      paginatedItems = await prisma.company.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      });
    } else {
      totalCount = await prisma.tool.count({ where });
      const dbItems = await prisma.tool.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      });
      // Parse tags back into array format
      paginatedItems = dbItems.map((item) => ({
        ...item,
        tags: JSON.parse(item.tags || "[]")
      }));
    }

    const totalPages = Math.ceil(totalCount / limit);

    // 5. Compute distinct categories list dynamically
    let categoriesList: string[] = [];
    if (tab === "tools") {
      const distinctCats = await prisma.tool.findMany({
        select: { category: true },
        distinct: ["category"],
      });
      categoriesList = distinctCats.map((t) => t.category).sort();
    } else if (tab === "models") {
      const distinctCats = await prisma.model.findMany({
        select: { category: true },
        distinct: ["category"],
      });
      categoriesList = distinctCats.map((m) => m.category).sort();
    }

    // 6. Compute overall Stats card metrics
    const totalToolsCount = await prisma.tool.count();
    const totalModelsCount = await prisma.model.count();
    const totalCompaniesCount = await prisma.company.count();

    const toolVotes = await prisma.tool.aggregate({ _sum: { votes: true } });
    const modelVotes = await prisma.model.aggregate({ _sum: { votes: true } });
    const companyVotes = await prisma.company.aggregate({ _sum: { votes: true } });
    const totalVotesSum = (toolVotes._sum.votes || 0) + (modelVotes._sum.votes || 0) + (companyVotes._sum.votes || 0);

    return c.json({
      items: paginatedItems,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        limit,
      },
      categories: categoriesList,
      stats: {
        totalTools: totalToolsCount,
        totalModels: totalModelsCount,
        totalCompanies: totalCompaniesCount,
        totalVotes: totalVotesSum,
        hotCategory: "Code Assistant",
      },
    });
  } catch (error) {
    console.error("Leaderboard Hono API Error:", error);
    return c.json({ error: "Internal server error." }, 500);
  }
});

export const GET = handle(app);
