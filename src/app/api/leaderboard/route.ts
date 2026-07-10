import { NextRequest, NextResponse } from "next/server";
import { data } from "./data";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tab = searchParams.get("tab") || "tools";
    const search = (searchParams.get("search") || "").trim().toLowerCase();
    const sort = searchParams.get("sort") || "rank";
    const category = searchParams.get("category") || "all";
    const pricing = searchParams.get("pricing") || "all";
    const openSource = searchParams.get("openSource") || "all";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Pick the right dataset
    let allItems: any[] = [];
    if (tab === "models") {
      allItems = [...(data.models ?? [])];
    } else if (tab === "companies") {
      allItems = [...(data.companies ?? [])];
    } else {
      allItems = [...(data.tools ?? [])];
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
    allItems.sort((a, b) => {
      if (sort === "growth") return (b.growth ?? 0) - (a.growth ?? 0);
      if (sort === "votes") return (b.votes ?? 0) - (a.votes ?? 0);
      if (sort === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      if (sort === "saves") return (b.saves ?? 0) - (a.saves ?? 0);
      if (sort === "newest" && tab === "tools")
        return (b.addedDate ?? "").localeCompare(a.addedDate ?? "");
      return (a.rank ?? 0) - (b.rank ?? 0);
    });

    const totalCount = allItems.length;
    const totalPages = Math.ceil(totalCount / limit);
    const skip = (page - 1) * limit;
    const paginatedItems = allItems.slice(skip, skip + limit);

    // Categories list
    let categoriesList: string[] = [];
    if (tab === "tools") {
      categoriesList = [
        ...new Set((data.tools ?? []).map((t: any) => t.category).filter(Boolean)),
      ].sort();
    } else if (tab === "models") {
      categoriesList = [
        ...new Set((data.models ?? []).map((m: any) => m.category).filter(Boolean)),
      ].sort();
    }

    // Stats
    const totalTools = (data.tools ?? []).length;
    const totalModels = (data.models ?? []).length;
    const totalCompanies = (data.companies ?? []).length;
    const totalVotes =
      (data.tools ?? []).reduce((s: number, t: any) => s + (t.votes ?? 0), 0) +
      (data.models ?? []).reduce((s: number, m: any) => s + (m.votes ?? 0), 0) +
      (data.companies ?? []).reduce((s: number, c: any) => s + (c.votes ?? 0), 0);

    return NextResponse.json({
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
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
