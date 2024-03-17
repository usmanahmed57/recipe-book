import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { Recipe } from "../../../server/src/models/Recipes";

function Card({
  name,
  imageUrl,
  ingredients,
  instructions,
  cookingTime,
  userName,
  id,
  savedRecipes,
  bool,
  loggedInUser,
}) {
  const [isSaved, setIsSaved] = useState(bool);
  const [isCurrentUserRecipe, setIsCurrentUserRecipe] = useState(false);
  const [loading, setLoading] = useState(false);
  const userID = useGetUserID();

  const [currentUser, setCurrentUser] = useState(""); // State to hold the username

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        if (userID) {
          const response = await axios.post(
            `${import.meta.env.VITE_API_KEY}/auth/getUser`,
            { userID }
          );
          setCurrentUser(response.data.username);
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    fetchUsername();
  }, [userID]);

  useEffect(() => {
    setIsSaved(bool);
    setIsCurrentUserRecipe(userName === currentUser);
  }, [bool, currentUser]);

  const saveRecipe = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_KEY}/recipes/save`,
        {
          userID,
          recipeID: id,
        }
      );
      setIsSaved(true);
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };

  const deleteRecipe = async () => {
    try {
      setLoading(true);
      const recipeID = id;
      await axios.delete(
        `${import.meta.env.VITE_API_KEY}/recipes/${recipeID}`,
        {
          data: { userID },
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error deleting recipe:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full border rounded-lg shadow border-gray-900">
      <a>
        <img
          className="rounded-t-lg w-full object-cover object-bottom h-48"
          src={imageUrl}
          alt=""
        />
      </a>
      <div className="py-2 px-5">
        <a href="#">
          <h5 className="mb-2 text-xl md:text-2xl font-bold tracking-tight text-center text-indigo-600">
            {name}
          </h5>
        </a>
        <div className="mb-3">
          <p className="font-normal text-base md:text-lg text-black ">
            Ingredients:
          </p>
          <ul>
            {ingredients.map((ingredient, index) => (
              <li key={index} className="text-gray-900 text-base">
                &nbsp; ➡️{ingredient}
              </li>
            ))}
          </ul>
        </div>
        <p className="mb-3 font-normal text-gray-700 text-center">
          {instructions}
        </p>
        <p className="mb-3 text-center bg-indigo-600 font-normal w-fit mx-auto px-4 rounded-lg text-white">
          Cooking Time: {cookingTime} minutes
        </p>
        <a className="inline-flex items-center px-3 py-2 text-base md:text-md font-medium text-center text-black">
          🙋🏻‍♂️ {userName}
        </a>
        {loggedInUser !== null && (
          <div className="flex justify-center space-x-3 mt-3">
            <button
              onClick={saveRecipe}
              className={`text-center bg-indigo-600 font-normal w-fit px-4 rounded-lg text-white ${
                isSaved ? "hidden" : ""
              }`}
            >
              ⭐ Save
            </button>
            {isCurrentUserRecipe && (
              <button
                onClick={deleteRecipe}
                className={`text-center bg-red-600 font-normal w-fit px-4 rounded-lg text-white ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                🗑️ Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Card;
