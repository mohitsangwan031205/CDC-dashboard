import mongoose from "mongoose";

/**
 * Sales record for analytics
 * (kept to avoid breaking charts)
 */
const SaleSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  quantity: { type: Number, required: true },
  priceAtSale: { type: Number, required: true },
});

const ProductSchema = new mongoose.Schema(
  {
    // 🔁 Renamed & restructured fields
    title: {
      type: String,
      required: true,
    },

    summary: {
      type: String,
    },

    department: {
      type: String,
      required: true,
    },

    unitPrice: {
      type: Number,
      required: true,
    },

    quantityAvailable: {
      type: Number,
      required: true,
    },

    images: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    // 🔒 KEEP analytics-related fields
    unitsSold: {
      type: Number,
      default: 0,
    },

    sales: {
      type: [SaleSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
