import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/authModel";

const generateAccessToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_TOKEN!, { expiresIn: "15m" });
};

export const handleRefreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.sendStatus(401);
    return;
  }

  try {
    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.sendStatus(401);
      return;
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN!,
      (err: Error | null) => {
        if (err) {
          res.sendStatus(401);
        } else {
          const accessToken = generateAccessToken(user._id.toString());
          res.json({ accessToken });
        }
      }
    );
  } catch (err) {
    console.error("Server error during the refresh token process:", err);
    res.sendStatus(500);
  }
};

export const handleTokenVerification = (req: Request, res: Response) => {
  if ((req as any).user) {
    res.status(200).json({
      isValid: true,
      user: (req as any).user,
    });
  } else {
    res.status(401).json({ isValid: false });
  }
};
