import { WatchList } from "../models/db.config.js";
import {Media} from "../models/db.config.js";
import { authMiddleware } from "../utils/auth.utils.js";
export const getWatchList = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const watchList = await watchList.find({ user: user.id });
    return res.status(200).json({
      message: "Watchlist retrieved successfully!",
      data: watchList,
    });
  } catch (error) {
    next(error);
  }
};

export const getWatchListById = async (req, res, next) => {
  try {
    const watchList = await watchList.findById(req.params.id);
    return res.status(200).json({
      message: "Watchlist retrieved successfully!",
      data: watchList,
    });
  } catch (error) {
    next(error);
  }
}
export const addWatchList = async (req, res, next) => {
  try {
    const user = req.user;
    const mediaId = req.params.id;
    const { status, rating, notes } = req.body;

    if (!mediaId) {
      return res.status(400).json({
        message: "Media ID is required.",
      });
    }

    const mediaExists = await Media.findById(mediaId);

    if (!mediaExists) {
      return res.status(404).json({
        message: "Media not found.",
      });
    }

    const existingItem = await WatchList.findOne({
      user: req.user.id,
      media: mediaId,
    });

    if (existingItem) {
      return res.status(409).json({
        message: "This media is already in your watchlist.",
      });
    }

    const watchListItem = await WatchList.create({
      user: req.user.id,
      media: mediaId,
      status,
      rating,
      notes,
    });

    return res.status(201).json({
      message: "Watchlist created successfully!",
      data: watchListItem,
    });
  } catch (error) {
    next(error);
  }
};

export const updateWatchList = async (req, res, next) => {
  try {
    const mediaId = req.params.id;
    const { status, rating, notes } = req.body;

    if (!mediaId) {
      return res.status(400).json({
        message: "Media ID is required.",
      });
    }

    const mediaExists = await Media.findById(mediaId);

    if (!mediaExists) {
      return res.status(404).json({
        message: "Media not found.",
      });
    }

    const existingItem = await WatchList.findOne({
      user: req.user.id,
      media: mediaId,
    });

    if (!existingItem) {
      return res.status(404).json({
        message: "This media is not in your watchlist.",
      });
    }

    const errors = {};

    if (status !== undefined) {
      const validStatuses = [
        "Planned",
        "Watching/Reading",
        "Completed",
        "On Hold",
        "Rewatching/Rereading",
        "Dropped",
      ];

      if (!validStatuses.includes(status)) {
        errors.status = ["Invalid status."];
      } else {
        existingItem.status = status;
      }
    }

    if (rating !== undefined) {
      if (rating !== null && (rating < 1 || rating > 10)) {
        errors.rating = ["Rating must be between 1 and 10."];
      } else {
        existingItem.rating = rating;
      }
    }

    if (notes !== undefined) {
      existingItem.notes = notes.trim();
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: "Validation error",
        errors,
      });
    }

    await existingItem.save();

    return res.status(200).json({
      message: "Watchlist updated successfully!",
      data: existingItem,
    });
  } catch (error) {
    next(error);
  }
};