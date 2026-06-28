export default (mongoose) => {
  const watchlistSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      media: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media",
        required: true,
      },

      status: {
        type: String,
        default: "Planned",
        required: true,
        enum: {
          values: [
            "Planned",
            "Watching/Reading",
            "Completed",
            "On Hold",
            "Rewatching/Rereading",
            "Dropped",
          ],
          message: "{VALUE} is not supported",
        },
      },

      rating: {
        type: Number,
        min: 1,
        max: 10,
        default: null,
      },

      notes: {
        type: String,
        trim: true,
      },
    },
    { timestamps: true },
  );

  watchlistSchema.index({ user: 1, media: 1 }, { unique: true });

  const Watchlist = mongoose.model("Watchlist", watchlistSchema);
  return Watchlist;
};