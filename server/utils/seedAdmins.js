// server/utils/seedAdmins.js
import User from "../models/User.js";

/**
 * Creates (or refreshes) two static admin accounts using env vars.
 * Safe for local/dev. Avoid deleting in prod unless intended.
 */
export async function seedAdmins() {
  try {
    const admins = [
      {
        name: process.env.ADMIN1_NAME,
        email: process.env.ADMIN1_EMAIL?.toLowerCase(),
        password: process.env.ADMIN1_PASSWORD,
      },
      {
        name: process.env.ADMIN2_NAME,
        email: process.env.ADMIN2_EMAIL?.toLowerCase(),
        password: process.env.ADMIN2_PASSWORD,
      },
    ].filter(a => a?.name && a?.email && a?.password);

    if (!admins.length) {
      console.log("ℹ️ No ADMINx_* env vars found; skipping admin seeding.");
      return;
    }

    for (const admin of admins) {
      // Dev-friendly: refresh same email to avoid duplicates
      await User.deleteOne({ email: admin.email, role: "admin" });
      await User.create({ ...admin, role: "admin", isSuspended: false });
      console.log(`✅ Admin ensured: ${admin.email}`);
    }
  } catch (err) {
    console.error("❌ Error seeding admins:", err.message);
  }
}
