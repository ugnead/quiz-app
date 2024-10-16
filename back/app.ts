import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import categoryRouter from "./routes/categoryRoutes";
import subcategoryRouter from "./routes/subcategoryRoutes";
import userProgressRouter from "./routes/userProgressRoutes";
import authRouter from "./routes/authRoutes";
import adminRouter from "./routes/adminRoutes";
import { verifyToken } from "./middlewares/authMiddleware";
import { apiLimiter } from "./middlewares/rateLimiters";
import { isAdmin } from "./middlewares/authAdmin";

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
app.use("/api/v1/subcategories", verifyToken, subcategoryRouter);
app.use("/api/v1/questions", verifyToken, userProgressRouter);
app.use("/api/v1/admin", verifyToken, isAdmin, adminRouter);

export default app;
