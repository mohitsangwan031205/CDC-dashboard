import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";

export async function getDashboardStats() {
  await connectDB();

  const [stats] = await Product.aggregate([
    {
      $facet: {
        totalProducts: [{ $count: "count" }],
        totalCategories: [
          { $group: { _id: "$department" } },
          { $count: "count" },
        ],
        lowStock: [
          { $match: { quantityAvailable: { $lte: 5, $gt: 0 } } },
          { $count: "count" },
        ],
        outOfStock: [
          { $match: { quantityAvailable: 0 } },
          { $count: "count" },
        ],
      },
    },
  ]);

  return {
    totalProducts: stats.totalProducts[0]?.count ?? 0,
    totalCategories: stats.totalCategories[0]?.count ?? 0,
    lowStock: stats.lowStock[0]?.count ?? 0,
    outOfStock: stats.outOfStock[0]?.count ?? 0,
  };
}

