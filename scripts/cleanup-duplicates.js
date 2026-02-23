import 'dotenv/config';
import connectDB from '../database/index.js';
import models from '../model/index.js';

const deduplicate = async () => {
  try {
    await connectDB();
    console.log("🧹 Starting database deduplication for rizin7427@gmail.com...");

    const user = await models.User.findOne({ email: "rizin7427@gmail.com" });
    if (!user) throw new Error("User not found.");

    // Find all active applications for the user
    const apps = await models.Application.find({ user: user._id, statusFlag: 0 }).sort({ createdAt: -1 });
    
    const seen = new Set();
    const toDelete = [];

    apps.forEach(app => {
      // Create a unique key based on company and email
      const key = `${app.company?.toLowerCase().trim()}_${app.mail?.to?.toLowerCase().trim()}`;
      
      if (seen.has(key)) {
        toDelete.push(app._id);
      } else {
        seen.add(key);
      }
    });

    if (toDelete.length > 0) {
      const result = await models.Application.updateMany(
        { _id: { $in: toDelete } },
        { $set: { statusFlag: 1 } } // Soft delete
      );
      console.log(`✅ Clean-up complete! Moved ${result.modifiedCount} duplicate applications to trash.`);
    } else {
      console.log("✨ No duplicates found. Your database is already clean.");
    }

  } catch (e) {
    console.error("❌ Clean-up failed:", e.message);
  } finally {
    process.exit(0);
  }
};

deduplicate();
