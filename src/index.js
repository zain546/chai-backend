import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({ path: "./.env" });

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      `app is listening on port ${process.env.PORT}`;
    });
  })
  .catch((error) => {
    console.log("Mondo DB connection failed!", error);
  });

// Add this to your app.js file
app.get("/test", (req, res) => {
  res.send("Test route is working");
});
