require("dotenv").config();
require("../connection");

const Source = require("../models/Source");

(async () => {
  try {
    const sources = [
      {
        name: "MacRumors",
        website: "https://www.macrumors.com",
        rssUrl: "https://www.macrumors.com/macrumors.xml",
        logo: "https://news.fondpeace.com/MacRumors.jpg",
        category: "Apple",
        active: true
      },
      {
        name: "9to5Mac",
        website: "https://9to5mac.com",
        rssUrl: "https://9to5mac.com/feed/",
        logo: "https://news.fondpeace.com/9to5mac.jpg",
        category: "Apple",
        active: true
      },
      {
        name: "Cult of Mac",
        website: "https://www.cultofmac.com",
        rssUrl: "https://www.cultofmac.com/feed",
        logo: "https://news.fondpeace.com/cultofapple.jpg",
        category: "Apple",
        active: true
      },
      {
        name: "Macworld",
        website: "https://www.macworld.com",
        rssUrl: "https://www.macworld.com/feed",
        logo: "https://news.fondpeace.com/Macworld.jpg",
        category: "Apple",
        active: true
      }
    ];

    const ops = sources.map(src => ({
  updateOne: {
    filter: { rssUrl: src.rssUrl },
    update: {
      $set: {
        name: src.name,
        website: src.website,
        logo: src.logo,
        category: src.category,
        active: src.active
      }
    },
    upsert: true
  }
}));


    const result = await Source.bulkWrite(ops);

    console.log("✅ Sources synced successfully");
    console.log("🆕 Newly inserted:", result.upsertedCount);

    process.exit(0);
  } catch (err) {
    console.error("❌ Error syncing sources:", err);
    process.exit(1);
  }
})();
