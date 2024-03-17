import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { usersRouter } from "./routes/users.js";
import { recipesRouter } from "./routes/recipes.js";
dotenv.config({ path: "../.env" });

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/auth", usersRouter);
app.use("/recipes", recipesRouter);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error: ", err);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server running at Port: ${process.env.PORT}`);
});
