const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    
    pid: {
      type: Number,
      required: true,
      unique: true,
      index: true
    },

    slug: {
      type: String,
      required: true,
      index: true
    },

    author: {
    type: String,
    trim: true,
    index: true
  },


    excerpt: {
      type: String,
      maxlength: 300
    },

    image: {
      type: String,
      required: true,
      index: true
    },

    originalUrl: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    source: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Source",
      required: true,
      index: true
    },

    publishedAt: {
      type: Date,
      index: true
    },

    fetchedAt: {
      type: Date,
      default: Date.now
    },

    views: {
      type: Number,
      default: 0
    },

    clicks: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Performance indexes
postSchema.index({ publishedAt: -1 });
postSchema.index({ clicks: -1 });

module.exports = mongoose.model("Post", postSchema);
