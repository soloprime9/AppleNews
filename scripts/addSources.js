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
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/93/MacRumors.svg/960px-MacRumors.svg.png?20180527173458",
        category: "Apple",
        active: true
      },
      {
        name: "9to5Mac",
        website: "https://9to5mac.com",
        rssUrl: "https://9to5mac.com/feed/",
        logo: "https://9to5mac.com/wp-content/uploads/sites/6/2019/10/cropped-cropped-mac1-1.png?w=32",
        category: "Apple",
        active: true
      },
      {
        name: "Cult of Mac",
        website: "https://www.cultofmac.com",
        rssUrl: "https://www.cultofmac.com/feed",
        logo: "https://www.cultofmac.com/wp-content/uploads/2024/01/cropped-CoM_logo_blue_lrg-copy-80x80.jpg",
        category: "Apple",
        active: true
      },
      {
        name: "Macworld",
        website: "https://www.macworld.com",
        rssUrl: "https://www.macworld.com/feed",
        logo: "https://www.macworld.com/wp-content/uploads/2021/03/cropped-macworld-favicon.png?w=192",
        category: "Apple",
        active: true
      }
    ];

    const ops = sources.map(src => ({
      updateOne: {
        filter: { rssUrl: src.rssUrl },
        update: { $setOnInsert: src },
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
