import "dotenv/config";


import { connectDB } from "../lib/db";
console.log("MONGODB_URI =", process.env.MONGODB_URI);

import Admin from "../lib/models/Admin";
import bcrypt from "bcryptjs";

async function createAdmin() {
  await connectDB();

  const hashedPassword = await bcrypt.hash("123dummy", 10);

  await Admin.create({
    email: "admin@dummy.com",
    password: hashedPassword,
  });

  console.log("Admin created");
  process.exit(0);
}

createAdmin();
