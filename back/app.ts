import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import categoryRouter from "./routes/categoryRoutes";
import authRouter from "./routes/authRoutes";
import { verifyToken } from "./middlewares/verifyToken";
import { apiLimiter } from "./middlewares/rateLimiters";

const app: Express = express();

app.use(cors({ credentials: true, origin: "https://localhost:5173" }));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "https://localhost:5173");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(express.json());

app.use(apiLimiter);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/categories", verifyToken, categoryRouter);

export default app;
