// server/utils/seedAdmins.js
import bcrypt from "bcrypt";
import User from "../models/User.js";

export async function seedAdmins() {
  try {
    const admins = [
      {
        name: process.env.ADMIN1_NAME,
        email: process.env.ADMIN1_EMAIL,
        password: process.env.ADMIN1_PASSWORD,
      },
      {
        name: process.env.ADMIN2_NAME,
        email: process.env.ADMIN2_EMAIL,
        password: process.env.ADMIN2_PASSWORD,
      },
    ];

    for (const admin of admins) {
      // Skip if env variables are missing
      if (!admin.email || !admin.password) {
        console.warn("⚠️ Skipping admin, missing email or password in .env");
        continue;
      }

      const hashedPassword = await bcrypt.hash(admin.password, 10);

      // Upsert: update if exists, create if it doesn't
      const result = await User.updateOne(
        { email: admin.email },
        {
          $set: {
            name: admin.name,
            email: admin.email,
            password: hashedPassword,
            role: "admin",
            bookmarks: [],
          },
        },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        console.log(`✨ Created admin: ${admin.email}`);
      } else if (result.modifiedCount > 0) {
        console.log(`🔁 Updated admin: ${admin.email}`);
      } else {
        console.log(`✅ Admin already up-to-date: ${admin.email}`);
      }
    }
  } catch (err) {
    console.error("❌ Error seeding admins:", err);
  }
}
