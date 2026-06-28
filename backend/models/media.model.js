export default (mongoose) => {
  const mediaSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        minlength: 2,
        trim: true,
      },
      genres: {
        type: [String],
        required: true,
        // added custom validation in case user enters a genre that is not in the list
        enum: {
          values: [
            "Action",
            "Adventure",
            "Animation",
            "Comedy",
            "Crime",
            "Documentary",
            "Drama",
            "Fantasy",
            "Horror",
            "Mystery",
            "Romance",
            "Sci-Fi",
            "Thriller",
            "War",
            "Western",
            "Musical",
            "Sports",
            "History",
            "Biography",
            "Family",
          ],
          message: "{VALUE} is not supported",
        },
      },
      type: {
        type: String,
        required: true,
        enum: {
          values: [
            "Movie",
            "Series",
            "Anime",
            "Donghua",
            "Cartoon",
            "Documentary",
            "Short Film",
            "OVA",
            "ONA",
            "Special",
            "Other",
          ],
          message: "{VALUE} is not supported",
        },
      },
      poster: {
        type: String,
        trim: true,
        required: true,
      },
      releaseYear: {
        type: Number,
        required: true,
        min: [1970, "date must be after 1970"],
        max: [new Date().getFullYear(), "date must be before the next year"],
      },
      rating: {
        type: Number,
        required: false,
        min: 0,
        max: 10,
      },
      summary: {
        type: String,
        required: false,
        maxlength: 500,
      },
      postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      lastEditedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    { timestamps: true },
  );
  const Media = mongoose.model("Media", mediaSchema);
  return Media;
};
