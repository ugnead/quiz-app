import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import app from "./app";

const port = 4000;

mongoose
  .connect(process.env.MONGO_URL as string)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`App running on port ${port}`);
    });
  })
  .catch((err: Error) => console.log(err.message));
  