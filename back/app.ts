import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import questionRouter from "./routes/questionRoutes";
import categoryRouter from "./routes/categoryRoutes";
import authRouter from "./routes/authRoutes";

const app: Express = express();

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(express.json());

app.use("/api/v1/questions", questionRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/auth", authRouter);

export default app;