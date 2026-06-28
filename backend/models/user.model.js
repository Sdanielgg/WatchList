export default (mongoose) => {
  const userSchema = new mongoose.Schema(
    {
      username: {
        type: String,
        required: true,
        minlength: 2,
        trim: true,
        unique: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
        lowercase: true,
      },
      password: {
        type: String,
        required: true,
      },
    },
    { timestamps: true },
  );
  const User = mongoose.model("User", userSchema);
  return User;
};
