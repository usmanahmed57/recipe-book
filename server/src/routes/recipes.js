import express from "express";

import { Recipe } from "../models/Recipes.js";
import { User } from "../models/Users.js";
const router = express.Router();
router.use(express.json());

router.get("/", async (req, res) => {
  const recipes = await Recipe.find();
  res.json(recipes);
});

router.post("/create", async (req, res) => {
  const { name, ingredients, instructions, imageUrl, cookingTime, userOwner } =
    req.body;
  const newRecipe = new Recipe({
    name,
    ingredients,
    instructions,
    imageUrl,
    cookingTime,
    userOwner,
  });

  await newRecipe.save();
  res.json({
    message: "✅ Recipe created successfully!",
    color: "green",
    recipe: newRecipe,
  });
});

router.put("/save", async (req, res) => {
  const { userID, recipeID } = req.body;

  try {
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found", color: "red" });
    }

    if (user.savedRecipes.includes(recipeID)) {
      return res
        .status(400)
        .json({ message: "Recipe already saved", color: "red" });
    }

    const recipe = await Recipe.findById(recipeID);
    if (!recipe) {
      return res
        .status(404)
        .json({ message: "Recipe not found", color: "red" });
    }

    user.savedRecipes.push(recipeID);
    await user.save();

    res.json({ message: "✅ Recipe saved successfully", color: "green" });
  } catch (error) {
    console.error("Error saving recipe:", error);
    res.status(500).json({ message: "Internal server error", color: "red" });
  }
});

router.get("/saved/:id", async (req, res) => {
  const userID = req.params.id;
  const user = await User.findById(userID);
  const savedRecipes = user.savedRecipes;
  res.json(savedRecipes);
});

router.get("/:id", async (req, res) => {
  const recipeID = req.params.id;
  const recipe = await Recipe.findById(recipeID);
  res.json(recipe);
});

router.delete("/:id", async (req, res) => {
  const recipeID = req.params.id;
  console.log(recipeID);
  const userID = req.body.userID;
  console.log(userID); // Assuming userID is provided in the request body

  try {
    const recipe = await Recipe.findById(recipeID);
    if (!recipe) {
      return res
        .status(404)
        .json({ message: "Recipe not found", color: "red" });
    }
    if (recipe.userOwner._id.toString() !== userID) {
      return res.status(403).json({
        message: "You are not authorized to delete this recipe",
        color: "red",
      });
    }

    await Recipe.findByIdAndDelete(recipeID);

    await User.updateMany({}, { $pull: { savedRecipes: recipeID } });

    res.json({ message: "✅ Recipe deleted successfully", color: "green" });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({ message: "Internal server error", color: "red" });
  }
});

router.put("/unsave", async (req, res) => {
  const { userID, recipeID } = req.body;

  try {
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found", color: "red" });
    }
    user.savedRecipes.pull(recipeID);
    await user.save();
    res.json({ message: "✅ Recipe unsaved successfully", color: "green" });
  } catch (error) {
    console.error("Error unsaving recipe:", error);
    res.status(500).json({ message: "Internal server error", color: "red" });
  }
});

export { router as recipesRouter };
