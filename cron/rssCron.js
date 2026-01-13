const cron = require("node-cron");
const mongoose = require("mongoose");
const Source = require("../models/Source");
const fetchRSS = require("../services/rssFetcher");

cron.schedule("*/1 * * * *", async () => {
  // 🔒 Safety check: DB must be connected
  if (mongoose.connection.readyState !== 1) {
    console.log("⏳ MongoDB not connected, skipping cron run");
    return;
  }

  console.log("⏰ Cron started");

  try {
    const sources = await Source.find({ active: true });
    console.log("📡 Sources found:", sources.length);

    for (const source of sources) {
      console.log("➡️ Fetching:", source.name);
      try {
        await fetchRSS(source);
        console.log("✅ Done:", source.name);
      } catch (err) {
        console.error("❌ RSS error:", source.name, err.message);
      }
    }
  } catch (err) {
    console.error("❌ Cron DB error:", err.message);
  }
});
