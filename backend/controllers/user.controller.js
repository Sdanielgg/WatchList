import {User} from "../models/db.config.js";

import {
  hashPassword,
  comparePassword,
  generateToken,
} from "../utils/auth.utils.js";

export const register = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    const errors = {};

    if (!email) {
      errors.email = ["Email is required."];
    }

    if (!password || password.length < 6) {
      errors.password = ["Password must have at least 6 characters."];
    }

    if (!username || username.length < 2) {
      errors.username = ["Username must have at least 2 characters."];
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: "Validation error",
        errors,
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();

    const existingAccount = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });

    if (existingAccount) {
      if (existingAccount.email === normalizedEmail) {
        return res.status(409).json({
          message: "This email is already registered.",
        });
      }

      if (existingAccount.username === normalizedUsername) {
        return res.status(409).json({
          message: "This username is already in use.",
        });
      }
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = generateToken(newUser);

    return res.status(201).json({
      message: "User registered successfully!",
      data: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: "User logged in successfully!",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const patchUser = async (req, res, next) => {
  try {
    const { username, email, newPassword } = req.body;

    const user = await User.findById(req.user.sub);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    if (username) {
      const trimmedUsername = username.trim();

      if (trimmedUsername.length < 2) {
        return res.status(400).json({
          message: "Username must have at least 2 characters.",
        });
      }

      const usernameExists = await User.findOne({
        username: trimmedUsername,
        _id: { $ne: user._id },
      });

      if (usernameExists) {
        return res.status(409).json({
          message: "This username is already in use.",
        });
      }

      user.username = trimmedUsername;
    }

    if (email) {
      const normalizedEmail = email.trim().toLowerCase();

      const emailExists = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });

      if (emailExists) {
        return res.status(409).json({
          message: "This email is already registered.",
        });
      }

      user.email = normalizedEmail;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({
          message: "Password must have at least 6 characters.",
        });
      }

      const hashedPassword = await hashPassword(newPassword);
      user.password = hashedPassword;
    }

    await user.save();
    const token = generateToken(user);
    return res.status(200).json({
      message: "User updated successfully!",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json({
      message: "Users retrieved successfully!",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
