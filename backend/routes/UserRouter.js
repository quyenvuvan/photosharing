const express = require("express");
const User = require("../db/userModel");
const router = express.Router();

router.post("/", async (request, response) => {});

router.get("/list", async (request, response) => {
  try {
    const users = await User.find({}, "_id last_name");
    const usersList = users.map((user) => ({
      _id: user._id,
      last_name: user.last_name,
    }));
    response.json(usersList);
  } catch (error) {
    console.error("Error fetching users:", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/:id", async (request, response) => {
  const userId = request.params.id;

  // Check if the provided ID is valid
  if (!userId) {
    return response.status(400).json({ error: "User ID is required" });
  }

  try {
    // Fetch the user from the database based on ID
    const user = await User.findById(userId);

    // If user not found, return 404
    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }

    // Return detailed user information
    const userDetails = {
      _id: user._id,
      last_name: user.last_name,
      location: user.location,
      description: user.description,
      occupation: user.occupation,
    };

    response.json(userDetails);
  } catch (error) {
    console.error("Error fetching user:", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
