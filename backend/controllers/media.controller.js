import {Media, User} from "../models/db.config.js";
function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
export const getAllMedia = async (req, res, next) => {
  try {
    const media = await Media.find();
    return res.status(200).json({
      message: "Media retrieved successfully!",
      data: media,
    });
  } catch (error) {
    next(error);
  }
};
export const getMediaById = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id);
    return res.status(200).json({
      message: "Media retrieved successfully!",
      data: media,
    });
  } catch (error) {
    next(error);
  }
};

export const createMedia = async (req, res, next) => {
  try {
    const errors = {};

    const {
      title,
      genres,
      type,
      poster,
      releaseYear,
      rating,
      summary,
    } = req.body;

    if (!title || title.trim().length < 2) {
      errors.title = ["Title must have at least 2 characters."];
    }

    if (!genres || !Array.isArray(genres) || genres.length === 0) {
      errors.genres = ["At least one genre is required."];
    }

    if (!type) {
      errors.type = ["Type is required."];
    }

    if (!poster) {
      errors.poster = ["Poster URL is required."];
    } else if (!isValidUrl(poster)) {
      errors.poster = ["Poster URL must be a valid URL."];
    }

    if (
      !releaseYear ||
      releaseYear < 1970 ||
      releaseYear > new Date().getFullYear()
    ) {
      errors.releaseYear = [
        "Release year is required and must be between 1970 and the current year.",
      ];
    }

    if (rating !== undefined && (rating < 0 || rating > 10)) {
      errors.rating = ["Rating must be between 0 and 10."];
    }

    if (summary !== undefined && summary.trim().length > 500) {
      errors.summary = ["Summary cannot have more than 500 characters."];
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: "Validation error",
        errors,
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const media = await Media.create({
      title: title.trim(),
      genres,
      type,
      poster,
      releaseYear,
      rating,
      summary,
      postedBy: req.user.id,
      lastEditedBy: req.user.id,
    });

    return res.status(201).json({
      message: "Media created successfully!",
      data: media,
    });
  } catch (error) {
    next(error);
  }
};

export const patchMedia = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        message: "Media not found.",
      });
    }

    const {
      title,
      genres,
      type,
      poster,
      releaseYear,
      rating,
      summary,
    } = req.body;

    const errors = {};

    if (title !== undefined) {
      if (!title || title.trim().length < 2) {
        errors.title = ["Title must have at least 2 characters."];
      } else {
        media.title = title.trim();
      }
    }

    if (genres !== undefined) {
      if (!Array.isArray(genres) || genres.length === 0) {
        errors.genres = ["Genres must be a non-empty array."];
      } else {
        media.genres = genres;
      }
    }

    if (type !== undefined) {
      if (!type) {
        errors.type = ["Type is required."];
      } else {
        media.type = type;
      }
    }

    if (poster !== undefined) {
      if (!poster) {
        errors.poster = ["Poster URL cannot be empty."];
      } else if (!isValidUrl(poster)) {
        errors.poster = ["Poster URL must be a valid URL."];
      } else {
        media.poster = poster;
      }
    }

    if (releaseYear !== undefined) {
      if (
        !releaseYear ||
        releaseYear < 1970 ||
        releaseYear > new Date().getFullYear()
      ) {
        errors.releaseYear = [
          "Release year must be between 1970 and the current year.",
        ];
      } else {
        media.releaseYear = releaseYear;
      }
    }

    if (rating !== undefined) {
      if (rating < 0 || rating > 10) {
        errors.rating = ["Rating must be between 0 and 10."];
      } else {
        media.rating = rating;
      }
    }

    if (summary !== undefined) {
      if (summary.trim().length > 500) {
        errors.summary = ["Summary cannot have more than 500 characters."];
      } else {
        media.summary = summary.trim();
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: "Validation error",
        errors,
      });
    }

    media.lastEditedBy = req.user.id;

    await media.save();

    return res.status(200).json({
      message: "Media updated successfully!",
      data: media,
    });
  } catch (error) {
    next(error);
  }
};