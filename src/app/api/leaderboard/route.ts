import { Hono } from "hono";
import { handle } from "hono/vercel";
import data from "./data.json";

const app = new Hono().basePath("/api/leaderboard");

app.get("/", async (c) => {
  try {
    const tab = c.req.query("tab") || "tools";
    const search = (c.req.query("search") || "").trim().toLowerCase();
    const sort = c.req.query("sort") || "rank";
    const category = c.req.query("category") || "all";
    const pricing = c.req.query("pricing") || "all";
    const openSource = c.req.query("openSource") || "all";
    const page = parseInt(c.req.query("page") || "1", 10);
    const limit = parseInt(c.req.query("limit") || "10", 10);

    // Pick the right dataset
    let allItems: any[] = [];
    if (tab === "models") {
      allItems = data.models ?? [];
    } else if (tab === "companies") {
      allItems = data.companies ?? [];
    } else {
      allItems = data.tools ?? [];
    }

    // Search filter
    if (search) {
      allItems = allItems.filter((item) => {
        const fields = [item.name, item.description, item.category, item.tags, item.provider, item.headquarters]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return fields.includes(search);
      });
    }

    // Category filter
    if (category !== "all") {
      allItems = allItems.filter(
        (item) => item.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Pricing filter (tools only)
    if (pricing !== "all" && tab === "tools") {
      allItems = allItems.filter(
        (item) => item.pricing?.toLowerCase() === pricing.toLowerCase()
      );
    }

    // Open source filter (models only)
    if (openSource !== "all" && tab === "models") {
      allItems = allItems.filter(
        (item) => String(item.openSource) === openSource
      );
    }

    // Sorting
    allItems = [...allItems].sort((a, b) => {
      if (sort === "growth") return (b.growth ?? 0) - (a.growth ?? 0);
      if (sort === "votes") return (b.votes ?? 0) - (a.votes ?? 0);
      if (sort === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      if (sort === "saves") return (b.saves ?? 0) - (a.saves ?? 0);
      if (sort === "newest" && tab === "tools") return (b.addedDate ?? "").localeCompare(a.addedDate ?? "");
      return (a.rank ?? 0) - (b.rank ?? 0); // default: rank asc
    });

    const totalCount = allItems.length;
    const totalPages = Math.ceil(totalCount / limit);
    const skip = (page - 1) * limit;
    const paginatedItems = allItems.slice(skip, skip + limit);

    // Categories list
    let categoriesList: string[] = [];
    if (tab === "tools") {
      categoriesList = [...new Set((data.tools ?? []).map((t: any) => t.category).filter(Boolean))].sort();
    } else if (tab === "models") {
      categoriesList = [...new Set((data.models ?? []).map((m: any) => m.category).filter(Boolean))].sort();
    }

    // Stats
    const totalTools = (data.tools ?? []).length;
    const totalModels = (data.models ?? []).length;
    const totalCompanies = (data.companies ?? []).length;
    const totalVotes =
      (data.tools ?? []).reduce((s: number, t: any) => s + (t.votes ?? 0), 0) +
      (data.models ?? []).reduce((s: number, m: any) => s + (m.votes ?? 0), 0) +
      (data.companies ?? []).reduce((s: number, c: any) => s + (c.votes ?? 0), 0);

    return c.json({
      items: paginatedItems,
      pagination: { totalCount, totalPages, currentPage: page, limit },
      categories: categoriesList,
      stats: {
        totalTools,
        totalModels,
        totalCompanies,
        totalVotes,
        hotCategory: "Code Assistant",
      },
    });
  } catch (error) {
    console.error("Leaderboard API Error:", error);
    return c.json({ error: "Internal server error." }, 500);
  }
});

export const GET = handle(app);
