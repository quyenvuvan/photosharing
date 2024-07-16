const express = require("express");
const Photo = require("../db/photoModel");
const Users = require("../db/userModel");
const router = express.Router();

router.post("/", async (request, response) => {});

router.get("/photosOfUser/:id", async (request, response) => {
  const userId = request.params.id;

  if (!userId) {
    return response.status(400).json({ error: "User ID is required" });
  }
  try {
    let photos = await Photo.find(
      { user_id: userId },
      "_id user_id file_name date_time comments",
    );

    photos = await Photo.populate(photos, {
      path: "comments.user_id",
      model: "Users",
      select: "_id last_name",
    });
    const modifiedPhotos = photos.map((photo) => {
      const modifiedComments = photo.comments.map((comment) => ({
        ...comment.toObject(),
        user: comment.user_id,
        // Remove user_id key if needed
        user_id: undefined,
      }));
      return {
        ...photo.toObject(),
        comments: modifiedComments,
      };
    });

    response.json(modifiedPhotos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
