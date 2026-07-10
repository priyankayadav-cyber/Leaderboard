import { NextRequest, NextResponse } from "next/server";
import dbData from "./data.json";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tab = searchParams.get("tab") || "tools"; // tools, models, companies
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "rank"; // rank, growth, votes, rating, saves
    const category = searchParams.get("category") || "all";
    const pricing = searchParams.get("pricing") || "all";
    const openSource = searchParams.get("openSource") || "all";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Dynamic error/delay simulators for manual checks
    const delay = searchParams.get("delay");
    if (delay) {
      const delayMs = parseInt(delay, 10);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    const forceError = searchParams.get("error");
    if (forceError === "true") {
      return NextResponse.json(
        { error: "Database connection failed. Please try again." },
        { status: 500 }
      );
    }

    // Process dataset based on active tab
    let result: any[] = [];
    if (tab === "models") {
      result = [...dbData.models];
    } else if (tab === "companies") {
      result = [...dbData.companies];
    } else {
      result = [...dbData.tools];
    }

    // 1. Text Search Filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((item) => {
        if (tab === "tools") {
          return (
            item.name.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q) ||
            item.tags.some((tag: string) => tag.toLowerCase().includes(q))
          );
        } else if (tab === "models") {
          return (
            item.name.toLowerCase().includes(q) ||
            item.provider.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q)
          );
        } else {
          return (
            item.name.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            item.headquarters.toLowerCase().includes(q)
          );
        }
      });
    }

    // 2. Category Filter (for Tools or Models)
    if (category !== "all") {
      result = result.filter(
        (item) => item.category.toLowerCase() === category.toLowerCase()
      );
    }

    // 3. Pricing Filter (for Tools or Models)
    if (pricing !== "all" && tab === "tools") {
      result = result.filter(
        (item) => item.pricing.toLowerCase() === pricing.toLowerCase()
      );
    }

    // 4. Open Source Filter (for Models)
    if (openSource !== "all" && tab === "models") {
      const isOS = openSource === "true";
      result = result.filter((item) => item.openSource === isOS);
    }

    // 5. Sorting
    result.sort((a, b) => {
      if (sort === "growth") return b.growth - a.growth;
      if (sort === "votes") return b.votes - a.votes;
      if (sort === "newest") {
        return new Date(b.addedDate || 0).getTime() - new Date(a.addedDate || 0).getTime();
      }
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "saves") return b.saves - a.saves;
      // Default: sort by rank ascending (1 is best)
      return a.rank - b.rank;
    });

    // Pagination
    const totalCount = result.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const paginatedItems = result.slice(startIndex, startIndex + limit);

    // Compute categories list dynamically based on loaded tab dataset
    let categoriesList: string[] = [];
    if (tab === "tools") {
      categoriesList = Array.from(new Set(dbData.tools.map((t) => t.category)));
    } else if (tab === "models") {
      categoriesList = Array.from(new Set(dbData.models.map((m) => m.category)));
    }

    // Global counts for Stats Cards
    const totalToolsCount = dbData.tools.length;
    const totalModelsCount = dbData.models.length;
    const totalCompaniesCount = dbData.companies.length;
    const totalVotesSum =
      dbData.tools.reduce((sum, item) => sum + item.votes, 0) +
      dbData.models.reduce((sum, item) => sum + item.votes, 0) +
      dbData.companies.reduce((sum, item) => sum + item.votes, 0);

    return NextResponse.json({
      items: paginatedItems,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        limit,
      },
      categories: categoriesList.sort(),
      stats: {
        totalTools: totalToolsCount,
        totalModels: totalModelsCount,
        totalCompanies: totalCompaniesCount,
        totalVotes: totalVotesSum,
        hotCategory: "Code Assistant",
      },
    });
  } catch (error) {
    console.error("Leaderboard API Error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
